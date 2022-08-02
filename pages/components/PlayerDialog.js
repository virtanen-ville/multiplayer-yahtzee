import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function PlayerDialog({
	dialogOpen,
	setDialogOpen,
	setPlayers,
}) {
	const [player1, setPlayer1] = useState("");
	const [player2, setPlayer2] = useState("");
	const [player3, setPlayer3] = useState("");
	const [player4, setPlayer4] = useState("");

	const handleClickSubmit = (e) => {
		e.preventDefault();
		let newPlayers = [];
		if (player1.length > 0) {
			newPlayers.push(player1);
		}
		if (player2.length > 0) {
			newPlayers.push(player2);
		}
		if (player3.length > 0) {
			newPlayers.push(player3);
		}
		if (player4.length > 0) {
			newPlayers.push(player4);
		}
		console.log(newPlayers);
		setPlayers(newPlayers);
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
					Name the players and then click "Start game"
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="player1"
					label="Player 1"
					type="text"
					fullWidth
					variant="standard"
					value={player1}
					onChange={(e) => setPlayer1(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="player2"
					label="Player 2"
					type="text"
					fullWidth
					variant="standard"
					value={player2}
					onChange={(e) => setPlayer2(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="player3"
					label="Player 3"
					type="text"
					fullWidth
					variant="standard"
					value={player3}
					onChange={(e) => setPlayer3(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="player4"
					label="Player 4"
					type="text"
					fullWidth
					variant="standard"
					value={player4}
					onChange={(e) => setPlayer4(e.target.value)}
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
					Start Game
				</Button>
			</DialogActions>
		</Dialog>
	);
}
