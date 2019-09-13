/// <reference path="Constants.ts"/>

//#DocumentationFreeZone!!!!
//WHOOP WHOOP
//Alright, now I'll add some docs

/** Who knwos, does something obviously. Looks like its to the now defunct DEVSHEET. */
function transposeSheet()
{
	var u = SpreadsheetApp.getUi();
	var s = SpreadsheetApp.getActive().getSheetByName('DEVSHEET');
	var v = s.getDataRange().getValues();
	var n = [];
	for(var i = 0; i < v[0].length; i++)
	{
		n.push([]);
		for(var j = 0; j < v.length; j++)
			n[i].push(v[j][i]);
	}
	s.getRange(1, 1, n.length, n[0].length).setValues(n);
}

/** Was used for testing errors I think, maybe something else at one point */
function thisfunc()
{
	Logger.log("this just worked");
	throw new Error("Hello benji's inbox.");
}

/** Tests the glicko rating system. Had a bug where it wasn't giving anyone a rating, used this baby to debug that. */
function testGlicko()
{
	let club = FrontEnd.getClub();
	let games = FrontEnd.getGamesPlayedData();

	let everyone = [];
	for(let person in club.Master)
		everyone.push(club.Master[person].glicko);

	Glicko.doRatingPeriod((p) => club.Master[p].glicko, games, everyone);
	return club;
}

/** Had a bug in the board change algorithm, If someone needed to mvoe multiple spots because someone between them and who they beat was absent it would swap them up and then back down. Used this to debug that. */
function testBoards()
{
	let club = FrontEnd.getClub();
	let attendance = FrontEnd.getAttendanceSheetData();
	let games = FrontEnd.getGamesPlayedData();

	for(var i = 0; i < games.length; i++)
	{
		attendance[games[i].white] = true;
		attendance[games[i].black] = true;
	}

	Boards.attendanceBasedMovement(club.Active, attendance);
	Boards.doRatingPeriod(games, club, attendance);
	return club;
}

/** Used to test the getClub and setClub functions which shouldn't have any effect on the sheet, but its cool that it works */
function setMasterSheet()
{
	let club = FrontEnd.getClub();
	FrontEnd.setClub(club, true);
}

/** Alright so for a while I was doing some debugging and there were functions that mostly worked but not quite and I was working on more or less live data. The solution was to make a duplicate of the sheet to run every then update my code as needed and make another duplicate. This ended with a whole bunch of useless copies, so I tried to just use google drives revert to previous version thing, but it seems to have issues revertiing to recent versions, so that was a bust. The final solution came in making copies of each of the sheets that would be modified, running the test, then deleting the modified sheets renaming the copies so they become the new originals. This worked well but I wanted to automate the whole duplication and renaming stuff. This became the really easy solution to that. */
function revert()
{
	let ss = SpreadsheetApp.getActive();
	let names = [
		CONST.pages.master.name,
		CONST.pages.active.name,
		CONST.pages.games.name,
		CONST.pages.attendance.name,
	];

	let pretext = 'Copy of ';

	for(let i = 0; i < names.length; i++)
	{
		let sheet = ss.getSheetByName(names[i]);
		let copy = ss.getSheetByName(pretext + names[i]);

		ss.deleteSheet(sheet);
		ss.insertSheet(names[i], i, { template: copy }).showSheet();
	}


	ss.deleteSheet(ss.getSheetByName(CONST.pages.gamesLog.name));
}


/** So before anything else worked the first system online was the Lampert rating system. We wanted to double check that it did the math correctly so this was written up before everything else worked just to give an output of all the new ratings. The problem was that a lot of probalems were actually made in the hand done math, so we had to show the work for all of the rating changes, thats basically the story. */
function testRatings()
{
	let activeData = FrontEnd.getClub().Active;
	let games = FrontEnd.getGamesPlayedData();

	let data: { [name: string]: Lampert.IRating } = {};
	for(let i = 0; i < activeData.length; i++)
	{
		let current = activeData[i];
		data[current.name] = current.lampert;
	}

	let s = SpreadsheetApp.getActive();
	let output1: any[][] = [['winner', 'old rating', 'new rating', 'looser', 'old rating', 'new rating']]
	for(let i = 0; i < games.length; i++)
	{
		let current = games[i];
		let t1 = data[current.white].rating;
		let t2 = data[current.black].rating;
		Lampert.match(data[current.white], data[current.black], current.result);
		output1.push([current.white, t1, data[current.white].rating, current.black, t2, data[current.black].rating]);
	}
	s.getSheetByName('by game').getRange(1, 1, output1.length, output1[0].length).setValues(output1);

	let sum = 0;
	let count = 0;
	for(let name in data)
	{
		sum += data[name].rating;
		count++;
	}
	let output: any[][] = [['name', 'computer']];
	for(let name in data)
	{
		output.push([name, data[name].rating]);
	}
	s.getSheetByName('ratings').getRange(1, 1, output.length, output[0].length).setValues(output);
}

/** Just needed to test the template sheet's generate function */
function testFunction()
{
	TemplateSheets.generate(SpreadsheetApp.getActive(), SpreadsheetApp.getActive().getSheetByName(CONST.pages.newPlayers.template), CONST.pages.newPlayers.defaultRows, CONST.pages.newPlayers.name).activate();
}

/**
 * This was just to test the get and set club functions when the were first operational
 * @param write Should the test actually change the sheet or do I just want to see the output in my debugger/Logs
 */
function redoAsIs(write?: boolean)
{
	let club = FrontEnd.getClub();
	FrontEnd.setClub(club, write);
}