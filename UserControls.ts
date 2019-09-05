///<reference path="Constants.ts"/>

/** Creates a new player page from the new player template */
function makeUpdatePlayersPage(): void
{
	let spreadsheet = SpreadsheetApp.getActive();
	TemplateSheets.generatePageFromTemplate(spreadsheet, spreadsheet.getSheetByName(CONST.pages.newPlayers.template), CONST.pages.newPlayers.defaultRows, CONST.pages.newPlayers.name);
}


/**
 * Reads the new player page added everyone into the club and active sheet, will also fix errors on the master sheet. Deletes new player sheet at the end.
 */
function updatePlayers(): void
{
	let spreadsheet = SpreadsheetApp.getActive();
	let masterListData = FrontEnd.getMasterListData();
	let newPlayerData = FrontEnd.getNewPlayerData();

	for(let i = 0; i < newPlayerData.length; i++)
	{
		let currentNewPlayer = newPlayerData[i];

		//if the player is already in master list, then update the needed info
		if(masterListData.hasOwnProperty(currentNewPlayer.name))
		{
			//TODO update player info
		}
		//if the player is not in the master list
		else
		{

		}
	}
}