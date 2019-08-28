///<reference path="Constants.ts"/>

/**
 * If the player does not exist in the master list then creates an entry for them.
 * Then the player is added to the current roster.
 */
function addPlayer(): void
{
	let spreadsheet = SpreadsheetApp.getActive();
	let ui = SpreadsheetApp.getUi();
	let response = ui.prompt('Enter player name', 'Name of player (ex: "Benji Altman")', ui.ButtonSet.OK_CANCEL);
	if(response.getSelectedButton() === ui.Button.OK)
	{
		let masterListData = getMasterListData();

		response.getResponseText().toLowerCase()
	}
}