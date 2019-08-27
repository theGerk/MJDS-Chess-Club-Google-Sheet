//references
/// <reference path="node_modules/@types/google-apps-script/index.d.ts"/>


const CONST = {
	pages: {
		master: {
			name: 'Master Sheet',
			columns: {
				name: 0,
				group: 1,
				lampertRating: 2,
				glickoRating: 3,
				glickoRatingDeviation: 4,
				glickoRatingVariance: 5,
				storedWins: 6,
				grade: 7,
				gamesPlayed: 8,
			},
		},
		main: {
			name: 'Print Page',
			columns: {
				board: 0,
				name: 1,
				group: 2,
				grade: 3,
				rating: 4,
				points: 5,
				missed: 6,
				wins: 7,
			},
		},
		games: {
			name: 'Games Played',
			columns: {
				player1: 1,
				result: 2,
				player2: 3,
			},
		},
	},
};



function initialize(inputObj: any)
{
	let output: any[][] = [];
	for (let current in inputObj)
	{
		let c = inputObj[current];
		let row = [];
		row[CONST.pages.master.columns.gamesPlayed] = 0;
		row[CONST.pages.master.columns.grade] = c.grade;
		row[CONST.pages.master.columns.group] = c.group;
		row[CONST.pages.master.columns.lampertRating] = c.rating;
		row[CONST.pages.master.columns.name] = c.name;
		row[CONST.pages.master.columns.storedWins] = c.wins_updated.join(', ');
		row[CONST.pages.master.columns.glickoRating] = "";
		row[CONST.pages.master.columns.glickoRatingDeviation] = "";
		row[CONST.pages.master.columns.glickoRatingVariance] = "";
		output.push(row);
	}
	SpreadsheetApp.getActive().getSheetByName(CONST.pages.master.name).getRange(2, 1, output.length, output[0].length).setValues(output);
}