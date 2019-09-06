///<reference path="Constants.ts"/>

namespace Glicko
{
	export interface IRating
	{
		rating: number;
		deviation: number;
		variance: number;
	}
}
