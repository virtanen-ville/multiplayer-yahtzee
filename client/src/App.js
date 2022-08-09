import GameScreen from "./components/GameScreen";
import * as React from "react";
import Container from "@mui/material/Container";
import { Button, Box } from "@mui/material";
import PlayerDialog from "./components/PlayerDialog";
import MultiPlayerDialog from "./components/MultiPlayerDialog";
import { useState, useEffect } from "react";
import socket from "./utils/socket";

import "./App.css";

export default function App() {
	const [isConnected, setIsConnected] = useState(socket.connected);

	const [players, setPlayers] = useState([]);
	const [dialogOpen, setDialogOpen] = useState(false); // Set this to true later if we want to show the dialog for single computer
	const [multiPlayerDialogOpen, setMultiPlayerDialogOpen] = useState(true);

	useEffect(() => {
		socket.on("connect", () => {
			setIsConnected(true);
			console.log(socket.id);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
			console.log(socket.id);
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

	return (
		<div>
			<main>
				<Container maxWidth="md">
					<Box sx={{ my: 4, textAlign: "center" }}>
						<GameScreen players={players} />
						<PlayerDialog
							players={players}
							setPlayers={setPlayers}
							dialogOpen={dialogOpen}
							setDialogOpen={setDialogOpen}
						/>
						<MultiPlayerDialog
							players={players}
							setPlayers={setPlayers}
							dialogOpen={multiPlayerDialogOpen}
							setDialogOpen={setMultiPlayerDialogOpen}
						/>
						<Button
							onClick={() => setDialogOpen(true)}
							variant="outlined"
							color="primary"
							sx={{ margin: "1rem" }}
						>
							New game
						</Button>
					</Box>
				</Container>
			</main>
		</div>
	);
}
