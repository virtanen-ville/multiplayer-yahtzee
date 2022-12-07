import { useEffect, useState } from "react";
import Dice from "./Dice";
import ScoreTable from "./ScoreTable";
import TotalScores from "./TotalScores";
import {
	Box,
	Button,
	Alert,
	AlertTitle,
	Backdrop,
	Typography,
	AlertColor,
} from "@mui/material";
import { useUser, useSetUser } from "../context/userContext";

import { useSetMatch, useMatch } from "../context/matchContext";
import {
	CustomJwtPayload,
	Die,
	DieValues,
	Score,
	ThrowsLeft,
} from "@backend/types";

import jwt_decode from "jwt-decode";

import { useSocket } from "../context/socketContext";
import { usePlaymode, useSetPlaymode } from "../context/playmodeContext";
import { useScores, useSetScores } from "../context/scoresContext";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { MatchClass } from "src/classes/Match";
import { ObjectId } from "bson";
import { ScoresClass } from "../classes/Scores";
import {
	deleteMatchFromDB,
	updateMatchToDB,
} from "../controllers/matchesController";
import { deleteScoreFromDB } from "src/controllers/scoresController";

interface AlertInfo {
	open: boolean;
	severity: AlertColor;
	title: string;
	text: string;
}
const GameScreen = ({ guestName, setGameoverDialogOpen }: any) => {
	const [rotateDice, setRotateDice] = useState(false);
	const scores = useScores();
	const setScores = useSetScores();
	const match = useMatch();
	const setMatch = useSetMatch();
	const socket = useSocket();
	const playmode = usePlaymode();
	const setPlaymode = useSetPlaymode();
	const user = useUser();
	const navigate: NavigateFunction = useNavigate();
	const [alertInfo, setAlertInfo] = useState<AlertInfo>({
		open: false,
		title: "",
		severity: "success",
		text: "",
	});
	const setUser = useSetUser();

	const isTurnOfPlayer = (playerName: string) => {
		return (
			match.turn ===
			scores.findIndex((score) => score.username === playerName)
		);
	};
	const [logOutAlert, setLogOutAlert] = useState(false);
	const [loggedOut, setLoggedOut] = useState(false);

	const [dismissPressed, setDismissPressed] = useState(false);

	// If the navigation is from the Home page, the guestName will be passed in as a prop.
	useEffect(() => {
		if (user) return;
		if (!guestName) {
			navigate("/");
			return;
		}
		setPlaymode("guest");
		const guestId = new ObjectId();
		const newScore = new ScoresClass({
			username: guestName,
			_id: guestId,
		});
		setScores({
			type: "created",
			newScores: [newScore],
		});
		const newMatch = {
			...match,
			startTime: new Date(),
			isActive: true,
			round: 1,
			turn: 0,
			throwsLeft: 3 as ThrowsLeft,
			scores: [{ userId: guestId, scoreId: newScore._id }],
		};
		setMatch({ type: "updateMatch", newMatch: newMatch });

		return () => {
			if (guestName && !user) {
				setScores({
					type: "reset",
				});
				setMatch({ type: "updateMatch", newMatch: new MatchClass() });
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Check if the token is about to expire (every time when the scores change)
	useEffect(() => {
		let token = localStorage.getItem("token");
		if (!token) return;
		try {
			let decoded = jwt_decode<CustomJwtPayload>(token as string);

			if (!decoded.exp) return;
			if (decoded.exp * 1000 < Date.now()) {
				setLoggedOut(true);
				setUser(null);
				setPlaymode("");
			} else if (
				decoded.exp * 1000 < Date.now() + 1000 * 60 * 10 &&
				!dismissPressed
			) {
				setLogOutAlert(true);
			}
		} catch (err) {
			console.log(err);
		}
	}, [dismissPressed, scores, setPlaymode, setUser]);

	const dismissLogOutAlert = () => {
		setDismissPressed(true);
		setLogOutAlert(false);
	};

	const getNewToken = async () => {
		try {
			const response = await fetch("/api/auth/validate", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if (response.status === 200) {
				console.log("User validated - set the socket and user");
				let { token } = await response.json();
				localStorage.setItem("token", token);
				setLogOutAlert(false);
			} else {
				console.log("Not authenticated! Server response: ", response);
				localStorage.removeItem("token");
				setLogOutAlert(false);
			}
		} catch (err) {
			console.log(err);
			localStorage.removeItem("token");
			setLogOutAlert(false);
		}
	};

	const getNewDice = () => {
		const newDice: Die[] = match.dice.map((die) => {
			if (!die.locked) {
				return {
					...die,
					value: (Math.floor(Math.random() * 6) + 1) as DieValues,
				};
			}
			return die;
		});
		return newDice;
	};

	const throwDice = () => {
		// Start rotating the dice
		if (playmode === "guest") {
			setRotateDice(true);
		} else if (playmode === "single") {
			setRotateDice(true);
		} else if (playmode === "multi") {
			if (!socket) return;
			socket.emit("rotateDice", true, match._id);
		}

		// Set these already so the rolling will be smoother
		const newMatch = {
			...match,
			throwsLeft: (match.throwsLeft - 1) as ThrowsLeft,
			dice: getNewDice(),
		};
		if (playmode === "single") {
			(async () => {
				const res = await updateMatchToDB(newMatch);
			})();
		}

		// Wait 3 seconds for the dice to roll and then set the new dice
		setTimeout(() => {
			if (playmode === "guest") {
				setRotateDice(false);
				setMatch({
					type: "updateMatch",
					newMatch: newMatch,
				});
			} else if (playmode === "single") {
				setRotateDice(false);
				setMatch({
					type: "updateMatch",
					newMatch: newMatch,
				});
			} else if (playmode === "multi") {
				if (!socket) return;
				socket.emit("rotateDice", false, match._id);
				socket.emit("newMatch", newMatch);
			}
		}, 3000);
	};

	const startNewMultiplayerGame = () => {
		if (!socket) return;

		const matchScores = scores.map((score) => {
			return {
				scoreId: score._id,
				userId: score.userId,
			};
		});
		const newMatchInitializer = {
			startTime: new Date(),
			isActive: true,
			scores: matchScores,
		};
		const newMatch = new MatchClass(newMatchInitializer);
		socket.emit("createNewMatchAndScores", newMatch, scores);
	};

	const handleClickQuit = async () => {
		if (playmode === "guest") {
			setMatch({ type: "reset" });
			setScores({ type: "reset" });
			setPlaymode("");
			navigate("/");
		} else if (playmode === "single") {
			const matchRes = await deleteMatchFromDB(match._id);
			const scoreRes = await deleteScoreFromDB(scores[0]._id);
			setMatch({ type: "reset" });
			setScores({ type: "reset" });
			setPlaymode("");
			navigate("/");
		} else if (playmode === "multi") {
			if (!socket) return;
			socket.emit("leaveRoom");
			setMatch({ type: "reset" });
			setScores({ type: "reset" });
			setPlaymode("");
			navigate("/");
		}
	};

	useEffect(() => {
		if (!socket) return;

		socket.on("newMatch", (newMatch) => {
			setMatch({ type: "updateMatch", newMatch: newMatch });
		});

		socket.on("createNewMatchAndScores", (newMatch, scores) => {
			console.log(
				"🚀 ~ file: GameScreen.tsx:260 ~ socket.on ~ newMatch, scores",
				newMatch,
				scores
			);
			setScores({
				type: "updateMulti",
				newScores: scores,
			});
			setMatch({ type: "updateMatch", newMatch: newMatch });
		});

		socket.on("rotateDice", (rotateDice) => {
			setRotateDice(rotateDice);
		});

		socket.on("joinRoom", (room, newPlayers) => {
			setAlertInfo({
				open: true,
				severity: "success",
				title: "Success",
				text: `${
					newPlayers[newPlayers.length - 1].username
				} joined the room: ${room}`,
			});
			const newScores: Score[] = newPlayers.map(
				(player) => new ScoresClass(player)
			);
			setScores({
				type: "created",
				newScores: newScores,
			});
		});
		socket.on("goHome", () => {
			setPlaymode("");
			navigate("/");
		});

		socket.on("leaveRoom", (username) => {
			if (username === user?.username) return;
			setAlertInfo({
				open: true,
				severity: "warning",
				title: "Warning",
				text: `Player: ${username} has left the
				room`,
			});
			setScores({
				type: "deleteOne",
				deletedScoreUsername: username,
			});
		});

		return () => {
			socket.off("newMatch");
			socket.off("createNewMatchAndScores");
			socket.off("rotateDice");
			socket.off("joinRoom");
			socket.off("goHome");
			socket.off("leaveRoom");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return (
		<Box
			sx={{
				textAlign: "center",
				padding: 2,
				minWidth: "80%",
			}}
		>
			<Backdrop
				sx={{
					color: "#fff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={alertInfo.open}
				onClick={() => setAlertInfo({ ...alertInfo, open: false })}
			>
				{alertInfo.open && (
					<Alert severity={alertInfo.severity}>
						<AlertTitle>{alertInfo.title}</AlertTitle>
						{alertInfo.text}
					</Alert>
				)}
			</Backdrop>
			<Backdrop
				sx={{
					color: "#fff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={logOutAlert || loggedOut}
			>
				{loggedOut ? (
					<Alert severity="error">
						<AlertTitle>Session expired!</AlertTitle>
						<Typography variant="subtitle2">
							Go back to home or login page
						</Typography>
						<Button
							sx={{ mt: 2, mr: 2 }}
							size="small"
							color="error"
							variant="contained"
							onClick={() => {
								setLoggedOut(false);
								navigate("/");
							}}
						>
							Go to Home
						</Button>
						<Button
							sx={{ mt: 2, ml: 2 }}
							size="small"
							variant="contained"
							onClick={() => {
								setLoggedOut(false);
								navigate("/login");
							}}
						>
							Go to Login{" "}
						</Button>
					</Alert>
				) : logOutAlert ? (
					<Alert severity="warning">
						<AlertTitle>Session expires in 10 minutes</AlertTitle>
						<Typography variant="subtitle2">
							Do you want to keep playing?
						</Typography>
						<Button
							sx={{ mt: 2, mr: 2 }}
							size="small"
							color="error"
							variant="contained"
							onClick={dismissLogOutAlert}
						>
							Dismiss
						</Button>
						<Button
							sx={{ mt: 2, ml: 2 }}
							size="small"
							variant="contained"
							onClick={getNewToken}
						>
							Refresh the session
						</Button>
					</Alert>
				) : null}
			</Backdrop>

			{playmode === "multi" && !match.isActive ? (
				<Button
					variant="contained"
					size="large"
					onClick={startNewMultiplayerGame}
					sx={{
						display: "block",
						marginY: "0.7em",
						marginX: "auto",
					}}
				>
					Lock room and start game
				</Button>
			) : (
				<>
					<Dice rotateDice={rotateDice} />

					<Button
						disabled={
							match.throwsLeft <= 0 ||
							match.round > 15 * scores.length ||
							(playmode !== "guest" &&
								!isTurnOfPlayer(String(user?.username))) ||
							rotateDice
						}
						sx={{
							display: "block",
							marginY: "0.7em",
							marginX: "auto",
						}}
						variant="contained"
						//size="large"
						onClick={throwDice}
					>
						Throw
					</Button>
					<Typography gutterBottom variant="body1">
						Turn:{" "}
						{match.round <= 15 * scores.length
							? scores[match.turn].username
							: "No more turns"}{" "}
						- {match.throwsLeft}{" "}
						{match.throwsLeft === 1 ? "throw" : "throws"} left
					</Typography>
				</>
			)}

			<ScoreTable
				setGameoverDialogOpen={setGameoverDialogOpen}
				isTurnOfPlayer={isTurnOfPlayer}
			/>
			<TotalScores />
			<Button
				color="error"
				sx={{
					display: "block",
					marginY: "0.7em",
					marginX: "auto",
				}}
				variant="contained"
				onClick={handleClickQuit}
			>
				{playmode === "multi" ? "Leave room" : "Quit game"}
			</Button>
		</Box>
	);
};

export default GameScreen;
