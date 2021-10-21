/// <reference path="Constants.ts"/>

/** Namespace for functions that deal with the google sheet directly */
namespace FrontEnd
{
	/** 
	 *  Gets all of the players in the club as a nice object
	 *  @returns the entire club as an object
	 */
	export function getClub(): IClub
	{
		let masterList = getMasterListData();
		let output: IClub = {
			Master: {},
			Active: []
		};

		//first generate object from master list assuming everyone is not in the club
		for(let name in masterList)
		{
			output.Master[name] = convertIEntryInMasterListToIPlayer(masterList[name]);
		}

		//now add in data for active players
		let activeList = getActivePlayerData();

		for(let i = 0; i < activeList.length; i++)
		{
			let currentRow = activeList[i];

			//first check to make sure the person is in output
			if(!output.Master.hasOwnProperty(currentRow.name))
				throw new Error(`Player: ${currentRow.name} on board ${currentRow.board} is in the active club, but not the master list!`);

			let currentPlayer = output.Master[currentRow.name];

			//now check to make sure the person was not already covered in active players (check for no duplicates)
			if(currentPlayer.isActive)
				throw new Error(`Player: ${currentRow.name} appears twice in active club, on both boards: ${output.Master[currentRow.name].boardNumber} and ${currentRow.board}.`);

			//now we are good to set the active data
			currentPlayer.boardNumber = currentRow.board;
			currentPlayer.isActive = true;
			currentPlayer.absent = currentRow.absent;
			currentPlayer.points = currentRow.points;
			currentPlayer.registered = currentRow.registered;

			//add to the active array
			output.Active[currentRow.board - 1] = currentPlayer;
		}

		//can remove this later, simply used for initial run
		//for(let i = 0; i < activeList.length; i++)
		//	output.Active[i].storedWins = convertStoredWinsArrayToObject(activeList[i].storedWins, output.Active);

		return output;
	}

	/**
	 * sets the entire club data based on a club object
	 * @param club The inputed club object
	 * @param write optional, must be set to true in order to write anything to the spreadsheet, may otherwise be used for testing purposes
	 * @returns The output data that would be writen to Master and Active sheets, can be used for debugging and testing.
	 */
	export function setClub(club: IClub, write?: boolean)
	{
		let output: { Master: any[][], Active: any[][] } = { Master: null, Active: null };
		output.Master = writeMasterListData(club.Master, write);
		output.Active = writeActivePlayerData(club.Active, write);
		return output;
	}

	/**
	 * Converts an object mapping names to wins to an array format that is used on the final page
	 * @param input the object mapping names to wins
	 * @param club the object representing the entire club
	 */
	function convertStoredWinsObjectToArray(input: { [name: string]: number }, club: { [name: string]: IPlayer })
	{
		let output: number[] = [];
		for(var name in input)
		{
			if(!club.hasOwnProperty(name))
				throw new Error(`club does not have player with name: ${name}`);

			if(club[name].boardNumber)
				output[club[name].boardNumber - 1] = input[name];
		}
		return output;
	}


	//Not sure if ever to be used
	/**
	 * Converts input to a map from names to win count based on board numbers in club object
	 * @param input An array with meaning that player on board i + 1 has been beated input[i] times.
	 * @param club An array with the meaning that player at club[i] has board i in the club.
	 */
	function convertStoredWinsArrayToObject(input: number[], club: IPlayer[])
	{
		let output: { [name: string]: number } = {};
		for(var i = 0; i < input.length && i < club.length; i++)
		{
			if(input[i])
				Logger.log(input[i]);
			if(input[i] > 0)
				output[club[i].name] = input[i];
		}
		return output;
	}

	function convertIPlayerToEntryInMasterList(input: IPlayer): IEntryInMasterList
	{
		return {
			row: Math.random(),	//why not?
			name: input.name,
			grade: input.grade,
			group: input.group,
			gamesPlayed: input.gamesPlayed,
			storedWins: Benji.deepClone(input.storedWins),
			glickoRating: input.glicko.rating,
			glickoDeviation: input.glicko.deviation,
			glickoVariance: input.glicko.volatility,
			lampertRating: input.lampert.rating
		};
	}

