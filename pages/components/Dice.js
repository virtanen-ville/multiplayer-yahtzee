import Die from "./Die";

const Dice = ({ dice, setDice, throwsLeft, rotateDice }) => {
	const lockDie = (index) => {
		if (throwsLeft > 0) {
			setDice((prevDice) => {
				const newDice = prevDice.map((die, i) => {
					if (i === index) {
						if (die.locked) {
							return {
								...die,
								locked: false,
							};
						}
						if (!die.locked) {
							return {
								...die,
								locked: true,
							};
						}
					}
					return die;
				});
				return newDice;
			});
		}
	};

	return (
		<>
			{!dice[0] ? (
				<div>Loading...</div>
			) : (
				<>
					{dice.map((die, index) => (
						<Die
							key={index}
							index={index}
							value={die.value}
							locked={die.locked}
							onClick={() => lockDie(index)}
							rotateDice={rotateDice}
						/>
					))}
					{/* <Die
						rotateDice={rotateDice}
						value={dice[0].value}
						locked={dice[0].locked}
						onClick={() => lockDie(0)}
					/>
					<Die
						rotateDice={rotateDice}
						value={dice[1].value}
						locked={dice[1].locked}
						onClick={() => lockDie(1)}
					/>
					<Die
						rotateDice={rotateDice}
						value={dice[2].value}
						locked={dice[2].locked}
						onClick={() => lockDie(2)}
					/>
					<Die
						rotateDice={rotateDice}
						value={dice[3].value}
						locked={dice[3].locked}
						onClick={() => lockDie(3)}
					/>
					<Die
						rotateDice={rotateDice}
						value={dice[4].value}
						locked={dice[4].locked}
						onClick={() => lockDie(4)}
					/> */}
				</>
			)}
		</>
	);
};

export default Dice;
