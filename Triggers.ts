/// <reference path="Constants.ts"/>


function onOpen()
{
	SpreadsheetApp.getActive().addMenu("Chess", [
		{ name: 'Add/Update Players', functionName: 'updatePlayers' },
		{ name: 'Developer Button', functionName: 'testFunction' }
	]);
	//var spreadsheet = SpreadsheetApp.getActive();
	//var menuItems = [
	//	{ name: 'Update', functionName: '_update' },
	//	{ name: 'New week', functionName: 'addWeek' }
	//];
	//spreadsheet.addMenu('Chess Club', menuItems);
}


function weeklyUpdate()
{
	WeeklyUpdate.doAll(true);
}

namespace WeeklyUpdate
{
	//TODO there are some things left, not much here
	export function doAll(write?: boolean)
	{
		let attendance = FrontEnd.getAttendanceSheetData();
		let gamesPlayed = FrontEnd.getGamesPlayedData();
		let club = FrontEnd.getClub();

		//get attendance updated by games played
		adjustAttendance(attendance, gamesPlayed);

		//remove an unregistered player if able
		tryRemoveLowestPlayer(club.Active, attendance);

		//move people down based on attendance
		Boards.attendanceModification(club.Active, attendance);

		//update club data with games played
		consumeGamesPlayed(club, gamesPlayed, attendance);

		//modify attendance based on who was here
		for(let i = 0; i < club.Active.length; i++)
			club.Active[i].absent = !attendance.hasOwnProperty(club.Active[i].name);

		if(write)
		{
			FrontEnd.resetAttendancePage(club.Active);
			FrontEnd.addGameLog({ games: gamesPlayed, attendance: attendance });
			FrontEnd.resetGamesPlayedPage();
			FrontEnd.setClub(club, write);
		}

		Logger.log(JSON.stringify(club));
	}

	/**
	 * Checks if we are able to remove the lowest player and then does so if conditions are met
	 * @param club Active club portion
	 * @param attendance attendance map (used as set)
	 */
	function tryRemoveLowestPlayer(club: IPlayer[], attendance: { [name: string]: boolean })
	{
		let lastPlace = club[club.length - 1];
		//condition for removal
		if(!lastPlace.registered && lastPlace.absent && !attendance.hasOwnProperty(lastPlace.name))
		{
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
	function adjustAttendance(attendanceObj: { [name: string]: boolean }, gamesPlayed: FrontEnd.IGamePlayed[])
	{
		for(let i = 0; i < gamesPlayed.length; i++)
		{
			attendanceObj[gamesPlayed[i].white] = true;
			attendanceObj[gamesPlayed[i].black] = true;
		}
		return attendanceObj;
	}


	//TODO oh boy a biggy here, lets do it!
	function consumeGamesPlayed(club: IClub, games: FrontEnd.IGamePlayed[], attendanceObj: { [name: string]: boolean })
	{
		//adjusts games played for each player
		for(let i = 0; i < games.length; i++)
		{
			club.Master[games[i].white].gamesPlayed++;
			club.Master[games[i].black].gamesPlayed++;
		}

		//Does all lampert rating changes
		Lampert.doRatingPeriod((name: string) => club.Master[name].lampert, games);
		//Does all Glicko rating changes (using glicko 2 system)
		let temp: Glicko.IRating[] = [];
		for(let player in club.Master)
			temp.push(club.Master[player].glicko);
		Glicko.doRatingPeriod((name: string) => club.Master[name].glicko, games, temp);

		//go through all games and try and make movements
		Boards.doRatingPeriod(games, club, attendanceObj);
	}
}