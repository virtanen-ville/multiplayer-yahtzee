import GameScreen from "./components/GameScreen";
import * as React from "react";
import Container from "@mui/material/Container";
import { Box } from "@mui/material";
import PlayerDialog from "./components/PlayerDialog";
import MultiPlayerDialog from "./components/MultiPlayerDialog";
import SingleVsMultiDialog from "./components/SingleVsMultiDialog";
import { useState, useEffect } from "react";
import socket from "./utils/socket";

import "./App.css";

export default function App() {
	// eslint-disable-next-line no-unused-vars
	const [isConnected, setIsConnected] = useState(socket.connected);
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
		<div>
			<main>
				<Container maxWidth="md">
					<Box sx={{ my: 4, textAlign: "center" }}>
						<GameScreen players={players} playMode={playMode} />
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
							players={players}
							setPlayers={setPlayers}
							dialogOpen={multiPlayerDialogOpen}
							setDialogOpen={setMultiPlayerDialogOpen}
							setPlayMode={setPlayMode}
							playMode={playMode}
						/>
						{/*
						<Button
							onClick={() => setDialogOpen(true)}
							variant="outlined"
							color="primary"
							sx={{ margin: "1rem" }}
						>
							New game
						</Button>
	*/}
					</Box>
				</Container>
			</main>
		</div>
	);
}
