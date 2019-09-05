/// <reference path="Constants.ts"/>


namespace FrontEnd
{
	/** Describes a single row in the master list. */
	export interface IEntryInMasterList
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

	/** What a master list object looks like */
	export interface IMasterListObject { [name: string]: IEntryInMasterList };


	/**
	 * rewrites the entire master sheet
	 * @param masterListData An IMasterListObject, this is what the master list will be set as
	 * @param write Can be left blank or false for testing where changes are not desired
	 * @returns Can be used for testing, generally to be treated as a void function
	 */
	export function writeMasterListData(masterListData: IMasterListObject, write?: boolean)
	{
		//Without the Set class, using an object as a set seems sufficent

		//maps old name to new name
		let oldToNew_NameMap: { [name: string]: string } = {};
		//maps new name to old name
		let newToOld_NameMap: { [name: string]: string } = {};

		//first set up name map
		for(let initialName in masterListData)
		{
			if(initialName !== masterListData[initialName].name)
			{
				//checks to see if the name is already a new name
				if(newToOld_NameMap.hasOwnProperty(masterListData[initialName].name))
				{
					throw new Error(`The name ${masterListData[initialName].name} is being given twice. Can not write master list with duplicate names!`);
				}


				oldToNew_NameMap[initialName] = masterListData[initialName].name;
				newToOld_NameMap[masterListData[initialName].name] = initialName;
			}
		}

		//now check for any new name conflicts with old names
		for(let newName in newToOld_NameMap)
		{
			if(masterListData.hasOwnProperty(newName) && !oldToNew_NameMap.hasOwnProperty(newName))
			{
				throw new Error(`The name ${newName} already exists in master list. Can not write master list with duplicate names!`);
			}
		}


		//everything seems okay, lets create output object
		let output: any[][] = [];
		for(let initialName in masterListData)
		{
			let readRow = masterListData[initialName];
			let writeRow = [];
			writeRow[CONST.pages.master.columns.gamesPlayed] = readRow.gamesPlayed;
			writeRow[CONST.pages.master.columns.grade] = readRow.grade;
			writeRow[CONST.pages.master.columns.group] = readRow.group;
			writeRow[CONST.pages.master.columns.lampertRating] = readRow.lampertRating;
			writeRow[CONST.pages.master.columns.name] = readRow.name;
			writeRow[CONST.pages.master.columns.glickoRating] = readRow.glickoRating;
			writeRow[CONST.pages.master.columns.glickoRatingDeviation] = readRow.glickoDeviation;
			writeRow[CONST.pages.master.columns.glickoRatingVariance] = readRow.glickoVariance;

			let winsArray: string[] = [];
			for(let opponentName in readRow.storedWins)
			{
				let winName = newToOld_NameMap.hasOwnProperty(opponentName) ? newToOld_NameMap[opponentName] : opponentName;
				let winCount = readRow.storedWins[opponentName];
				winsArray.push(winName + ' ' + winCount);
			}

			writeRow[CONST.pages.master.columns.storedWins] = winsArray.join(CONST.pages.master.storedWinSeperator);
			output.push(writeRow);
		}

		if(write)
		{
			let sheet = SpreadsheetApp.getActive().getSheetByName(CONST.pages.master.name);
			sheet.getDataRange().offset(1, 0).clearContent();
			sheet.getRange(2, 1, output.length, output[0].length).setValues(output);
		}
		return output;
	}

	/**
	 * Gets all the data stored in the master list as a single object
	 * 
	 * @returns an object mapping names to their entry in the master list
	 */
	export function getMasterListData()
	{
		let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.master.name).getDataRange().getValues();
		let output: IMasterListObject = {};
		for(let i = 1; i < data.length; i++)
		{
			let row = data[i];
			let name = row[CONST.pages.master.columns.name];

			//check for redundancy
			if(output.hasOwnProperty(name))
			{
				SpreadsheetApp.getUi().alert(`${name} appears on row ${output[name].row + 2} and row ${i + 1}. THIS MUST BE FIXED!`);
				Logger.log(`${name} appears on row ${output[name].row + 2} and row ${i + 1}.`);
				throw new Error("Redundant primary key");
			}

			let storedWinsString: string = row[CONST.pages.master.columns.storedWins];
			let storedWinsObject: { [name: string]: number } = {};
			if(storedWinsString)
			{
				let temp = storedWinsString.split(CONST.pages.master.storedWinSeperator);
				for(let j = 0; j < temp.length; j++)
				{
					let opponenet_name = temp[j].substring(0, temp[j].length - 2);
					//TODO add try catch around next line to allow for not having a number in the stored wins list for the master sheet
					//Currently only allows "Harry Potter 1, Ginny Weasly 2"
					//Should be equivalent to "Harry Potter, Ginny Weasly 2" or "Harry Potter 1, Ginny Weasly, Ginny Weasly"
					//Update: Maybe don't do this as it prevents a name from ending with a number as in the case of "James Potter_0" and James Potter_1", maybe this isn't an issue but requires further thought.
					let number = parseInt(temp[j].substring(temp[j].length - 1));

					if(storedWinsObject.hasOwnProperty(opponenet_name))
						storedWinsObject[opponenet_name] += number;
					else
						storedWinsObject[opponenet_name] = number;
				}
			}

			//set all the values
			output[name] = {
				name: name,
				group: row[CONST.pages.master.columns.group],
				grade: row[CONST.pages.master.columns.grade],
				lampertRating: row[CONST.pages.master.columns.lampertRating],
				gamesPlayed: row[CONST.pages.master.columns.gamesPlayed],
				glickoRating: row[CONST.pages.master.columns.glickoRating] || 0,
				glickoDeviation: row[CONST.pages.master.columns.glickoRatingDeviation] || null,
				glickoVariance: row[CONST.pages.master.columns.glickoRatingVariance] || 0,
				row: i - 1,
				storedWins: storedWinsObject
			}
		}

