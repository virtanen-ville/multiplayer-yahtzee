import { Points } from "@backend/types";

export class PointsClass {
	ones: number | null = null;
	twos: number | null = null;
	threes: number | null = null;
	fours: number | null = null;
	fives: number | null = null;
	sixes: number | null = null;
	onePair: number | null = null;
	twoPairs: number | null = null;
	threeOfAKind: number | null = null;
	fourOfAKind: number | null = null;
	smallStraight: number | null = null;
	largeStraight: number | null = null;
	fullHouse: number | null = null;
	chance: number | null = null;
	yahtzee: number | null = null;
	get bonus(): number {
		let totalScore = 0;
		totalScore += this.ones || 0;
		totalScore += this.twos || 0;
		totalScore += this.threes || 0;
		totalScore += this.fours || 0;
		totalScore += this.fives || 0;
		totalScore += this.sixes || 0;
		return totalScore >= 63 ? 50 : 0;
	}
	get total(): number {
		let bonusScore = 0;
		bonusScore += this.ones || 0;
		bonusScore += this.twos || 0;
		bonusScore += this.threes || 0;
		bonusScore += this.fours || 0;
		bonusScore += this.fives || 0;
		bonusScore += this.sixes || 0;
		let bonusPoints = bonusScore >= 63 ? 50 : 0;
		let totalScore = 0;
		totalScore += this.ones || 0;
		totalScore += this.twos || 0;
		totalScore += this.threes || 0;
		totalScore += this.fours || 0;
		totalScore += this.fives || 0;
		totalScore += this.sixes || 0;
		totalScore += this.onePair || 0;
		totalScore += this.twoPairs || 0;
		totalScore += this.threeOfAKind || 0;
		totalScore += this.fourOfAKind || 0;
		totalScore += this.smallStraight || 0;
		totalScore += this.largeStraight || 0;
		totalScore += this.fullHouse || 0;
		totalScore += this.chance || 0;
		totalScore += this.yahtzee || 0;
		totalScore += bonusPoints;

		return totalScore;
	}

	constructor(initializer?: Points) {
		if (!initializer) return;
		this.ones = initializer.ones;
		this.twos = initializer.twos;
		this.threes = initializer.threes;
		this.fours = initializer.fours;
		this.fives = initializer.fives;
		this.sixes = initializer.sixes;
		this.onePair = initializer.onePair;
		this.twoPairs = initializer.twoPairs;
		this.threeOfAKind = initializer.threeOfAKind;
		this.fourOfAKind = initializer.fourOfAKind;
		this.smallStraight = initializer.smallStraight;
		this.largeStraight = initializer.largeStraight;
		this.fullHouse = initializer.fullHouse;
		this.chance = initializer.chance;
		this.yahtzee = initializer.yahtzee;
	}
}
