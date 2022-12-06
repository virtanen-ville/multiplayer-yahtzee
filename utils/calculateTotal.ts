export const calculateTotal = (points: any) => {
	const pointArray: number[] = Object.values(points);
	const bonusArray = pointArray.slice(0, 6);
	let bonusScore = bonusArray.reduce((a, b) => a + b, 0) >= 63 ? 50 : 0;
	const total = pointArray.reduce((a, b) => a + b, 0) + bonusScore;
	return total;
};
