﻿///<reference path="Constants.ts"/>

/**
 * Reads the new player page added everyone into the club and active sheet, will also fix errors on the master sheet. Deletes new player sheet at the end.
 */
function updatePlayers(): void
{
	let newPlayerData = FrontEnd.getNewPlayerData();

	if(newPlayerData.length > 0)
	{
		let club = FrontEnd.getClub();
		for(let i = 0; i < newPlayerData.length; i++)
		{
			let currentNewPlayer = newPlayerData[i];

			//allow ussage of newName rather than name for adding player
			if(!currentNewPlayer.name)
			{
				currentNewPlayer.name = currentNewPlayer.newName;
				currentNewPlayer.newName = '';
			}


			//if the player is already in master list, then update the needed info
			//TODO throw error and highlight red if a new name conflicts with an existing one
			if(club.Master.hasOwnProperty(currentNewPlayer.name))
			{
				let player = club.Master[currentNewPlayer.name];
				if(currentNewPlayer.grade)
					player.grade = currentNewPlayer.grade;
				if(currentNewPlayer.group)
					player.group = currentNewPlayer.group;
				if(currentNewPlayer.newName)
					player.name = currentNewPlayer.newName;
				if(!player.isActive)
				{
					player.isActive = true;
					club.Active.push(player);
					player.boardNumber = club.Active.length;
				}
				player.registered = currentNewPlayer.registered;
			}
			//if the player is not in the master list
			else
			{
				//TODO check to make sure all data is there and highlight red if it isn't. If a new name is given highlight that red and throw error as well.
				let player: IPlayer = {
					absent: false,
					boardNumber: club.Active.length + 1,
					gamesPlayed: 0,
					glicko: {
						deviation: null,
						rating: Glicko.INITIAL_RATING,
						volatility: null
					},
					grade: currentNewPlayer.grade,
					group: currentNewPlayer.group,
					isActive: true,
					lampert: { rating: Lampert.INITIAL_RATING },
					name: currentNewPlayer.name,
					points: 0,
					storedWins: {},
					registered: currentNewPlayer.registered,
				}

				club.Master[player.name] = player;
				club.Active.push(player);
			}
		}
		FrontEnd.setClub(club, true);
		FrontEnd.updateAttendanceSheet(club.Active);
	}
	FrontEnd.resetNewPlayerPage();
}