		//check to make sure all the stored wins are against valid opponents
		for(let player in output)
		{
			let current = output[player].storedWins;
			for(let opponent in current)
			{
				if(opponent === player || !output.hasOwnProperty(opponent))
				{
					var ui: GoogleAppsScript.Base.Ui = ui || SpreadsheetApp.getUi();

					//problem!
					let logLine1 = `Master list data error: ${player} (row ${output[player].row}) has played ${output} who does not exist.`;

					//Make the user aware right now
					let buttonResponse = ui.alert(`Data Error in master list.`, `On row ${output[player].row} of page ${CONST.pages.master.name}, player ${player}, supposedly has a win against ${opponent}, however ${opponent} does not exist in the master list. Do you want this automatically removed?

Press YES if you want this opponent to be removed from master list.
Press NO if you want this opponent to be ignored for now, but not removed.
Press CANCEL if you want to simple stop the script and fix the issue.`, ui.ButtonSet.YES_NO_CANCEL);

					switch(buttonResponse)
					{
						case ui.Button.YES:
						//TODO make fixing possible
						case ui.Button.NO:
							Logger.log(`${logLine1} Ignoring for now.`);
							delete current[opponent];
							break;
						case ui.Button.CANCEL:
							Logger.log(`${logLine1} Killing script.`);
							throw new Error(logLine1);
						default:
							break;
					}
				}
			}
		}


		return output;
	}

	/** Stores data about a game that was played */
	export interface IGamePlayed
	{
		/** White player's name */
		white: string;
		/** Black player's name */
		black: string;
		/** Result for white (1 => win, .5 => draw, 0 => loss)*/
		result: number;
		/** Timestamp, may not be used */
		timestamp: number;
	}

	/**
	 * Gets all the data stored in the games list as a single array
	 * 
	 * @returns an array of every game played.
	 */
	export function getGamesPlayedData(): IGamePlayed[]
	{
		let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.games.name).getDataRange().getValues();
		let output: IGamePlayed[] = [];
		for(let i = 1; i < data.length && data[i][CONST.pages.games.columns.GameNumber]; i++)
		{
			let currentRow = data[i];
			output.push({
				white: currentRow[CONST.pages.games.columns.white],
				black: currentRow[CONST.pages.games.columns.black],
				result: CONST.pages.games.resultMap[currentRow[CONST.pages.games.columns.result]],
				timestamp: Date.now()
			});
		}
		return output;
	}

	/**
	 * Returns array of all players who were signed in
	 * 
	 * @returns array of players signed in
	 */
	export function getAttendanceSheetData(): string[]
	{
		let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.attendance.name).getDataRange().getValues();
		let output: string[] = [];
		for(let i = 1; i < data.length; i++)
		{
			let currentRow = data[i];
			if(currentRow[CONST.pages.attendance.columns.attend])
				output.push(currentRow[CONST.pages.attendance.columns.name]);
		}
		return output;
	}


	/** All data held on master sheet about an active player */
	export interface IActivePlayerData
	{
		/** Name [Unique] */
		name: string;
		/** Board number, this is unique but also changes */
		board: number;
		/** array refering the the number of wins against people above them and losses to those below */
		previousWins: number[];
		/** The Lampert Rating */
		lampertRating: number;
		/** The group */
		group: string;
		/** The grade */
		grade: string | number;
		/** The number of points */
		points: number;
		/** Did they miss last session? */
		missed: boolean;
	}

	/** gets all data from the active players page */
	export function getActivePlayerData()
	{
		let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.active.name).getDataRange().getValues();
		let output: IActivePlayerData[] = [];
		for(let i = 1; i < data.length; i++)
		{
			let currentRow = data[i];
			output.push({
				name: currentRow[CONST.pages.active.columns.name],
				board: currentRow[CONST.pages.active.columns.board],
				previousWins: currentRow.slice(CONST.pages.active.columns.wins),
				lampertRating: currentRow[CONST.pages.active.columns.rating],
				grade: currentRow[CONST.pages.active.columns.grade],
				group: currentRow[CONST.pages.active.columns.group],
				points: currentRow[CONST.pages.active.columns.points],
				missed: currentRow[CONST.pages.active.columns.missed]
			});
		}
		return output;
	}

	/** All data for a single row from new player page */
	export interface INewPlayerData
	{
		/** Name [Unique] */
		name: string;
		/** grade */
		grade: string | number;
		/** group */
		group: string;
	}

	/** Gets all data from new player sheet and returns it as an array */
	export function getNewPlayerData()
	{
		let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.newPlayers.name).getDataRange().getValues();
		let output: INewPlayerData[] = [];
		for(let i = 0; i < data.length && data[i][CONST.pages.newPlayers.columns.name]; i++)
		{
			let currentRow = data[i];
			output.push({
				name: currentRow[CONST.pages.newPlayers.columns.name],
				grade: currentRow[CONST.pages.newPlayers.columns.grade],
				group: currentRow[CONST.pages.newPlayers.columns.group]
			});
		}
		return output;
	}
}