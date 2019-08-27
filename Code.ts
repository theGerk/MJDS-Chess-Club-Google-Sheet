//Old file, not used any more except as reference.
//Maybe delete eventually

/// <reference path="Constants.ts"/>


//for pulling data from games played
var RESULT = 0
var WHITE = 2
var BLACK = 3

//Output Info
var ID = 0;
var RATING = 4;
var GAMES_PLAYED = 5;
var POINTS = 3;
var MISSED_LAST_CLASS = 7;
var BOARD_CHANGE = 7;

function _update()
{
	//getting nessicary info
	var spreadsheet = SpreadsheetApp.getActive();
	var games = spreadsheet.getSheetByName('Games Played').getRange(2, 3, games.getLastRow() - 1, games.getLastColumn() - 2).getValues();
	var data = spreadsheet.getSheetByName('Chess Club info').getDataRange().getValues();
	var stops = spreadsheet.getSheetByName('Attendence').getRange(2, 2, data.length, stops.getLastColumn() - 1).getValues();
	//got nessicary info

	//get pointer array
	var IDtoBoard = [];
	for (var i = 1; i < data.length; i++)
	{
		IDtoBoard[data[i][ID]] = i;
	}
	//gereated p array


	//loop so that it goes through each game
	for (var j = 1, i = 0; j <= stops[0].length; j += 2)
	{
		for (; (j == stops[0].length || i < stops[0][j]) && i < games.length; i++)
		{
			//check to make sure players are differenent
			if (games[i][WHITE] == games[i][BLACK])
				continue;

			if (games[i][RESULT] == "Win")
				__win_loss(IDtoBoard[games[i][WHITE]], IDtoBoard[games[i][BLACK]], data, IDtoBoard);

			else if (games[i][RESULT] == "Draw")
				__draw(IDtoBoard[games[i][WHITE]], IDtoBoard[games[i][BLACK]], data);

			else
				__win_loss(IDtoBoard[games[i][BLACK]], IDtoBoard[games[i][WHITE]], data, IDtoBoard);
		}

		/*
		//do attendence stuff
		j--;

		//checks if they showed up that day
		for (var k = 1; k < stops.length; k++)
		{
			if (stops[k][j] !== '')
			{ //if they missed that day
				if (data[IDtoBoard[k]][MISSED_LAST_CLASS] === '') //if they had not already missed the time previous
					data[IDtoBoard[k]][MISSED_LAST_CLASS] = 3;
				else
					data[IDtoBoard[k]][MISSED_LAST_CLASS] = 1927;
			}
			else
			{
				data[IDtoBoard[k]][MISSED_LAST_CLASS] = '';
				data[IDtoBoard[k]][POINTS]++;     //get a point for showing up
			}
		}

		//go through people to keep safe at bottom of ranking
		var k = data.length - 1;
		for (; k > 1; k)
		{
			if (data[k--][MISSED_LAST_CLASS] !== 1927)
				break;
		}

		//move down people who missed
		for (; k > 1; k--)
		{
			if (data[k][MISSED_LAST_CLASS] === 1927)
				__flipBoard(k, k + 1, data, IDtoBoard);
		}

		//flip any new natural flips
		for (; k < data.length - 1; k++)
			__boardSwitch(k, k + 1, data, IDtoBoard);
			*/
	}

	//needs work here
	//get rid of 0's
	for (var i = 0; i < data.length; i++)
	{
		for (var j = BOARD_CHANGE + 1; j < data[i].length; j++)
		{
			if (data[i][j] === 0)
			{
				data[i][j] = '';
			}
		}
	}

	//output to main page
	data[0][ID] = 'Board'
	data[0].splice(MISSED_LAST_CLASS, 1);
	for (var i = 1; i < data.length; i++)
	{
		data[i][ID] = i;
		data[i][BOARD_CHANGE + i] = 'X';
		data[i].splice(MISSED_LAST_CLASS, 1);
	}
	var outputSheet = spreadsheet.getSheetByName('Current info').getRange(1, 1, data.length, data[0].length);
	outputSheet.setValues(data);
}


