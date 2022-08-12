import Die from "./Die";
import { ButtonBase } from "@mui/material";
import socket from "../utils/socket";

const Dice = ({ dice, setDice, throwsLeft, rotateDice, playMode }) => {
	const lockDie = (index) => {
		console.log("playMode: ", playMode);
		console.log(dice);
		if (throwsLeft > 0) {
			const newDice = dice.map((die, i) => {
				if (i === index) {
					return {
						...die,
						locked: !die.locked,
					};
				}
				return die;
			});
			if (playMode === "single") {
				setDice(newDice);
				console.log(dice);
			} else if (playMode === "multi") {
				socket.emit("newDice", newDice);
				console.log(newDice);
			}
		}
	};

	return (
		<>
			{!dice[0] ? (
				<div>Loading...</div>
			) : (
				<>
					{dice.map((die, index) => (
						<ButtonBase
							onClick={() => {
								console.log("index: ", index);
								lockDie(index);
							}}
							key={index}
							index={index}
							disableRipple
						>
							<Die
								value={die.value}
								locked={die.locked}
								rotateDice={rotateDice}
							/>
						</ButtonBase>
					))}
				</>
			)}
		</>
	);
};

export default Dice;
