namespace Boards
{
	export function doRatingPeriod(games: FrontEnd.IGamePlayed[], club: IClub, attendance: { [name: string]: boolean })
	{
		for(let i = 0; i < games.length; i++)
		{
			let game = games[i];
			switch(game.result)
			{
				case 0:
					makeGameUpdate(club.Master[game.black], club.Master[game.white], club.Active, attendance);
					break;
				case 1:
					makeGameUpdate(club.Master[game.white], club.Master[game.black], club.Active, attendance);
					break;
				default:
					//remove stored wins for both
					//TODO do this
					break;
			}
		}
	}

	function makeGameUpdate(winner: IPlayer, looser: IPlayer, club: IPlayer[], attendance: { [name: string]: boolean })
	{
		if(winner.boardNumber > looser.boardNumber)
		{
			winner.storedWins[looser.name] = (winner.storedWins[looser.name] || 0) + 1;
			if(movementCondition(winner, looser))
				winBasedMovement(winner, looser, club, attendance);
		}
		else
			delete looser.storedWins[winner.name];
	}

	export function attendanceModification(club: IPlayer[], attendance: { [name: string]: boolean })
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


	//TODO, make a list of requirements and then do them.
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
	 * Recursive jiggle function to do repeated board changes
	 * @param index target index to jiggle
	 * @param club entire active club
	 * @returns if jiggle occured
	 */
	function jiggle(index: number, club: IPlayer[])
	{
		//jiggle up
		if(index > 0 && movementCondition(club[index], club[index - 1]))
		{
			moveUp(index, club, true);
			return true;
		}

		//jiggle down
		else if(index < club.length - 1 && movementCondition(club[index + 1], club[index]))
		{
			moveDown(index, club, true);
			return true;
		}

		else
		{
			return false;
		}
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