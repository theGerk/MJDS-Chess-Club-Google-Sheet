///<reference path="../Constants.ts"/>

/** Namespace for lampert rating system and all its math */
namespace Lampert
{
	const RATIO = .1;
	const MAXIMUM_SWING = 100;
	const MINIMUM_SWING = 1;

	/** A lampert rating */
	export interface IRating
	{
		rating: number;
	}

	/**
	 * Calculates the Lampert Difference between two ratings
	 * 
	 * @param rating1
	 * @param rating2
	 * @returns the result
	 */
	function difference(rating1: number, rating2: number): number
	{
		return Math.floor(Math.abs((rating1 - rating2) * RATIO));
	}

	/**
	 * Changes rating according to the result, inputs are mutated
	 * 
	 * @param white an object refering to the white player, this is changed at the end
	 * @param black an object refering to the black player, this is changed at the end
	 * @param result the result of the game from white's perspective
	 */
	export function match(white: IRating, black: IRating, result: number): void
	{
		let diff = difference(white.rating, black.rating);

		switch(result)
		{
			case 0:	//black won
				return match(black, white, 1 - result);

			case 1:	//white won
				if(white.rating > black.rating) //if winner has higher rating
					diff = Math.max(50 - diff, MAXIMUM_SWING);
				else                //if looser has higher rating
					diff = Math.min(50 + diff, MINIMUM_SWING);
				white.rating += diff;
				black.rating -= diff;
				return;

			case .5: //draw
				//make higher and lower be references to player with higher and lower rating respectivly
				let higher: IRating;
				let lower: IRating;
				if(white.rating > black.rating)
				{
					higher = white;
					lower = black;
				}
				else
				{
					higher = black;
					lower = white;
				}
				diff = Math.max(Math.min(diff, MAXIMUM_SWING), MINIMUM_SWING);

				//change ratings
				higher.rating -= diff;
				lower.rating += diff;
				return;

			default:
				throw new Error(`A result of ${result} should never happen, only .5, 1 and 0 should be allowed`);
		}
	}
}