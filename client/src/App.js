import GameScreen from "./components/GameScreen";
import * as React from "react";
import Container from "@mui/material/Container";
import { Box, Button } from "@mui/material";
import PlayerDialog from "./components/PlayerDialog";
import MultiPlayerDialog from "./components/MultiPlayerDialog";
import SingleVsMultiDialog from "./components/SingleVsMultiDialog";
import { useState, useEffect } from "react";
import Chat from "./components/Chat";
import socket from "./utils/socket";

import "./App.css";

export default function App() {
	// eslint-disable-next-line no-unused-vars
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [rounds, setRounds] = useState(15);

	//const [gameOver, setGameOver] = useState(false)
	const [playMode, setPlayMode] = useState("");
	const [playModeDialogOpen, setPlayModeDialogOpen] = useState(true);
	const [players, setPlayers] = useState([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [multiPlayerDialogOpen, setMultiPlayerDialogOpen] = useState(false);

	useEffect(() => {
		socket.on("connect", () => {
			setIsConnected(true);
			console.log("connected: ", socket.id);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
			console.log("discnnected: ", socket.id);
		});

		socket.on("newPlayer", (newPlayer) => {
			setPlayers((prevState) => [...prevState, newPlayer]);
		});

		socket.on("playersArray", (newPlayers) => {
			setPlayers(newPlayers);
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("firstConnection");
			socket.off("playerSet");
			socket.off("dieThrow");
		};
	}, []);

	useEffect(() => {
		if (playMode === "single") {
			setDialogOpen(true);
		} else if (playMode === "multi") {
			setMultiPlayerDialogOpen(true);
		} else {
			setPlayModeDialogOpen(true);
		}
	}, [playMode]);

	return (
		<Container maxWidth="md">
			<Box sx={{ my: 4, textAlign: "center" }}>
				<Box sx={{ display: "flex" }}>
					<GameScreen
						players={players}
						playMode={playMode}
						rounds={rounds}
						setRounds={setRounds}
					/>
					{playMode === "multi" ? <Chat /> : null}
				</Box>
				<SingleVsMultiDialog
					dialogOpen={playModeDialogOpen}
					setDialogOpen={setPlayModeDialogOpen}
					setPlayMode={setPlayMode}
					playMode={playMode}
				/>
				<PlayerDialog
					players={players}
					setPlayers={setPlayers}
					dialogOpen={dialogOpen}
					setDialogOpen={setDialogOpen}
					setPlayMode={setPlayMode}
					playMode={playMode}
				/>
				<MultiPlayerDialog
					dialogOpen={multiPlayerDialogOpen}
					setDialogOpen={setMultiPlayerDialogOpen}
					setPlayMode={setPlayMode}
					playMode={playMode}
				/>
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
				<Button
					sx={{ margin: 1 }}
					variant="contained"
					color="primary"
					disabled={rounds > 0}
					onClick={() => {
						console.log("Start a new Game");
					}}
				>
					Start New Game
				</Button>
			</Box>
		</Container>
	);
}
