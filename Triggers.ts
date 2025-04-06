/// <reference path="Constants.ts"/>


function onOpen() {
	SpreadsheetApp.getActive().addMenu("Chess", [
		{ name: 'Add/Update Players', functionName: 'updatePlayers' },
		{ name: 'Insert week\'s games', functionName: 'weeklyUpdate' },
	]);
	//var spreadsheet = SpreadsheetApp.getActive();
	//var menuItems = [
	//	{ name: 'Update', functionName: '_update' },
	//	{ name: 'New week', functionName: 'addWeek' }
	//];
	//spreadsheet.addMenu('Chess Club', menuItems);
}


/** Do update grades */
function gradeUpdate() {
	if (new Date().getMonth() === 6) {
		let newGrade = (grade: string | number) => CONST.gradeAdvancement[grade] || <number>grade + 1;
		let club = FrontEnd.getClub();
		for (let name in club.Master)
			club.Master[name].grade = newGrade(club.Master[name].grade);
		FrontEnd.setClub(club, true);
	}
}

function mergePlayers(correctName: string, falseName: string) {
	let club = FrontEnd.getClub();
	if (!club.Master.hasOwnProperty(correctName))
		throw `${correctName} is not found`;
	if (!club.Master.hasOwnProperty(falseName))
		throw `${falseName} is not found`;
	let correctPlayer = club.Master[correctName];
	let falsePlayer = club.Master[falseName];

	var history = FrontEnd.getHistory();
	for (let i = history.length - 1; i >= 0; --i) {
		let current = history[i];
		let games = current.games;
		for (let i = games.length - 1; i >= 0; --i) {
			if (games[i].black == falseName)
				games[i].black = correctName;
			if (games[i].white == falseName)
				games[i].white = correctName;
		}
		games = games.filter(x => x.white != x.black);
		let attendance = current.attendance;
		attendance[correctName] ||= attendance[falseName];
		delete attendance[falseName];
	}
}

function weeklyUpdate() {
	WeeklyUpdate.doAll(true);
}

//TODO move namespace
/** Namespace for everything that needs to be done to update the club after a week of games */
namespace WeeklyUpdate {
	/**
	 * Does all the stuff for a weekly update.
	 * 
	 * @param write should anything be written to the document, a truthy value will have the document written.
	 */
	export function doAll(write?: boolean) {
		let attendance = FrontEnd.getAttendanceSheetData();
		let gamesPlayed = FrontEnd.getGamesPlayedData();
		let club = FrontEnd.getClub();

		//if there were no games played this week
		if (gamesPlayed.length === 0) {
			//Only do glicko ratings and then end
			let ratings = [];
			for (var person in club.Master)
				ratings.push(club.Master[person].glicko);
			Glicko.doRatingPeriod<string>(name => club.Master[name].glicko, [], ratings);
		}
		else {
			//remove pairs that happened more than twice
			let matchCount: { [matchString: string]: number } = {};
			for (let i = 0; i < gamesPlayed.length; i++) {
				let match = [gamesPlayed[i].white, gamesPlayed[i].black];
				match = match.sort();
				let matchStr = JSON.stringify(match);
				if (matchCount[matchStr] >= CONST.maximumOfSameMatchPerWeek) {
					gamesPlayed.splice(i, 1);	//removes ith element
					i--;
				}
				else {
					matchCount[matchStr] = (matchCount[matchStr] || 0) + 1;
				}
			}

			//get attendance updated by games played
			adjustAttendance(attendance, gamesPlayed);

			//remove an unregistered player if able
			tryRemoveLowestPlayer(club.Active, attendance);

			//update club data with games played
			consumeGamesPlayed(club, gamesPlayed, attendance);

			//modify attendance based on who was here
			for (let i = 0; i < club.Active.length; i++)
				club.Active[i].absent = !attendance[club.Active[i].name];
		}

		if (write) {
			FrontEnd.resetAttendancePage(club.Active);
			FrontEnd.addGameLog({ games: gamesPlayed, attendance: attendance });
			FrontEnd.resetGamesPlayedPage();
			FrontEnd.setClub(club, write);
		}

		//Logger.log(JSON.stringify(club));
	}

	/**
	 * Checks if we are able to remove the lowest player and then does so if conditions are met
	 * @param club Active club portion
	 * @param attendance attendance map (used as set)
	 */
	function tryRemoveLowestPlayer(club: IPlayer[], attendance: { [name: string]: boolean }) {
		let lastPlace = club[club.length - 1];
		//condition for removal
		if (!lastPlace.registered && lastPlace.absent && !attendance[lastPlace.name]) {
			club.pop();
			lastPlace.isActive = false;
			return true;
		}
		return false;
	}


	/**
	 * Adjusts the attendance object to include all the people who played games as here
	 * @param attendanceObj The attendance object, will be mutated
	 * @param gamesPlayed The games played array
	 * @returns a refrence to attenanceObj
	 */
	function adjustAttendance(attendanceObj: { [name: string]: boolean }, gamesPlayed: FrontEnd.IGamePlayed[]) {
		for (let i = 0; i < gamesPlayed.length; i++) {
			attendanceObj[gamesPlayed[i].white] = true;
			attendanceObj[gamesPlayed[i].black] = true;
		}
		return attendanceObj;
	}


	/**
	 * This consumes all the games played during a rating period (one week) does all modifications:
	 *	Moves down players who haven't been there in two weeks.
	 *	Makes board changes based on rating
	 *	Makes lampert rating changes
	 *	Makes Glicko rating changes
	 *	Counts games played and adds that to the players
	 * @param club The club object
	 * @param games array of all games played
	 * @param attendanceObj attendance object, mapping player to if they were here today
	 */
	function consumeGamesPlayed(club: IClub, games: FrontEnd.IGamePlayed[], attendanceObj: { [name: string]: boolean }) {
		//adjusts games played for each player
		for (let i = 0; i < games.length; i++) {
			club.Master[games[i].white].gamesPlayed++;
			club.Master[games[i].black].gamesPlayed++;
		}

		//Does all lampert rating changes
		Lampert.doRatingPeriod((name: string) => club.Master[name].lampert, games);
		//Does all Glicko rating changes (using glicko 2 system)
		let temp: Glicko.IRating[] = [];
		for (let player in club.Master)
			temp.push(club.Master[player].glicko);
		Glicko.doRatingPeriod((name: string) => club.Master[name].glicko, games, temp);

		//go through all games and try and make movements
		Boards.doRatingPeriod(games, club, attendanceObj);
	}

	/**
	 * This deactivates players based on a predicate.
	 * @param activePlayers The active players array
	 * @param shouldRemove The predicate to remove players by
	 */
	function deactivatePlayers(activePlayers: IPlayer[], shouldRemove: (player: IPlayer) => boolean) {
		let writeLoc = 0;
		for (let i = 0; i < activePlayers.length; i++) {
			const player = activePlayers[i];
			if (shouldRemove(player))
				player.isActive = false;
			else {
				player.boardNumber = writeLoc + 1;
				activePlayers[writeLoc++] = player;
			}
		}
		activePlayers.length = writeLoc;
	}
}
