/// <reference path="Constants.ts"/>

/** Things that I write that I use everywhere */
namespace Benji
{
	/**
	 * Makes a deep clone (as opposed to shalow) will break on recursive references.
	 * @param input variable to be deep cloned
	 */
	export function deepClone(input: any): any
	{
		//TODO make this better by not doing the whole JSON thing.
		return JSON.parse(JSON.stringify(input));
	}
}