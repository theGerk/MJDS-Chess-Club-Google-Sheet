﻿/// <reference path="Constants.ts"/>

/** Describes a single row in the master list. */
interface IEntryInMasterList {
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

/**
 * Gets all the data stored in the master list as a single object
 * 
 * @returns an object mapping names to their entry in the master list
 */
function getMasterListData() {
    let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.master.name).getDataRange().getValues();
    let output: { [name: string]: IEntryInMasterList } = {};
    for (let i = 1; i < data.length; i++) {
        let row = data[i];
        let name = row[CONST.pages.master.columns.name];

        //check for redundancy
        if (output.hasOwnProperty(name)) {
            SpreadsheetApp.getUi().alert(`${name} appears on row ${output[name].row + 2} and row ${i + 1}. THIS MUST BE FIXED!`);
            Logger.log(`${name} appears on row ${output[name].row + 2} and row ${i + 1}.`);
            throw new Error("Redundant primary key");
        }

        let storedWinsString: string = row[CONST.pages.master.columns.storedWins];
        let storedWinsObject: { [name: string]: number } = {};
        if (storedWinsString) {
            let temp = storedWinsString.split(CONST.pages.master.storedWinSeperator);
            for (let j = 0; j < temp.length; j++) {
                let opponenet_name = temp[j].substring(0, temp[j].length - 2);
                //TODO add try catch around next line to allow for not having a number in the stored wins list for the master sheet
                //Currently only allows "Harry Potter 1, Ginny Weasly 2"
                //Should be equivalent to "Harry Potter, Ginny Weasly 2" or "Harry Potter 1, Ginny Weasly, Ginny Weasly"
                //Update: Maybe don't do this as it prevents a name from ending with a number as in the case of "James Potter_0" and James Potter_1", maybe this isn't an issue but requires further thought.
                let number = parseInt(temp[j].substring(temp[j].length - 1));

                if (storedWinsObject.hasOwnProperty(opponenet_name))
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
    for (let player in output) {
        let current = output[player].storedWins;
        for (let opponent in current) {
            if (opponent === player || !output.hasOwnProperty(opponent)) {
                var ui: GoogleAppsScript.Base.Ui = ui || SpreadsheetApp.getUi();

                //problem!
                let logLine1 = `Master list data error: ${player} (row ${output[player].row}) has played ${output} who does not exist.`;

                //Make the user aware right now
                let buttonResponse = ui.alert(`Data Error in master list.`, `On row ${output[player].row} of page ${CONST.pages.master.name}, player ${player}, supposedly has a win against ${opponent}, however ${opponent} does not exist in the master list. Do you want this automatically removed?

Press YES if you want this opponent to be removed from master list.
Press NO if you want this opponent to be ignored for now, but not removed.
Press CANCEL if you want to simple stop the script and fix the issue.`, ui.ButtonSet.YES_NO_CANCEL);

                switch (buttonResponse) {
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
interface IGamePlayed {
    /** White player's name */
    white: string;
    /** Black player's name */
    black: string;
    /** Result for white */
    result: number;
    /** Timestamp, may not be used */
    timestamp: number;
}

/**
 * Gets all the data stored in the games list as a single array
 * 
 * @returns an array of every game played.
 */
function getGamesPlayedData(): IGamePlayed[] {
    let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.games.name).getDataRange().getValues();
    let output: IGamePlayed[] = [];
    for (let i = 1; i < data.length; i++) {
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
function getAttendanceSheetData(): string[] {
    let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.attendance.name).getDataRange().getValues();
    let output: string[] = [];
    for (let i = 1; i < data.length; i++) {
        let currentRow = data[i];
        if (currentRow[CONST.pages.attendance.columns.attend])
            output.push(currentRow[CONST.pages.attendance.columns.name]);
    }
    return output;
}


interface IActivePlayer {
    name: string;
    board: number;
    previousWins: number[];
    lampertRating: number;
    glickoRating: {}
}
function getActivePlayerData(): 