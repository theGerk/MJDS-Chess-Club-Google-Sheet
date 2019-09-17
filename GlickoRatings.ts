///<reference path="Constants.ts"/>

/** Works using GLICKO-2, but with some minor midifications to what the initial rating and deviations are. This doesn't actually change the algorithm, simply sifts the curve slightly */
namespace Glicko
{
	/** The rating interface, describes what a glicko rating must have. */
	export interface IRating
	{
		/** The rating */
		rating: number;
		/** The deviation */
		deviation: number;
		/** The volatility, this is kept secret. */
		volatility: number;
	}

	/** The system constant, \tau, which constrains the change in volatility over time... */
	const TAU = .5;	//TODO test with different values once a largish sample has been obtained.
	export const INITIAL_RATING = CONST.ratings.initialRating;
	export const INITIAL_DEVIATION = 350;
	const INITIAL_VOLATILITY = .06;
	const DEFAULT_GLICKO_2_RATING = 0;
	const DEFAULT_GLICKO_2_DEVIATION = 350 / 173.7178;
	const GLICKO_2_CONVERSTION_CONSTANT = Glicko.INITIAL_DEVIATION / DEFAULT_GLICKO_2_DEVIATION;
	const CONVERGENCE_TOLERANCE = 0.000001;

	/**
	 * Checks if a rating is for an unrated player
	 * @param rating the player's rating
	 */
	function israted(rating: IRating)
	{
		return !!rating.deviation;
	}

	/**
	 * Initializes a rating to the default values, rating will probably already be set though. Will do nothing a rating that is already initialized.
	 * @param rating a rating object to be initialized
	 */
	function setRating(rating: IRating)
	{
		if(israted(rating))
			return;

		//rating should already be set
		rating.deviation = Glicko.INITIAL_DEVIATION;
		rating.volatility = INITIAL_VOLATILITY;
	}


	/**
	 * Converts everyone who is rated to glicko-2
	 * @param everyone
	 */
	function convertToGlicko2(everyone: IRating[])
	{
		for(let i = 0; i < everyone.length; i++)
		{
			if(israted(everyone[i]))
			{
				everyone[i].rating = (everyone[i].rating - Glicko.INITIAL_RATING) / GLICKO_2_CONVERSTION_CONSTANT;
				everyone[i].deviation /= GLICKO_2_CONVERSTION_CONSTANT;
			}
		}
	}

	/**
	 * Converts from the standard glicko ratings (normalized about 0), to the user facing values. Skips anyone who is yet to be rated
	 * @param everyone an array of everyone's glicko rating
	 */
	function convertFromGlicko2(everyone: IRating[])
	{
		for(let i = 0; i < everyone.length; i++)
		{
			if(israted(everyone[i]))
			{
				everyone[i].rating = everyone[i].rating * GLICKO_2_CONVERSTION_CONSTANT + Glicko.INITIAL_RATING;
				everyone[i].deviation *= GLICKO_2_CONVERSTION_CONSTANT;
			}
		}
	}

	/**
	 * Makes an array of objects used in calculating the rating changes for each player. This is described at the end of step 2 in the glicko2.pdf
	 * @param player Player whos opponents object we are making
	 * @param games Array of all games played
	 * @param ratingMap Function mapping from whatever games[i].white may be to a rating object\
	 * @returns the array of objects that we want
	 */
	function makeOpponentArray<T>(player: IRating, games: { white: T, black: T, result: number }[], ratingMap: (key: T) => IRating): { rating: number, deviation: number, score: number }[]
	{
		/**
		 * Makes an object for a match from one player's perspective.
		 * @param opponent the opponent
		 * @param score the result of the game from the player's perspective
		 * @returns The object for this match
		 */
		function makeObj(opponent: IRating, score: number)
		{
			return {
				rating: opponent.rating,
				deviation: opponent.deviation,
				score: score
			};
		}

		let output: { rating: number, deviation: number, score: number }[] = [];

		for(let i = 0; i < games.length; i++)
		{
			if(games[i].white === games[i].black)
				throw new Error(`No one can play themselves!`);

			//check is player is white player
			else if(ratingMap(games[i].white) === player)
				output.push(makeObj(ratingMap(games[i].black), games[i].result));

			//check if player is black player
			else if(ratingMap(games[i].black) === player)
				output.push(makeObj(ratingMap(games[i].white), 1 - games[i].result));
		}

		return output;
	}

