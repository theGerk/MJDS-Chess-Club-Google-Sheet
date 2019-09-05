///<reference path="Constants.ts"/>

/**
 * If the player does not exist in the master list then creates an entry for them.
 * Then the player is added to the current roster.
 * 
 * Work in progress on temporary hold as current version relies on heavy usage of UI prompt and alert. May want to switch to using a webform or a seperate page generated for this.
 */
function addPlayers(): void
{
	let spreadsheet = SpreadsheetApp.getActive();
	let ui = SpreadsheetApp.getUi();
	let masterListData = FrontEnd.getMasterListData();
	let response: GoogleAppsScript.Base.PromptResponse;
	do
	{
		response = ui.prompt('Enter player name', 'Name of player (ex: "Benji Altman")', ui.ButtonSet.OK_CANCEL);
		if(response.getSelectedButton() === ui.Button.OK)
		{
			let name = response.getResponseText();
			let confirmed: boolean;

			//make sure the correct entry is given if it is in the master list
			if(masterListData.hasOwnProperty(response.getResponseText()))
			{
				let entry = masterListData[response.getResponseText()];
				let confirmation = ui.alert('Confirm', `Adding ${name} to current club. Is this the correct player with the following data:

name: ${entry.name}
grade: ${entry.grade}
group: ${entry.group}
lampert rating: ${entry.lampertRating}
glicko rating: ${entry.glickoRating}`, ui.ButtonSet.YES_NO);

				confirmed = confirmation === ui.Button.YES;
			}
			//make sure the correct entry is given if it is not in the master list
			else
			{
				let confirmation = ui.alert('Confirm', `Adding NEW player ${name} to the club. Is this correct?`, ui.ButtonSet.YES_NO);

				confirmed = confirmation === ui.Button.YES;
				//add into master list
				if(confirmed)
				{
					ui.prompt("What group is this player in?");

					//masterListData[name] = {
					//	name: name,
					//	group: 
					//};
				}
			}
		}
	} while(response.getSelectedButton() !== ui.Button.CANCEL);
}