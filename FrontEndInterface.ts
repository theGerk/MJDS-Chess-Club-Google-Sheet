/// <reference path="Constants.ts"/>



/**
 * Gets all the data stored in the master list as a single object
 * 
 * @returns an object mapping names to their entry in the master list
 */
function getMasterListData()
{
	let data = SpreadsheetApp.getActive().getSheetByName(CONST.pages.master.name).getDataRange().getValues();
	let output: { [name: string]: IEntryInMasterList } = {};
	for(let i = 1; i < data.length; i++)
	{
		let row = data[i];
		let name = row[CONST.pages.master.name];

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
			for(let i = 0; i < temp.length; i++)
			{
				let opponenet_name = temp[i].substring(0, temp[i].length - 2);
				//TODO add try catch around next line to allow for not having a number in the stored wins list for the master sheet
				//Currently only allows "Harry Potter 1, Ginny Weasly 2"
				//Should be equivalent to "Harry Potter, Ginny Weasly 2" or "Harry Potter 1, Ginny Weasly, Ginny Weasly"
				//Update: Maybe don't do this as it prevents a name from ending with a number as in the case of "James Potter_0" and James Potter_1", maybe this isn't an issue but requires further thought.
				let number = parseInt(temp[i].substring(temp[i].length - 1));

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
			glickoDeviation: row[CONST.pages.master.columns.glickoRatingDeviation],
			glickoRating: row[CONST.pages.master.columns.glickoRating],
			glickoVariance: row[CONST.pages.master.columns.glickoRatingVariance],
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