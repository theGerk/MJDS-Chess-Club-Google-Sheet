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
	let output1: any[][] = [['winner', 'old rating', 'new rating', 'looser','old rating', 'new rating']]
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