import { useEffect, useState } from "react";
import Die from "./Die";
import ThrowButton from "./ThrowButton";
import { Typography, Button } from "@mui/material";

const Dice = ({ dice, setDice }) => {
	//const [dice, setDice] = useState([]);
	const [throwsLeft, setThrowsLeft] = useState(2);
	// let diceArray = [];

	// for (let i = 0; i < 5; i++) {
	// 	diceArray.push({
	// 		value: Math.floor(Math.random() * 6) + 1,
	// 		locked: false,
	// 	});
	// }

	const lockDie = (index) => {
		if (throwsLeft > 0) {
			let newDice = [...dice];
			newDice[index].locked = !newDice[index].locked;
			setDice(newDice);
		}
	};
	const throwDice = () => {
		let newDice = [...dice];
		for (let i = 0; i < 5; i++) {
			if (!newDice[i].locked) {
				newDice[i].value = Math.floor(Math.random() * 6) + 1;
			}
		}
		setDice(newDice);
		if (throwsLeft > 0) {
			setThrowsLeft(throwsLeft - 1);
		}
	};

	const resetDice = () => {
		let diceArray = [];

		for (let i = 0; i < 5; i++) {
			diceArray.push({
				value: Math.floor(Math.random() * 6) + 1,
				locked: false,
			});
		}
		setDice(diceArray);
		console.log(dice);
		setThrowsLeft(2);
	};

	useEffect(() => {
		resetDice();
	}, []);

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
					{throwsLeft > 0 ? (
						<Button variant="contained" onClick={throwDice}>
							{" "}
							Throw
						</Button>
					) : (
						<Button onClick={() => resetDice()}>New Round</Button>
					)}

					<Typography>{throwsLeft} throws left</Typography>
				</>
			)}
		</>
	);
};

export default Dice;
