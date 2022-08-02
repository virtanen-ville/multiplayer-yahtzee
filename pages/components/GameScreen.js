import { useEffect, useState } from "react";
import * as calculateScores from "../../utils/calculateScores";
import Dice from "./Dice";
import ThrowButton from "./ThrowButton";
import ScoreTable from "./ScoreTable";
import Button from "@mui/material/Button";
import TotalScores from "./TotalScores";
import Turn from "./Turn";
import { Box } from "@mui/system";

const GameScreen = ({ players }) => {
	const [scoreCard, setScoreCard] = useState([]);
	const [dice, setDice] = useState([]);
	const [throwsLeft, setThrowsLeft] = useState(2);
	const [playerTurn, setPlayerTurn] = useState(0);
	const [bonusScores, setBonusScores] = useState([]);
	const [allScores, setAllScores] = useState([]);
	const [rounds, setRounds] = useState(15);
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
		"smallStraight",
		"largeStraight",
		"fullHouse",
		"chance",
		"yahtzee",
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

	const calculateTotalScores = () => {
		let newAllScores = [];
		for (let i = 0; i < scoreCard.length; i++) {
			let playerScores = [];
			for (let j = 0; j < scoreCard[i].scores.length; j++) {
				if (scoreCard[i].scores[j].isFilled) {
					playerScores.push(scoreCard[i].scores[j].score);
				}
			}
			newAllScores.push({
				playerName: scoreCard[i].playerName,
				totalScore:
					playerScores.reduce((previousValue, currentValue) => {
						return previousValue + currentValue;
					}, 0) + (bonusScores[i]?.bonusScore || 0),
			});
		}
		setAllScores(newAllScores);
	};

	const calculateBonusScores = () => {
		let newBonusScores = [];
		for (let i = 0; i < scoreCard.length; i++) {
			let playerUpperSectionScores = [];
			for (let j = 0; j < 6; j++) {
				if (scoreCard[i].scores[j].isFilled) {
					playerUpperSectionScores.push(scoreCard[i].scores[j].score);
				}
			}
			newBonusScores.push({
				playerName: scoreCard[i].playerName,
				bonusScore: calculateScores.bonusArray(
					playerUpperSectionScores
				),
			});
		}
		setBonusScores(newBonusScores);
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
	};

	const firstSetDice = () => {
		let diceArray = [];

		for (let i = 0; i < 5; i++) {
			diceArray.push({
				value: Math.floor(Math.random() * 6) + 1,
				locked: false,
			});
		}
		setDice(diceArray);
		setThrowsLeft(2);
	};

	useEffect(() => {
		resetScoreCard();
	}, []);

	useEffect(() => {
		calculateBonusScores();
	}, [scoreCard]);

	useEffect(() => {
		calculateTotalScores();
	}, [scoreCard, bonusScores]);

	useEffect(() => {
		setRounds(15 * players.length);
		firstSetDice();
		resetScoreCard();
	}, [players]);

	return (
		<Box sx={{ textAlign: "center" }}>
			<Dice
				dice={dice}
				setDice={setDice}
				throwsLeft={throwsLeft}
				setThrowsLeft={setThrowsLeft}
				resetDice={resetDice}
				firstSetDice={firstSetDice}
			/>
			<Turn players={players} playerTurn={playerTurn} rounds={rounds} />
			<ScoreTable
				players={players}
				scoreCard={scoreCard}
				setScoreCard={setScoreCard}
				dice={dice}
				resetDice={resetDice}
				bonusScores={bonusScores}
				playerTurn={playerTurn}
				setPlayerTurn={setPlayerTurn}
				throwsLeft={throwsLeft}
				setThrowsLeft={setThrowsLeft}
				setRounds={setRounds}
				rounds={rounds}
			/>
			<TotalScores allScores={allScores} />
		</Box>
	);
};

export default GameScreen;
