import { useState } from "react";
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";

import { io } from "socket.io-client";

const socket = io("ws://127.0.0.1:8999");

export default function MultiPlayerDialog({
	dialogOpen,
	setDialogOpen,
	setPlayers,
	players,
}) {
	const [newPlayer, setNewPlayer] = useState("");

	const handleClickSubmit = (e) => {
		e.preventDefault();
		if (newPlayer.length > 0) {
			setPlayers((prevState) => [...prevState, newPlayer]);
			socket.emit("playerSet", newPlayer);
		}

		setDialogOpen(false);
	};

	const handleClose = () => {
		setDialogOpen(false);
	};

	return (
		<Dialog open={dialogOpen} onClose={handleClose}>
			<DialogTitle>Set players</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Enter your name and click "Join the Game"
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="player1"
					label="Player 1"
					type="text"
					fullWidth
					variant="standard"
					value={newPlayer}
					onChange={(e) => setNewPlayer(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} variant="outlined" color="error">
					Cancel
				</Button>
				<Button
					onClick={handleClickSubmit}
					variant="contained"
					color="primary"
				>
					Join the Game
				</Button>
			</DialogActions>
		</Dialog>
	);
}
