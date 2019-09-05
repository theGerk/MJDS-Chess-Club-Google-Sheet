///<reference path="Constants.ts"/>

namespace Glicko
{
	export interface IGlicko
	{
		rating: number;
		deviation: number;
		variance: number;
	}
}
