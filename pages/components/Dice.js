import Die from "./Die";

const Dice = ({ dice, setDice, throwsLeft }) => {
	const lockDie = (index) => {
		if (throwsLeft > 0) {
			let newDice = [...dice];
			newDice[index].locked = !newDice[index].locked;
			setDice(newDice);
		}
	};

	return (
		<>
			{!dice[0] ? (
				<div>Loading...</div>
			) : (
				<>
					<Die
						value={dice[0].value}
						locked={dice[0].locked}
						onClick={() => lockDie(0)}
					/>
					<Die
						value={dice[1].value}
						locked={dice[1].locked}
						onClick={() => lockDie(1)}
					/>
					<Die
						value={dice[2].value}
						locked={dice[2].locked}
						onClick={() => lockDie(2)}
					/>
					<Die
						value={dice[3].value}
						locked={dice[3].locked}
						onClick={() => lockDie(3)}
					/>
					<Die
						value={dice[4].value}
						locked={dice[4].locked}
						onClick={() => lockDie(4)}
					/>
				</>
			)}
		</>
	);
};

export default Dice;
