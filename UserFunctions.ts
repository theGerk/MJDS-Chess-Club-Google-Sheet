/**
 * Checks if the player with the given name is registered.
 * @param name The player's name
 */
function isRegistered(name: string)
{
	return FrontEnd.getClub().Master[name].registered;
}