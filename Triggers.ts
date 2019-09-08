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
	WeeklyUpdate.doAll();
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

		//update club data with games played
		consumeGamesPlayed(club, gamesPlayed);

		//do attendance modifications on the club
		for(let i = 0; i < club.Active.length; i++)
			club.Active[i].absent = attendance.hasOwnProperty(club.Active[i].name);

		if(write)
		{
			FrontEnd.resetAttendancePage(club.Active);
			FrontEnd.addGameLog(gamesPlayed);
			FrontEnd.resetGamesPlayedPage();
			FrontEnd.setClub(club, write);
		}

		Logger.log(JSON.stringify(club));
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
	function consumeGamesPlayed(club: IClub, games: FrontEnd.IGamePlayed[])
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

		//TODO do board changes (including removing inactive players)

	}
}