function __win_loss(winner, looser, data, IDtoBoard)
{
	//change ratings
	var difference = Math.floor(Math.abs((data[winner][RATING] - data[looser][RATING]) / 10));
	if (data[winner][RATING] > data[looser][RATING])
	{
		difference = 50 - difference;
		if (difference < 1)
			difference = 1;
	}
	else
	{
		difference = 50 + difference;
		if (difference > 100)
			difference = 100;
	}
	data[winner][RATING] += difference;
	data[looser][RATING] -= difference;
	//ratings are delt with!


	__everyGame(winner, looser, data);

	//deal with board number change
	//First add number or reset to 0
	if (winner < looser)
	{    //reset to 0
		data[winner][BOARD_CHANGE + looser] = 0;
		data[looser][BOARD_CHANGE + winner] = 0;
	}
	else
	{                   //add 1 and call boardchange
		data[winner][BOARD_CHANGE + looser]++;
		data[looser][BOARD_CHANGE + winner]++;
		__boardSwitch(looser, winner, data, IDtoBoard);
	}
}



function __draw(player1, player2, data)
{
	//make it so that player 1 has higher rating
	var temp1, temp2;
	temp1 = data[player1][RATING];
	temp2 = data[player2][RATING];

	if (temp1 < temp2)
	{
		// if(data[player1][RATING] < data[player2][RATING]) {
		var temp = player1;
		player1 = player2;
		player2 = temp;
	}

	//change rating
	var difference = Math.floor((data[player1][RATING] - data[player2][RATING]) / 10);
	data[player1][RATING] -= difference;
	data[player2][RATING] += difference;

	__everyGame(player1, player2, data);

	//deal with board number change
	if (data[player1][BOARD_CHANGE + player2] != 0)
	{
		data[player1][BOARD_CHANGE + player2]--;
		data[player2][BOARD_CHANGE + player1]--;
	}
}



//should work now
function __boardSwitch(lower, higher, data, p)
{
	if (higher == lower + 1 &&
		data[lower][BOARD_CHANGE + higher] >= 2)
	{

		//flip boards
		__flipBoard(lower, higher, data, p);

		//recrusive calls:
		__boardSwitch(higher, higher + 1, data, p);            //sends new higher player and compares against player once greater first
		__boardSwitch(lower - 1, lower, data, p);              //sends new lower player and compares against player once lesser last
	}
}


function __flipBoard(lower, higher, data, p)
{
	//reset BOARD_CHANGE value:
	data[lower][BOARD_CHANGE + higher] = 0;
	data[higher][BOARD_CHANGE + lower] = 0;

	//flip column:
	for (var i = 0; i < data[0].length; i++)
	{
		var temp = data[lower][i];
		data[lower][i] = data[higher][i];
		data[higher][i] = temp;
	}

	//flip row:
	for (var i = 0; i < data.length; i++)
	{
		var temp = data[i][BOARD_CHANGE + lower];
		data[i][BOARD_CHANGE + lower] = data[i][BOARD_CHANGE + higher];
		data[i][BOARD_CHANGE + higher] = temp;
	}

	//flip array values:
	{
		var temp = p[data[lower][ID]];
		p[data[lower][ID]] = p[data[higher][ID]];
		p[data[higher][ID]] = temp;
	}
}

//DONE
function __everyGame(p1, p2, data)
{
	//change points
	data[p1][POINTS]++;
	data[p2][POINTS]++;

	//change games played
	data[p1][GAMES_PLAYED]++;
	data[p2][GAMES_PLAYED]++;
}


//just for me
function __dev_work__set_up_mirror_image_graph_thing()
{
	var u = SpreadsheetApp.getUi();
	var s = SpreadsheetApp.getActive().getSheetByName('Chess Club Info').getRange('h2:ao35');
	var h = s.getValues();
	for (var i = 0; i < h.length; i++)
		for (var j = i + 1; j < h[i].length; j++)
		{
			h[i][j] = h[j][i];
		}
	s.setValues(h);
}
