import { Die, DieValues } from "@backend/types";

export const ones = (dice: Die[]) => {
	let sum = 0;
	dice.forEach((die) => {
		if (die.value === 1) {
			sum += 1;
		}
	});
	return sum;
};

export const twos = (dice: Die[]) => {
	let sum = 0;
	dice.forEach((die) => {
		if (die.value === 2) {
			sum += 2;
		}
	});
	return sum;
};

export const threes = (dice: Die[]) => {
	let sum = 0;
	dice.forEach((die) => {
		if (die.value === 3) {
			sum += 3;
		}
	});
	return sum;
};

export const fours = (dice: Die[]) => {
	let sum = 0;
	dice.forEach((die) => {
		if (die.value === 4) {
			sum += 4;
		}
	});
	return sum;
};

export const fives = (dice: Die[]) => {
	let sum = 0;
	dice.forEach((die) => {
		if (die.value === 5) {
			sum += 5;
		}
	});
	return sum;
};

export const sixes = (dice: Die[]) => {
	let sum = 0;
	dice.forEach((die) => {
		if (die.value === 6) {
			sum += 6;
		}
	});
	return sum;
};

// export const bonusArray = (scores) => {
// 	let sum = 0;
// 	sum = scores.reduce((previousValue, currentValue) => {
// 		return previousValue + currentValue;
// 	}, 0);
// 	if (sum >= 63) {
// 		return 50;
// 	}
// 	return 0;
// };

// export const bonus = (score) => {
// 	if (score >= 63) {
// 		return 50;
// 	}
// 	return 0;
// };
export const onePair = (dice: Die[]) => {
	let diceValues = dice.map((die) => die.value);
	diceValues.sort();
	let pair = false;
	let sum = 0;
	for (let i = 0; i < diceValues.length; i++) {
		for (let j = i + 1; j < diceValues.length; j++) {
			if (diceValues[i] === diceValues[j]) {
				pair = true;
				sum = diceValues[i] + diceValues[j];
			}
		}
	}
	if (pair) {
		return sum;
	} else {
		return 0;
	}
};

export const twoPairs = (dice: Die[]) => {
	let diceValues = dice.map((die) => die.value);
	diceValues.sort();
	let firstPair = 0;
	let secondPair = 0;
	let twoPairs = false;
	let firstPairLogged = false;
	for (let i = 0; i < diceValues.length; i++) {
		for (let j = i + 1; j < diceValues.length; j++) {
			if (diceValues[i] === diceValues[j] && !firstPairLogged) {
				firstPairLogged = true;
				firstPair = diceValues[i] + diceValues[j];
			} else if (diceValues[i] === diceValues[j] && firstPairLogged) {
				secondPair = diceValues[i] + diceValues[j];
				if (firstPair !== secondPair) {
					twoPairs = true;
				}
			}
		}
	}
	if (twoPairs) {
		return firstPair + secondPair;
	} else {
		return 0;
	}
};

export const threeOfAKind = (dice: Die[]) => {
	let diceValues: DieValues[] = dice.map((die) => die.value);
	const count = {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
	};

	diceValues.forEach((die: DieValues) => {
		count[die] = (count[die] || 0) + 1;
	});
	let maxOccurrences = Object.values(count).find((element) => element >= 3);
	let valueThatOccursThreeTimes: any = Object.keys(count).find(
		(key) => count[key as unknown as keyof typeof count] === maxOccurrences
	);
	if (maxOccurrences) {
		return 3 * valueThatOccursThreeTimes;
	} else {
		return 0;
	}
};
export const fourOfAKind = (dice: Die[]) => {
	let diceValues: DieValues[] = dice.map((die) => die.value);
	const count = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
	diceValues.forEach((die: DieValues) => {
		count[die] = (count[die] || 0) + 1;
	});
	let maxOccurrences = Object.values(count).find((element) => element >= 4);
	let valueThatOccursFourTimes: any = Object.keys(count).find(
		(key) => count[key as unknown as keyof typeof count] === maxOccurrences
	);
	if (maxOccurrences) {
		return 4 * valueThatOccursFourTimes;
	} else {
		return 0;
	}
};
export const fullHouse = (dice: Die[]) => {
	let diceValues = dice.map((die) => die.value);
	let fullHouse = false;
	const count = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
	diceValues.forEach((die: DieValues) => {
		count[die] = (count[die] || 0) + 1;
	});
	fullHouse = Boolean(
		Object.values(count).find((value) => value === 3) &&
			Object.values(count).find((value) => value === 2)
	);

	if (fullHouse) {
		return diceValues.reduce((a, b) => a + b, 0);
	} else {
		return 0;
	}
};
export const smallStraight = (dice: Die[]) => {
	let diceValues = dice.map((die) => die.value);
	let diceValuesSorted = diceValues.sort((a, b) => a - b);
	let smallStraight = false;
	if (
		diceValuesSorted[0] === 1 &&
		diceValuesSorted[1] === 2 &&
		diceValuesSorted[2] === 3 &&
		diceValuesSorted[3] === 4 &&
		diceValuesSorted[4] === 5
	) {
		smallStraight = true;
	}
	if (smallStraight) {
		return 15;
	} else {
		return 0;
	}
};
export const largeStraight = (dice: Die[]) => {
	let diceValues = dice.map((die) => die.value);
	let diceValuesSorted = diceValues.sort((a, b) => a - b);
	let largeStraight = false;
	if (
		diceValuesSorted[0] === 2 &&
		diceValuesSorted[1] === 3 &&
		diceValuesSorted[2] === 4 &&
		diceValuesSorted[3] === 5 &&
		diceValuesSorted[4] === 6
	) {
		largeStraight = true;
	}
	if (largeStraight) {
		return 20;
	} else {
		return 0;
	}
};
export const yahtzee = (dice: Die[]) => {
	let diceValues = dice.map((die) => die.value);
	let yahtzee = false;
	if (
		diceValues[0] === diceValues[1] &&
		diceValues[1] === diceValues[2] &&
		diceValues[2] === diceValues[3] &&
		diceValues[3] === diceValues[4]
	) {
		yahtzee = true;
	}
	if (yahtzee) {
		return 50;
	} else {
		return 0;
	}
};
export const chance = (dice: Die[]) => {
	return dice.reduce((previousValue, currentValue) => {
		return previousValue + currentValue.value;
	}, 0);
};

const calculate = {
	ones,
	twos,
	threes,
	fours,
	fives,
	sixes,
	onePair,
	twoPairs,
	threeOfAKind,
	fourOfAKind,
	fullHouse,
	smallStraight,
	largeStraight,
	yahtzee,
	chance,
};

export default calculate;
