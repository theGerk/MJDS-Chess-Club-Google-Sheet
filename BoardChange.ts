/** All board change modifications */
namespace Boards
{
	/**
	 * Consumes an array of games and does all the board change modifications. The name simply is to stick with the convention set from the rating packages.
	 * 
	 * @param games An array of games played
	 * @param club the club object
	 * @param attendance A map from everyone active to weather or not they were here today
	 */
	export function doRatingPeriod(games: FrontEnd.IGamePlayed[], club: IClub, attendance: { [name: string]: boolean })
	{
		//move people down based on attendance
		attendanceBasedMovement(club.Active, attendance);


		//move based on previous games before any games are played
		jiggle(club.Active, attendance);


		//move based on games
		for(let i = 0; i < games.length; i++)
		{
			let game = games[i];
			switch(game.result)
			{
				case 0:
					win_loss(club.Master[game.black], club.Master[game.white], club.Active, attendance);
					break;
				case 1:
					win_loss(club.Master[game.white], club.Master[game.black], club.Active, attendance);
					break;
				default:
					draw(club.Master[game.white], club.Master[game.black]);
					break;
			}
		}
	}

	/**
	 * Just remove a win from a player against the other if it exists.
	 * 
	 * @param player1 A reference to one of the players
	 * @param player2 A reference to the other player
	 */
	function draw(player1: IPlayer, player2: IPlayer)
	{
		/** 
		 *  moves the win counter down one if it exists and is not zero.
		 *  @param player The player having a win taken away from
		 *  @param opponent The player for whom p1 is loosing a win against.
		 */
		function removeWin(player: IPlayer, opponent: IPlayer)
		{
			if(player.storedWins[opponent.name])
				player.storedWins[opponent.name]--;
		}
		removeWin(player1, player2);
		removeWin(player2, player1);
	}

	/**
	 * Makes any changes to stored wins and board numbers needed after a win happens
	 * @param winner A reference to the winner of the game
	 * @param looser A reference to the looser of the game
	 * @param club The array of all active players
	 * @param attendance The attendance object mapping active player names to if they are here.
	 */
	function win_loss(winner: IPlayer, looser: IPlayer, club: IPlayer[], attendance: { [name: string]: boolean })
	{
		//if the winner is ranked lower than the looser
		if(winner.boardNumber > looser.boardNumber)
		{
			winner.storedWins[looser.name] = (winner.storedWins[looser.name] || 0) + 1;	//adds one to the stored wins
			if(movementCondition(winner, looser))
				winBasedMovement(winner, looser, club, attendance);
		}
		//if the winner is ranked above the looser
		else
			delete looser.storedWins[winner.name];	//removes any and all stored wins the looser has against the winner
	}

	/**
	 * Makes modification to board numbers based on attendance
	 * @param club Array of active players
	 * @param attendance Attendance map (from player names to if they are here today)
	 */
	function attendanceBasedMovement(club: IPlayer[], attendance: { [name: string]: boolean })
	{
		let condition = (player: IPlayer) => player.absent && !attendance[player.name];

		/** Should be the equivalent to if the person below me is here today. */
		let canMove = false;

		for(let i = club.length - 1; i >= 0; i--)
		{
			let current = club[i];

			if(canMove && condition(current))
				moveDown(i, club);

			//set canMove
			//if the player is here, then the player above may be able to move
			canMove = attendance[current.name]
		}
	}

	/**
	 * Makes a board change based on a win or loss.
	 * 
	 * @param winner the winner of the game
	 * @param looser the looser of the game
	 * @param club an array of all the players in the club
	 * @param attendance a map from player name to if they are here today
	 */
	function winBasedMovement(winner: IPlayer, looser: IPlayer, club: IPlayer[], attendance: { [name: string]: boolean })
	{
		let winnerIndex = winner.boardNumber - 1;
		let looserIndex = looser.boardNumber - 1;

		//if the winner is ranked lower than the looser
		if(winnerIndex > looserIndex)
		{
			//check to make sure everyone between them is absent today
			for(let i = looserIndex + 1; i < winnerIndex; i++)
				if(attendance[club[i].name])
					return;                                      //if a player between the two showed up today then there will be no movement happening

			//will only reach this point if everyone between wasn't there
			movePlayer(winnerIndex, looserIndex, club);
			jiggle(club, attendance);
		}
	}

	/**
	 * Moves a player from startIndex to endIndex
	 * 
	 * @param startIndex The start index, this is zero based
	 * @param endIndex The end index, this is zero based
	 * @param club The array of active players in the club
	 */
	function movePlayer(startIndex: number, endIndex: number, club: IPlayer[])
	{
		if(startIndex < endIndex)
			for(let i = startIndex; i < endIndex; i++)
				moveDown(i, club);
		else if(startIndex > endIndex)
			for(let i = startIndex; i > endIndex; i--)
				moveUp(i, club);
	}


	/**
	 * Should the player's swap boards condition
	 * @param lower lower ranked player
	 * @param upper higher ranked player
	 * @returns if they players should swap assumign they are next to eachother.
	 */
	function movementCondition(lower: IPlayer, upper: IPlayer)
	{
		return lower.storedWins[upper.name] >= 2;
	}


	/**
	 * This just jiggles the entire player array to make any movements that are possible based on the attendance
	 * @param club entire active club
	 * @param attendance the attendance object
	 */
	function jiggle(club: IPlayer[], attendance: { [name: string]: boolean })
	{
		for(var i = club.length - 1; i >= 1; i--)
		{
			if(attendance[club[i].name])
			{
				for(var j = i - 1; j >= 0; j--)
				{
					if(movementCondition(club[i], club[j]))
					{
						movePlayer(i, j, club);
						i = club.length - 1;
						break;
					}
					else if(attendance[club[j].name])
						break;
				}
			}
		}
	}


	/**
	 * Moves a player down one in the club
	 * @param index index of the player
	 * @param club active club
	 */
	function moveDown(index: number, club: IPlayer[])
	{
		if(index >= 0 && index < club.length - 1)
		{
			let player = club[index];
			let other = club[index + 1]

			player.boardNumber++;
			other.boardNumber--;
			delete other.storedWins[player.name];	//remove any wins the person moving up has against person moving down

			//do swap
			club[index] = other;
			club[index + 1] = player;
		}
	}

	/**
	 * moves a player up a board in the club
	 * @param index target player's index
	 * @param club entire active club
	 */
	function moveUp(index: number, club: IPlayer[])
	{
		moveDown(index - 1, club);
	}
}