	function convertIEntryInMasterListToIPlayer(input: IEntryInMasterList): IPlayer
	{
		return {
			name: input.name,
			boardNumber: null,
			grade: input.grade,
			group: input.group,
			gamesPlayed: input.gamesPlayed,
			storedWins: Benji.deepClone(input.storedWins),
			isActive: false,
			glicko: {
				rating: input.glickoRating,
				deviation: input.glickoDeviation,
				volatility: input.glickoVariance
			},
			lampert: { rating: input.lampertRating },
			absent: null,
			points: null,
			registered: null
		};
	}

	/** Describes a single row in the master list. */
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
		 * Really is only used for debuging
		 */
		row: number;
	}

	/** What a master list object looks like */
	interface IMasterListObject { [name: string]: IEntryInMasterList }

	/**
	 * Rewrites the entire master sheet
	 * @param clubData An IMasterListObject, this is what the master list will be set as
	 * @param write Can be left blank or false for testing where changes are not desired
	 * @returns Can be used for testing, generally to be treated as a void function
	 */
	function writeMasterListData(clubData: { [name: string]: IPlayer }, write?: boolean)
	{
		//Without the Set class, using an object as a set seems sufficent

		//maps old name to new name
		let oldToNew_NameMap: { [name: string]: string } = {};
		//maps new name to old name
		let newToOld_NameMap: { [name: string]: string } = {};

		//first set up name map
		for(let initialName in clubData)
		{
			if(initialName !== clubData[initialName].name)
			{
				//checks to see if the name is already a new name
				if(newToOld_NameMap.hasOwnProperty(clubData[initialName].name))
				{
					throw new Error(`The name ${clubData[initialName].name} is being given twice. Can not write master list with duplicate names!`);
				}


				oldToNew_NameMap[initialName] = clubData[initialName].name;
				newToOld_NameMap[clubData[initialName].name] = initialName;
			}
		}

		//now check for any new name conflicts with old names
		for(let newName in newToOld_NameMap)
		{
			if(clubData.hasOwnProperty(newName) && !oldToNew_NameMap.hasOwnProperty(newName))
			{
				throw new Error(`The name ${newName} already exists in master list. Can not write master list with duplicate names!`);
			}
		}

		//everything seems okay, lets create output object
		let output: any[][] = [];
		for(let initialName in clubData)
		{
			let readRow = clubData[initialName];

			//TODO move this functionality elsewhere
			//rectify the stored wins object, this will be done such that it affects the input, should maybe make this clearer, but works for now!
			let storedWins: { [name: string]: number } = {};
			for(let opponentName in readRow.storedWins)
			{
				let value = readRow.storedWins[opponentName];
				//this value is used as a work around for now, maybe later fix it so it can go as high as desried.
				if(value > 9)
					value = 9;

				if(oldToNew_NameMap.hasOwnProperty(opponentName))
					storedWins[oldToNew_NameMap[opponentName]] = value;
				else
					storedWins[opponentName] = value;
			}
			readRow.storedWins = storedWins;


			let writeRow = [];
			writeRow[CONST.pages.master.columns.gamesPlayed] = readRow.gamesPlayed;
			writeRow[CONST.pages.master.columns.grade] = readRow.grade;
			writeRow[CONST.pages.master.columns.group] = readRow.group;
			writeRow[CONST.pages.master.columns.lampertRating] = readRow.lampert.rating;
			writeRow[CONST.pages.master.columns.name] = readRow.name;
			writeRow[CONST.pages.master.columns.glickoRating] = readRow.glicko.rating;
			writeRow[CONST.pages.master.columns.glickoRatingDeviation] = readRow.glicko.deviation;
			writeRow[CONST.pages.master.columns.glickoRatingVariance] = readRow.glicko.volatility;

			let winsArray: string[] = [];
			for(let opponentName in storedWins)
			{
				let winName = opponentName;
				let winCount = storedWins[opponentName];
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
	 * @argument sheetName Is the name of the sheet to get data from. Never passed in normally, only for some devwork.
	 */
	export function getMasterListData(sheetName: string = CONST.pages.master.name)
	{
		let data = SpreadsheetApp.getActive().getSheetByName(sheetName).getDataRange().getValues();
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
					//splits the string by spaces, then takes the last part to be the number
					let splitOnSpace = temp[j].split(' ');
					let number = parseInt(splitOnSpace[splitOnSpace.length - 1]);

					//if the number was not included set the number to 1, and combine the entire array for the name otherwise just combine everything but the last part in the array
					if(number === NaN)
						number = 1;
					else
						splitOnSpace.pop();

					let opponenet_name = splitOnSpace.join(' ');

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
	}

	/** Resets the games played page */
	export function resetGamesPlayedPage()
	{
		let spreadsheet = SpreadsheetApp.getActive();
		let sheet = spreadsheet.getSheetByName(CONST.pages.games.name);
		let range = sheet.getDataRange();
		range.offset(1, 0).clearContent();
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
		for(let i = 1; i < data.length; i++)
		{
			let currentRow = data[i];
			output.push({
				white: currentRow[CONST.pages.games.columns.white],
				black: currentRow[CONST.pages.games.columns.black],
				result: CONST.pages.games.resultMap[currentRow[CONST.pages.games.columns.result]]
			});
		}
		return output;
	}


	/**
	 * Returns array of all players who were signed in
	 * 
	 * @returns array of players signed in
	 */
	export function getAttendanceSheetData(): { [name: string]: boolean }
	{
		let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.attendance.name).getDataRange().getValues();
		let output: { [name: string]: boolean } = {};
		for(let i = 1; i < data.length; i++)
		{
			let currentRow = data[i];
			output[currentRow[CONST.pages.attendance.columns.name]] = currentRow[CONST.pages.attendance.columns.attend];
		}
		return output;
	}

	/**
	 * Resets the attendance page
	 * @param activePlayers Active part of chess club
	 */
	export function resetAttendancePage(activePlayers: IPlayer[])
	{
		let s = SpreadsheetApp.getActive();
		let sheet = TemplateSheets.generate(s, s.getSheetByName(CONST.pages.attendance.template), activePlayers.length, CONST.pages.attendance.name);
		let output: any[][] = [];
		for(let i = 0; i < activePlayers.length; i++)
			output.push([activePlayers[i].name]);
		sheet.getRange(2, CONST.pages.attendance.columns.name + 1, output.length).setValues(output);
		sheet.autoResizeColumns(1, sheet.getLastColumn());
	}

	/**
	 * Remakes the attendance page without loss
	 * @param activePlayers The active part of the chess club
	 */
	export function updateAttendanceSheet(activePlayers: IPlayer[])
	{
		let s = SpreadsheetApp.getActive();
		let sheet = s.getSheetByName(CONST.pages.attendance.name);
		let savedAttenance = sheet.getRange(2, CONST.pages.attendance.columns.attend + 1, sheet.getLastRow() - 1).getValues();
		sheet = TemplateSheets.generate(s, s.getSheetByName(CONST.pages.attendance.template), activePlayers.length, CONST.pages.attendance.name);
		let output: any[][] = [];
		for(let i = 0; i < activePlayers.length; i++)
		{
			let currentRow = [];
			currentRow[CONST.pages.attendance.columns.attend] = (savedAttenance[i] ? savedAttenance[i][0] : false)
			currentRow[CONST.pages.attendance.columns.name] = activePlayers[i].name;
			output.push(currentRow);
		}
		sheet.getRange(2, 1, output.length, output[0].length).setValues(output);
		sheet.autoResizeColumns(1, sheet.getLastColumn());
	}

	function convertIPlayerToIActivePlayerData(input: IPlayer, club: { [name: string]: IPlayer }): IActivePlayerData
	{
		return {
			name: input.name,
			board: input.boardNumber,
			storedWins: convertStoredWinsObjectToArray(input.storedWins, club),
			absent: input.absent,
			grade: input.grade,
			group: input.group,
			lampertRating: input.lampert.rating,
			roundedGlickoRating: Math.round(input.glicko.rating),
			points: input.points,
			registered: input.registered,
		};
	}

	/** All data held on master sheet about an active player */
	export interface IActivePlayerData
	{
		/** Name [Unique] */
		name: string;
		/** Board number, this is unique but also changes */
		board: number;
		/** array refering the the number of wins against people above them and losses to those below */
		storedWins: number[];
		/** The Lampert Rating */
		lampertRating: number;
		/** The glicko rating rounded */
		roundedGlickoRating: number;
		/** The group */
		group: string;
		/** The grade */
		grade: string | number;
		/** The number of points */
		points: number;
		/** Did they miss last session? */
		absent: boolean;
		/** Are the regiestered? */
		registered: boolean;
	}

	/**
	 * Writes all data about the active club to the active page
	 * @param club The active portion of the club in order of board number
	 * @param write Should data be written? set to ture for release, usefull to set to false for debugging
	 */
	function writeActivePlayerData(club: IPlayer[], write?: boolean): any[][]
	{
		//check for no duplicates and make sure board number matches
		let nameToIndexMap: { [name: string]: number } = {};
		for(let i = 0; i < club.length; i++)
		{
			if(nameToIndexMap.hasOwnProperty(club[i].name))
				throw new Error(`${club[i].name} is duplicate in club object on both boards ${nameToIndexMap[club[i].name]} and ${club[i].boardNumber}.
JSON:
${JSON.stringify(club)}`);
			if(i + 1 !== club[i].boardNumber)
				throw new Error(`${club[i].name} has a board-index mismatch, Index should be one less than board number.
Board: ${club[i].boardNumber}
Index: ${i}`);
			nameToIndexMap[club[i].name] = i;
		}

		//setup output object
		let output: any[][] = [];
		let backgrounds: string[][] = [];
		for(let i = 0; i < club.length; i++)
		{
			let me = club[i];
			let row = [];
			for(let j = 0; j < CONST.pages.active.columns.wins + club.length; j++)
				row.push('');
			row[CONST.pages.active.columns.board] = i + 1;
			row[CONST.pages.active.columns.missed] = me.absent;
			row[CONST.pages.active.columns.name] = me.name;
			row[CONST.pages.active.columns.points] = me.points;
			row[CONST.pages.active.columns.LampertRating] = me.lampert.rating;
			row[CONST.pages.active.columns.grade] = me.grade;
			row[CONST.pages.active.columns.group] = me.group;
			row[CONST.pages.active.columns.GlickoRating] = Math.round(me.glicko.rating);

			//make stored wins table
			for(let name in me.storedWins)
			{
				let index = nameToIndexMap[name];
				if(index < i)
				{
					let value = me.storedWins[name];
					row[CONST.pages.active.columns.wins + index] = value;       //current row value
					output[index][CONST.pages.active.columns.wins + i] = value; //mirrored value
				}
			}
			row[CONST.pages.active.columns.wins + i] = 'X';
			output.push(row);

			backgrounds.push([club[i].registered ? CONST.pages.active.regcolors.registered : CONST.pages.active.regcolors.unregistered])
		}

		//now make page
		let spreadsheet = SpreadsheetApp.getActive();
		if(write)
		{
			//capture the old named range
			let theNamedRange = spreadsheet.getSheetByName(CONST.pages.active.name).getNamedRanges().filter((s) => s.getName() === CONST.pages.active.ranges.players)[0];

			let page = TemplateSheets.generate(spreadsheet, spreadsheet.getSheetByName(CONST.pages.active.template), club.length, CONST.pages.active.name);
			page.getRange(2, 1, output.length, output[0].length).setValues(output);
			page.setColumnWidths(CONST.pages.active.columns.wins + 1, club.length, CONST.pages.active.storedWinColumnSize);
			page.getDataRange().setFontSize(CONST.RobinFontSize);
			page.autoResizeColumns(1, CONST.pages.active.columns.wins);


			let names = page.getRange(2, CONST.pages.active.columns.name + 1, output.length);

			//set named range to having this range (used for games played page)
			theNamedRange.setRange(page.getRange(2, CONST.pages.active.columns.name + 1, output.length));

			//Set background color for names to determine registered or not.
			names.setBackgrounds(backgrounds);
		}

		return output;
	}

	/** gets all data from the active players page
	 * @argument sheetName Is the name of the sheet to get data from.Never passed in normally, only for some devwork.
	 * @returns active player data ordered by board number ascending
	 */
	export function getActivePlayerData(sheetName = CONST.pages.active.name)
	{
		let range = SpreadsheetApp.getActive().getSheetByName(sheetName).getDataRange();
		let data = range.getValues();
		let backgrounds = range.getBackgrounds();
		let output: IActivePlayerData[] = [];
		for(let i = 1; i < data.length; i++)
		{
			let currentRow = data[i];
			/** The current board number */
			let board = currentRow[CONST.pages.active.columns.board];
			output.push({
				roundedGlickoRating: currentRow[CONST.pages.active.columns.GlickoRating],
				name: currentRow[CONST.pages.active.columns.name],
				board: board,
				storedWins: currentRow.slice(CONST.pages.active.columns.wins, CONST.pages.active.columns.wins + board - 1),
				lampertRating: currentRow[CONST.pages.active.columns.LampertRating],
				grade: currentRow[CONST.pages.active.columns.grade],
				group: currentRow[CONST.pages.active.columns.group],
				points: currentRow[CONST.pages.active.columns.points],
				absent: currentRow[CONST.pages.active.columns.missed],
				registered: backgrounds[i][CONST.pages.active.columns.name] === CONST.pages.active.regcolors.registered,	//uses background color to determine if a player is registered
			});
		}
		return output.sort((a,b) => a.board - b.board);
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
		/** New name */
		newName: string;
		/** Is the player registered? */
		registered: boolean;
	}

	/** Gets all data from new player sheet and returns it as an array */
	export function getNewPlayerData()
	{
		let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.newPlayers.name).getDataRange().getValues();
		let output: INewPlayerData[] = [];
		for(let i = 1; i < data.length; i++)
		{
			let currentRow = data[i];
			output.push({
				name: currentRow[CONST.pages.newPlayers.columns.name],
				grade: currentRow[CONST.pages.newPlayers.columns.grade],
				group: currentRow[CONST.pages.newPlayers.columns.group],
				newName: currentRow[CONST.pages.newPlayers.columns.newName],
				registered: currentRow[CONST.pages.newPlayers.columns.registered],
			});
		}
		return output.filter(x => x.name || x.newName);
	}

	/** Resets the new update player page */
	export function resetNewPlayerPage()
	{
		let spreadsheet = SpreadsheetApp.getActive();
		TemplateSheets.generate(spreadsheet, spreadsheet.getSheetByName(CONST.pages.newPlayers.template), CONST.pages.newPlayers.defaultRows, CONST.pages.newPlayers.name);
	}

	/**
	 * records games played onto a seperate sheet, each row referes to a single rating period and is encoded using JSON.stringify
	 * @param weekObj the games for this rating period
	 */
	export function addGameLog(weekObj: { games: IGamePlayed[], attendance: { [name: string]: boolean } })
	{
		let spreadsheet = SpreadsheetApp.getActive();
		let sheet = spreadsheet.getSheetByName(CONST.pages.gamesLog.name);
		if(!sheet)
			sheet = spreadsheet.insertSheet(CONST.pages.gamesLog.name).hideSheet();
		sheet.getRange((sheet.getLastRow() || 0) + 1, CONST.pages.gamesLog.columns.data + 1).setValue(JSON.stringify(weekObj));
	}
}
