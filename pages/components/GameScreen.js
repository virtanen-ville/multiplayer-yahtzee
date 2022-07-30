import { useEffect, useState } from "react";

import Dice from "./Dice";
import ThrowButton from "./ThrowButton";
import ScoreTable from "./ScoreTable";
import Button from "@mui/material/Button";

const GameScreen = (props) => {
	const [scoreCard, setScoreCard] = useState([]);
	const [dice, setDice] = useState([]);
	let players = props.players;
	players = ["Ville", "Laura", "Sami"];
	const scoreRows = [
		"ones",
		"twos",
		"threes",
		"fours",
		"fives",
		"sixes",
		"onePair",
		"twoPairs",
		"threeOfAKind",
		"fourOfAKind",
		"fullHouse",
		"smallStraight",
		"largeStraight",
		"yahtzee",
		"chance",
	];
	let newScoreCard = [];
	scoreRows.forEach((row) => {
		newScoreCard.push({
			name: row,
			score: 0,
			isFilled: false,
		});
	});

	const resetScoreCard = () => {
		let scoreCardArray = [];
		for (let i = 0; i < players.length; i++) {
			scoreCardArray.push({
				playerName: players[i],
				scores: newScoreCard,
			});
		}
		setScoreCard(scoreCardArray);
	};

	return (
		<>
			<Dice dice={dice} setDice={setDice} />
			<ScoreTable players={players} />
			<Button
				onClick={() => resetScoreCard()}
				variant="contained"
				color="primary"
			>
				Reset scorecard
			</Button>
			<Button
				onClick={() => console.log(scoreCard)}
				variant="contained"
				color="primary"
			>
				Log scorecard
			</Button>
		</>
	);
};

export default GameScreen;
