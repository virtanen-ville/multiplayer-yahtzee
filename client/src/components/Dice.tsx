import DieComponent from "./DieComponent";
import { ButtonBase } from "@mui/material";
import { useSocket } from "../context/socketContext";
import { usePlaymode } from "../context/playmodeContext";
import { useMatch, useSetMatch } from "../context/matchContext";

const Dice = ({ rotateDice }: any) => {
	const match = useMatch();
	const setMatch = useSetMatch();
	const socket = useSocket();
	const playmode = usePlaymode();

	const lockDie = (index: number) => {
		if (playmode !== "multi") {
			setMatch({ type: "lockDie", dieToLock: index });
		} else {
			if (!socket) return;
			const newDice = match.dice.map((die, idx) => {
				if (idx === index) {
					return { ...die, locked: !die.locked };
				} else {
					return die;
				}
			});
			const newMatch = { ...match, dice: newDice };
			socket.emit("newMatch", newMatch);
		}
	};

	return !match.dice[0] ? (
		<div>Loading...</div>
	) : (
		<>
			{match.dice.map((die, index) => (
				<ButtonBase
					onClick={() => {
						lockDie(index);
					}}
					key={index}
					disableRipple
					disabled={
						match.throwsLeft <= 0 ||
						match.throwsLeft >= 3 ||
						rotateDice
					}
				>
					<DieComponent
						value={die.value}
						locked={die.locked}
						rotateDice={rotateDice}
					/>
				</ButtonBase>
			))}
		</>
	);
};

export default Dice;
