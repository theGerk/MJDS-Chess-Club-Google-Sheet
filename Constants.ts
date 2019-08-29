//references
/// <reference path="node_modules/@types/google-apps-script/index.d.ts"/>


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
				player1: 1,
				result: 2,
				player2: 3,
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
	},
	gradeAdvancement: {
		'Pre-K': 'K',
		'K': 1,
		12: 'A',
		'A': 'A',
	},
};


/**
 * Describes a single row in the master list.
 */
interface IEntryInMasterList
{
	/** The player's name (Unique ID). */
	name: string;
	/** The player's group (may be blank for no group). */
	group: string;
	/** The player's grade (K => kindergarden, A => above 12th grade, Pre-K => pre-kindergarden). */
	grade: number | string;
	/** The player's Lampert rating, using system developed by Larry Lampert. */
	lampertRating: number;
	/**
	 * The player's glicko-2 rating (shifted).
	 * Empty means no rating.
	 */
	glickoRating: number;
	/** 
	 * The player's glicko-2 rating deviation (shifted).
	 * Empty means no rating.
	 */
	glickoDeviation: number;
	/**
	 * The player's glicko-2 variance.
	 * Empty means no rating.
	 */
	glickoVariance: number;
	/** Number of games player has played since start of 2019-20 year at the club. */
	gamesPlayed: number;
	/** A map from a player name to a number (1 or 2) giving the number of times the player has beaten them for ladder advancements. */
	storedWins: { [name: string]: number };
	/**
	 * The row that a player appeared on in the master list.
	 * Not to be used as an ID, may change between executions unexpectedly.
	 */
	row: number;
}