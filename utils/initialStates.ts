import { Points, Die } from "../types/types";

export const initialScores: Points = {
	ones: null,
	twos: null,
	threes: null,
	fours: null,
	fives: null,
	sixes: null,
	onePair: null,
	twoPairs: null,
	threeOfAKind: null,
	fourOfAKind: null,
	smallStraight: null,
	largeStraight: null,
	fullHouse: null,
	chance: null,
	yahtzee: null,
	total: 0,
	bonus: 0,
};

export const initialDice: Die[] = [
	{
		locked: false,
		value: 1,
	},
	{
		locked: false,
		value: 1,
	},
	{
		locked: false,
		value: 1,
	},
	{
		locked: false,
		value: 1,
	},
	{
		locked: false,
		value: 1,
	},
];