	/**
	 * Does a rating period of glicko ratings
	 * @param ratingMap Takes in some identifier and returns a reference to a rating object.
	 * @param games Has a white and black player and result from white's persective, white and black will be fed into the ratingMap to get their rating object
	 * @param everyone A array of every rating object in the system.
	 */
	export function doRatingPeriod<T>(ratingMap: (key: T) => IRating, games: { white: T, black: T, result: number }[], everyone: IRating[])
	{
		//Step 1: Determine a rating and RD (deviation) for each player at the onset of the rating period.
		//Go through every player that played and make sure they are rated, if they aren't then initialize their rating.
		for(let i = 0; i < games.length; i++)
		{
			setRating(ratingMap(games[i].white));
			setRating(ratingMap(games[i].black));
		}

		//Step 2: For each player, convert the ratings and RD's (deviation's) onto the Glicko-2 scale.
		convertToGlicko2(everyone);


		let opponentArrays: { rating: number, deviation: number, score: number }[][] = [];
		for(let i = 0; i < everyone.length; i++)
			opponentArrays.push(makeOpponentArray(everyone[i], games, ratingMap));

		/** Function defined in step 3 */
		function g(deviation: number) { return 1 / Math.sqrt(1 + 3 * (deviation * deviation) / (Math.PI * Math.PI)); }
		/** Function defined in step 3 */
		function E(rating: number, opponentRating: number, opponentDeviation: number) { return 1 / (1 + Math.exp(-g(opponentDeviation) * (rating - opponentRating))); }


		for(let i = 0; i < everyone.length; i++)
		{
			let me = everyone[i];
			if(!israted(me))
				continue;

			let opponentArray = opponentArrays[i];
			//if the opponent does not compete during the rating period, described after step 8.
			if(opponentArray.length === 0)
			{
				let deviation = me.deviation;
				let volatility = me.volatility;
				me.deviation = Math.sqrt(deviation * deviation + volatility * volatility);
				continue;
			}


			//Step 3: Compute the quantity $v$. This is the estimated variance of the team's/player's rating based only on game outcomes.
			let estimatedVariance = 0;
			for(let j = 0; j < opponentArray.length; j++)
			{
				let tempG = g(opponentArray[j].deviation);
				let tempE = E(me.rating, opponentArray[j].rating, opponentArray[j].deviation);
				estimatedVariance += tempG * tempG * tempE * (1 - tempE)
			}
			estimatedVariance = 1 / estimatedVariance;


			//Step 4: Compute the quantity $\Delta$, the estimated improvement in rating by comparing the pre-period rating the the preformace rating based only on game outcomes.
			let estimatedImprovement = 0;
			for(let j = 0; j < opponentArrays[i].length; j++)
				estimatedImprovement += g(opponentArray[j].deviation) * (opponentArray[j].score - E(me.rating, opponentArray[j].rating, opponentArray[j].deviation));
			estimatedImprovement *= estimatedVariance;


			//Step 5: Determine the new value, $\sigma'$, of the volatility. This computation requires iteration.
			//part 1:
			let a = Math.log(me.volatility * me.volatility);
			function f(x: number)
			{
				let exp_x = Math.exp(x);
				let deviationSquared = me.deviation * me.deviation;
				let tempSum = deviationSquared + estimatedVariance + exp_x;
				return exp_x * (estimatedImprovement * estimatedImprovement - deviationSquared - estimatedVariance - exp_x) / (2 * tempSum * tempSum) - (x - a) / (TAU * TAU);
			}

			//part 2:
			let A = a;
			let B;
			if(estimatedImprovement * estimatedImprovement > me.deviation * me.deviation + estimatedVariance)
				B = Math.log(estimatedImprovement * estimatedImprovement - me.deviation * me.deviation - estimatedVariance);
			else
			{
				let k = 1;
				while(f(a - k * TAU) < 0)
					k++;
				B = a - k * TAU;
			}

			//part 3:
			let f_a = f(A);
			let f_b = f(B);

			//part 4:
			while(Math.abs(B - A) > CONVERGENCE_TOLERANCE)
			{
				//a)
				let C = A + (A - B) * f_a / (f_b - f_a);
				let f_c = f(C);

				//b)
				if(f_c * f_b < 0)
				{
					A = B;
					f_a = f_b;
				}
				else
				{
					f_a /= 2;
				}

				//c)
				B = C;
				f_b = f_c;
			}

			//part 5:
			me.volatility = Math.exp(A / 2);


			//Step 6: Update the rating deviation to the new pre-rating period value, $\phi^*$
			let tempDeviation = Math.sqrt(me.deviation * me.deviation + me.volatility * me.volatility);


			//Step 7: Update the rating and RD to the new values $\mu'$ and $\phi'$
			me.deviation = 1 / Math.sqrt(1 / (tempDeviation * tempDeviation) + 1 / estimatedVariance);
			let sum = 0;
			for(let j = 0; j < opponentArray.length; j++)
				sum += g(opponentArray[j].deviation) * (opponentArray[j].score - E(me.rating, opponentArray[j].rating, opponentArray[j].deviation));
			me.rating += tempDeviation * tempDeviation * sum;
		}


		//Step 8: Convert back to original scale
		convertFromGlicko2(everyone);
	}
}
