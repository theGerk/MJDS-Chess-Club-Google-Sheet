/// <reference path="Constants.ts"/>


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


function thisfunc()
{
	Logger.log("this just worked");
	throw new Error("Hello benji's inbox.");
}

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

	Boards.attendanceModification(club.Active, attendance);
	Boards.doRatingPeriod(games, club, attendance);
	return club;
}

function setMasterSheet()
{
	let club = FrontEnd.getClub();
	FrontEnd.setClub(club, true);
}

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

function testFunction()
{
	TemplateSheets.generatePageFromTemplate(SpreadsheetApp.getActive(), SpreadsheetApp.getActive().getSheetByName(CONST.pages.newPlayers.template), CONST.pages.newPlayers.defaultRows, CONST.pages.newPlayers.name).activate();
}

function redoAsIs(write?: boolean)
{
	let club = FrontEnd.getClub();
	FrontEnd.setClub(club, write);
}