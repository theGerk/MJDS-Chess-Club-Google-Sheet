/// <reference path="Constants.ts"/>


function transposeSheet()
{
	var u = SpreadsheetApp.getUi();
	var s = SpreadsheetApp.getActive().getSheetByName('DEVSHEET');
	var v = s.getDataRange().getValues();
	var n = [];
	for (var i = 0; i < v[0].length; i++)
	{
		n.push([]);
		for (var j = 0; j < v.length; j++)
			n[i].push(v[j][i]);
	}
	s.getRange(1, 1, n.length, n[0].length).setValues(n);
}

function ave()
{
	return 2;
}
