import { useEffect, useState } from "react";
import Die from "./Die";
import ThrowButton from "./ThrowButton";
import { Typography, Button } from "@mui/material";

const Dice = ({
	dice,
	setDice,
	throwsLeft,
	setThrowsLeft,
	resetDice,
	firstSetDice,
}) => {
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

	// useEffect(() => {
	// 	firstSetDice();
	// }, []);

	return (
		<>
			{!dice[0] ? (
				<div>Loading...</div>
			) : (
				<div style={{ textAlign: "center" }}>
					<div>
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
					</div>

					<Button
						disabled={throwsLeft > 0 ? false : true}
						sx={{
							display: "block",
							marginY: "10px",
							marginX: "auto",
						}}
						variant="contained"
						size="large"
						onClick={throwDice}
					>
						Throw
					</Button>

					<Typography gutterBottom variant="h4">
						{throwsLeft} throws left
					</Typography>
				</div>
			)}
		</>
	);
};

export default Dice;
