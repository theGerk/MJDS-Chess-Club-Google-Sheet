//references
/// <reference path="node_modules/@types/google-apps-script/index.d.ts"/>
/// <reference path="TemplatePages.ts"/>


/** Constants object, useful for many global constants. */
const CONST = {
	RobinFontSize: 14,
	pages: {
		gamesLog: {
			name: 'Game Log',
			columns: {
				data: 0,
			},
		},
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
			template: 'PrintPage-template',
			name: 'Print Page',
			ranges: {
				players: 'ACTIVE_PLAYERS',
			},
			columns: {
				board: 0,
				name: 1,
				group: 2,
				grade: 3,
				LampertRating: 4,
				GlickoRating: 5,
				points: 6,
				missed: 7,
				wins: 8,
			},
			regcolors: {
				registered: '#ffff00', // yellow
				unregistered: '#ffffff', // white
			},
			storedWinColumnSize: 19,
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
				registered: 3,
				newName: 4,
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
		initialRating: 1000,
	},
	maximumOfSameMatchPerWeek: 2,
};

/** Represents the most general player */
interface IPlayer
{
	/** Player name [Unique] */
	name: string;
	/** Board number, null if inactive (part of active player data) */
	boardNumber: number;
	/** grade */
	grade: string | number;
	/** group */
	group: string;
	/** number of games played so far */
	gamesPlayed: number;
	/** Stored wins, as they may be found from the master list as a map */
	storedWins: { [name: string]: number };
	/** is the player active? */
	isActive: boolean;
	/** An object for the player's glicko rating */
	glicko: Glicko.IRating;
	/** An object for the player's Lampert rating */
	lampert: Lampert.IRating;
	/** Was the player abset last week (part of active player data) */
	absent: boolean;
	/** Points the player has */
	points: number;
	/** Is the player registered, player must be active or this is ignored */
	registered: boolean;
}


/** A single object representing the entire club. Members of and Active should both refrence the same object, they should not be copies. */
interface IClub
{
	/** A map from names to player */
	Master: { [name: string]: IPlayer };
	/** An array of active players in board number order */
	Active: IPlayer[];
}
