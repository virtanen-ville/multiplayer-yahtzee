import { useEffect, useState, useRef } from "react";
import * as calculateScores from "../utils/calculateScores";
import Dice from "./Dice";
import Throw from "./Throw";
import ScoreTable from "./ScoreTable";
import TotalScores from "./TotalScores";
import Turn from "./Turn";
import { Box } from "@mui/system";

import socket from "../utils/socket";

const GameScreen = ({ players }) => {
	const [scoreCard, setScoreCard] = useState([]);
	const [dice, setDice] = useState([]);
	const [throwsLeft, setThrowsLeft] = useState(2);
	const [playerTurn, setPlayerTurn] = useState(0);
	const [bonusScores, setBonusScores] = useState([]);
	const [allScores, setAllScores] = useState([]);
	const [rounds, setRounds] = useState(15);
	const [rotateDice, setRotateDice] = useState(false);

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

	const throwDice = () => {
		setTimeout(() =>
			//setDice((prevState) =>
			{
				const newState = dice.map((die) => {
					if (!die.locked) {
						return {
							...die,
							value: Math.floor(Math.random() * 6) + 1,
						};
					}
					return die;
				});
				//return newState;
				socket.emit("newDice", newState);
				socket.emit("rotateDice", false);
			}, 3000);

		if (throwsLeft > 0) {
			socket.emit("throwsLeft", throwsLeft - 1);
			//setThrowsLeft(throwsLeft - 1);
		}
		//setRotateDice(true);
		socket.emit("rotateDice", true);
	};

	const resetDice = () => {
		let diceArray = [];

		for (let i = 0; i < 5; i++) {
			diceArray.push({
				value: Math.floor(Math.random() * 6) + 1,
				locked: false,
			});
		}
		socket.emit("newDice", diceArray);

		//setDice(diceArray);
	};

	/*
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
	*/

	useEffect(() => {
		resetScoreCard();
	}, []);

	useEffect(() => {
		calculateBonusScores();
		//socket.emit("scoreChange", scoreCard);
	}, [scoreCard]);

	useEffect(() => {
		calculateTotalScores();
	}, [scoreCard, bonusScores]);

	useEffect(() => {
		setRounds(15 * players.length);
		resetDice();
		resetScoreCard();
	}, [players]);

	// useEffect(() => {
	// 	socket.emit("scoreChange", scoreCard);
	// }, [scoreCard]);

	useEffect(() => {
		socket.on("newDice", (newDice) => {
			setDice(newDice);
		});

		socket.on("newRounds", (newRounds) => {
			setRounds(newRounds);
		});

		socket.on("newTurn", (newTurn) => {
			setRounds(newTurn);
		});

		socket.on("throwsLeft", (throwsLeft) => {
			setThrowsLeft(throwsLeft);
		});
		socket.on("rotateDice", (rotateDice) => {
			setRotateDice(rotateDice);
		});

		socket.on("newScoreCard", (newScoreCard) => {
			console.log(newScoreCard);
			setScoreCard(newScoreCard);
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("firstConnection");
			socket.off("playerSet");
			socket.off("dieThrow");
		};
	}, []);

	return (
		<Box sx={{ textAlign: "center" }}>
			<Dice
				rotateDice={rotateDice}
				dice={dice}
				setDice={setDice}
				throwsLeft={throwsLeft}
			/>
			<Throw throwsLeft={throwsLeft} throwDice={throwDice} />
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
