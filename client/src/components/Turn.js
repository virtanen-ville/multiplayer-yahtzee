import { Typography } from "@mui/material";

const Turn = ({ players, playerTurn, rounds, throwsLeft }) => {
	return (
		<Typography gutterBottom variant="h6">
			Turn: {rounds > 0 ? players[playerTurn] : "No more turns"} -{" "}
			{throwsLeft} {throwsLeft === 1 ? "throw" : "throws"} left
		</Typography>
	);
};

export default Turn;
