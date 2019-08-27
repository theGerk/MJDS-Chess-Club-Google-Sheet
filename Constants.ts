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