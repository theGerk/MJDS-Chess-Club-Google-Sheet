///<reference path="Constants.ts"/>

interface IEntry
{
	name: string;
	group: string;
	grade: number | string;
	lampertRating: number;
	glickoRating: number;
	glickoDeviation: number;
	glickoVariance: number;
	gamesPlayed: number;
	storedWins: {
		name: string,
		count: number,
	}[]
	row: number;	//do not use as identifier or store outside
}

function getMasterListData()
{
	let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.master.name).getDataRange().getValues();
	let output: { [name: string]: IEntry } = {};
	for (let i = 1; i < data.length; i++)
	{
		let row = data[i];
		let name = row[CONST.pages.master.name];

		//check for redundancy
		if (output.hasOwnProperty(name))
		{
			SpreadsheetApp.getUi().alert(`${name} appears on row ${output[name].row + 2} and row ${i + 1}. THIS MUST BE FIXED!`);
			Logger.log(`${name} appears on row ${output[name].row + 2} and row ${i + 1}.`);
			throw new Error("Redundant primary key");
		}

		let storedWinsString: string = row[CONST.pages.master.columns.storedWins];
		let storedWinsArray: { name: string, count: number }[] = [];
		if (storedWinsString)
		{
			let temp = storedWinsString.split(CONST.pages.master.storedWinSeperator);
			for (let i = 0; )
			let obj = {
				name: storedWinsString.match(/(.+) (\d)/)
			}
		}


		//set all the values
		output[name] = {
			name: name,
			group: row[CONST.pages.master.columns.group],
			grade: row[CONST.pages.master.columns.grade],
			lampertRating: row[CONST.pages.master.columns.lampertRating],
			gamesPlayed: row[CONST.pages.master.columns.gamesPlayed],
			glickoDeviation: row[CONST.pages.master.columns.glickoRatingDeviation],
			glickoRating: row[CONST.pages.master.columns.glickoRating],
			glickoVariance: row[CONST.pages.master.columns.glickoRatingVariance],
			row: i - 1,
			storedWins: (<string>row[CONST.pages.master.columns.storedWins]).match(/(.+) (\d)/)
		}
	}
}

function addPlayer(): void
{
	let spreadsheet = SpreadsheetApp.getActive();
	let ui = SpreadsheetApp.getUi();
	let response = ui.prompt('Enter player name', 'Name of player (ex: "Benji Altman")', ui.ButtonSet.OK_CANCEL);
	if (response.getSelectedButton() === ui.Button.OK)
	{
		let masterListData = spreadsheet.getSheetByName(CONST.pages.master.name).getDataRange().getValues();


		response.getResponseText().toLowerCase()
	}
}