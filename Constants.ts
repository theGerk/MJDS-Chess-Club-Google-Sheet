//references
/// <reference path="node_modules/@types/google-apps-script/index.d.ts"/>
/// <reference path="TemplatePages.ts"/>



const CONST = {
	pages: {
		master: {
			name: 'Master Sheet',
			storedWinSeperator: ', ',
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
		active: {
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
				GameNumber: 0,
				white: 1,
				result: 2,
				black: 3,
            },
            resultMap: {
                'Win': 1,
                'Draw': .5,
                'Loss': 0,
                1: 'Win',
                .5: 'Draw',
                0: 'Loss',
            },
		},
		attendance: {
			template: 'Attendance-Template',
			columns: {
				name: 0,
				attend: 1,
			},
			name: 'Attendance',
		},
		newPlayers: {
			template: 'UpdatePlayers-Template',
			columns: {
				name: 0,
				group: 1,
				grade: 2,
			},
			name: 'Update Players',
			defaultRows: 20,
		},
	},
	gradeAdvancement: {
		'Pre-K': 'K',
		'K': 1,
		12: 'A',
		'A': 'A',
	},
	ratings: {
		lampert: {
			ratio: .1,
			minimumGainOnWin: 1,
			maximumGainOnWin: 100,
		},
	},
};