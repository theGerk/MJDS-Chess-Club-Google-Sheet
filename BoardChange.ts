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
					//remove stored wins for both
					//TODO do this
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
	export function attendanceBasedMovement(club: IPlayer[], attendance: { [name: string]: boolean })
	{
		let condition = (player: IPlayer) => player.absent && !attendance[player.name];


		let i = club.length - 1;

		//go through all players who should be moved, but can not go down
		for(; i >= 0; i--)
			if(!condition(club[i]))
				break;

		//now we can start moving players
		for(; i >= 0; i--)
			if(condition(club[i]))
				moveDown(i, club, false);
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
				moveDown(i, club, false);
		else if(startIndex > endIndex)
			for(let i = startIndex; i > endIndex; i--)
				moveUp(i, club, false);
		jiggle(startIndex, club);
		jiggle(endIndex, club);
	}

	/**
	 * Makes sure there are no iregularities in boards in the entire club, primarily used after doing attendance modification
	 * @param club entire active club
	 */
	function jiggleAll(club: IPlayer[])
	{
		for(let i = 0; i < club.length; i++)
		{
			jiggle(i, club);
		}
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
	 * Recursive jiggle function to do repeated board changes. This solves if board 5 already has two wins against board 3 then when they beat board 4 twice they get jiggled up to board 3.
	 * @param index target index to jiggle
	 * @param club entire active club
	 */
	function jiggle(index: number, club: IPlayer[])
	{
		//some notes on how this works and why else if is used rather than two ifs.
		//Statement: It is impossible to every have to both jiggle up and jiggle down.
		//Proof: This function is only ever called after a movement takes place. If the movement was the player moving upwards then the player immediatly below him used to be above him and thus can not have any stored wins against this player. For the movement in the other direction the same argument is made in the other direction. QED
		//This means it is optimal to is if else, however there is another reason. A player may be jiggled up and then the new target may be ready to jiggle down. While we would of course want to do this jiggle, this is not the place to do it as it will be covered by the recursion. 

		//jiggle up
		if(index > 0 && movementCondition(club[index], club[index - 1]))
			moveUp(index, club, true);

		//jiggle down
		else if(index < club.length - 1 && movementCondition(club[index + 1], club[index]))
			moveDown(index, club, true);
	}


	/**
	 * Moves a player down one in the club
	 * @param index index of the player
	 * @param club active club
	 * @param doJiggle should recursive jiggling happen?
	 */
	function moveDown(index: number, club: IPlayer[], doJiggle: boolean)
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

			if(doJiggle)
			{
				jiggle(index, club);
				jiggle(index + 1, club);
			}
		}
	}

	/**
	 * moves a player up a board in the club
	 * @param index target player's index
	 * @param club entire active club
	 * @param doJiggle should recursive jiggling happen?
	 */
	function moveUp(index: number, club: IPlayer[], doJiggle: boolean)
	{
		moveDown(index - 1, club, doJiggle);
	}
}