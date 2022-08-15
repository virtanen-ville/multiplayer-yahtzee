/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import * as calculateScores from "../utils/calculateScores";
import Dice from "./Dice";
import ScoreTable from "./ScoreTable";
import TotalScores from "./TotalScores";
import Turn from "./Turn";
import { Box, Button, Alert, AlertTitle, Backdrop } from "@mui/material";

import socket from "../utils/socket";

const GameScreen = ({
	players,
	playMode,
	setPlayMode,
	setPlayers,
	roomName,
	setRoomName,
}) => {
	const [scoreCard, setScoreCard] = useState([]);
	const [dice, setDice] = useState([]);
	const [throwsLeft, setThrowsLeft] = useState(2);
	const [playerTurn, setPlayerTurn] = useState(0);
	const [bonusScores, setBonusScores] = useState([]);
	const [allScores, setAllScores] = useState([]);
	const [rotateDice, setRotateDice] = useState(false);
	const [rounds, setRounds] = useState(15);
	const [alertOn, setAlertOn] = useState(false);

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
		setTimeout(() => {
			const newState = dice.map((die) => {
				if (!die.locked) {
					return {
						...die,
						value: Math.floor(Math.random() * 6) + 1,
					};
				}
				return die;
			});
			if (playMode === "single") {
				setDice(newState);
				setRotateDice(false);
			} else if (playMode === "multi") {
				socket.emit("newDice", newState);
				socket.emit("rotateDice", false);
			}
		}, 3000);

		if (playMode === "single") {
			setRotateDice(true);
		} else if (playMode === "multi") {
			socket.emit("rotateDice", true);
		}
	};

	const calculateThrowsLeft = () => {
		if (throwsLeft <= 0) return;

		if (playMode === "single") {
			setThrowsLeft(throwsLeft - 1);
		} else if (playMode === "multi") {
			socket.emit("throwsLeft", throwsLeft - 1);
		}
	};

	const resetDice = () => {
		let newDiceArray = [];
		for (let i = 0; i < 5; i++) {
			newDiceArray.push({
				value: Math.floor(Math.random() * 6) + 1,
				locked: false,
			});
		}

		const unlockedState = dice.map((die) => {
			if (die.locked) {
				return {
					...die,
					locked: false,
				};
			}
			return die;
		});

		if (playMode === "single") {
			setDice(unlockedState);
			setRotateDice(true);
		} else if (playMode === "multi") {
			socket.emit("newDice", unlockedState);
			socket.emit("rotateDice", true);
		}

		setTimeout(() => {
			if (playMode === "single") {
				setDice(newDiceArray);
				setRotateDice(false);
			} else if (playMode === "multi") {
				socket.emit("newDice", newDiceArray);
				socket.emit("rotateDice", false);
			}
		}, 3000);
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
		let newDiceArray = [];
		for (let i = 0; i < 5; i++) {
			newDiceArray.push({
				value: Math.floor(Math.random() * 6) + 1,
				locked: false,
			});
		}
		setDice(newDiceArray);
		setRounds(15 * players.length);
		resetScoreCard();
	}, [players]);

	useEffect(() => {
		socket.on("newDice", (newDice) => {
			setDice(newDice);
		});

		socket.on("newRounds", (newRounds) => {
			setRounds(newRounds);
		});

		socket.on("newTurn", (newTurn) => {
			setPlayerTurn(newTurn);
		});

		socket.on("throwsLeft", (throwsLeft) => {
			setThrowsLeft(throwsLeft);
		});
		socket.on("rotateDice", (rotateDice) => {
			setRotateDice(rotateDice);
		});

		socket.on("newScoreCard", (newScoreCard) => {
			setScoreCard(newScoreCard);
		});

		socket.on("roomJoined", (room) => {
			setRoomName(room);
			setAlertOn(true);
			console.log("Joined room: ", room);
		});

		return () => {
			socket.off("newDice");
			socket.off("newRounds");
			socket.off("newTurn");
			socket.off("throwsLeft");
			socket.off("rotateDice");
			socket.off("newScoreCard");
			socket.off("roomJoined");
		};
	}, []);

	return (
		<Box sx={{ textAlign: "center", flexGrow: 3 }}>
			<Backdrop
				sx={{
					color: "#fff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={alertOn}
				onClick={() => setAlertOn(false)}
			>
				<Alert severity="success">
					<AlertTitle>Success</AlertTitle>
					You have joined room: <strong>{roomName}</strong>
				</Alert>
			</Backdrop>
			<Dice
				rotateDice={rotateDice}
				dice={dice}
				setDice={setDice}
				throwsLeft={throwsLeft}
				playMode={playMode}
			/>

			<Button
				disabled={throwsLeft > 0 ? false : true}
				sx={{
					display: "block",
					marginY: "10px",
					marginX: "auto",
				}}
				variant="contained"
				size="large"
				onClick={() => {
					throwDice();
					calculateThrowsLeft();
				}}
			>
				Throw
			</Button>
			<Turn
				players={players}
				playerTurn={playerTurn}
				rounds={rounds}
				throwsLeft={throwsLeft}
			/>
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
				playMode={playMode}
				throwDice={throwDice}
			/>
			<TotalScores allScores={allScores} />
			{playMode === "single" ? null : (
				<Button
					sx={{ margin: 1 }}
					variant="contained"
					color="secondary"
					onClick={() => {
						socket.emit("leaveRoom");
						setPlayMode("");
						setPlayers([]);
					}}
				>
					Leave Room
				</Button>
			)}
			<Button
				sx={{ margin: 1 }}
				variant="contained"
				color="primary"
				disabled={rounds > 0}
				onClick={() => {
					console.log("Start a new Game");
					setRounds(15 * players.length);
					resetDice();
					resetScoreCard();
				}}
			>
				Start New Game
			</Button>
		</Box>
	);
};

export default GameScreen;
