/// <reference path="Constants.ts"/>


namespace Benji
{
	export function deepClone(input)
	{
		return JSON.parse(JSON.stringify(input));
	}
}