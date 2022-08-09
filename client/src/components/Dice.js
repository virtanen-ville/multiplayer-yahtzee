import Die from "./Die";
import socket from "../utils/socket";

const Dice = ({ dice, setDice, throwsLeft, rotateDice }) => {
	const lockDie = (index) => {
		if (throwsLeft > 0) {
			//setDice((prevDice) => {
			const newDice = dice.map((die, i) => {
				if (i === index) {
					return {
						...die,
						locked: !die.locked,
					};
				}
				return die;
			});
			socket.emit("newDice", newDice);
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
				</>
			)}
		</>
	);
};

export default Dice;
