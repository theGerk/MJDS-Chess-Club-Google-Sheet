/// <reference path="Constants.ts"/>


function onOpen()
{
	SpreadsheetApp.getActive().addMenu("Chess", [{ name: 'Developer Button', functionName: 'testFunction' }]);
	//var spreadsheet = SpreadsheetApp.getActive();
	//var menuItems = [
	//	{ name: 'Update', functionName: '_update' },
	//	{ name: 'New week', functionName: 'addWeek' }
	//];
	//spreadsheet.addMenu('Chess Club', menuItems);
}


function weekly()
{
	Logger.log("this just worked");
	throw new Error("Hello benji's inbox.");
}