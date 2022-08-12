import { useState, useEffect } from "react";
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Backdrop,
	Box,
	MenuItem,
	InputLabel,
	FormControl,
	Select,
} from "@mui/material";
import socket from "../utils/socket";

export default function MultiPlayerDialog({
	dialogOpen,
	setDialogOpen,
	setPlayers,
	players,
	setPlayMode,
	playMode,
}) {
	let defaultRooms = ["Room 1", "Room 2"];
	const [roomToJoin, setRoomToJoin] = useState("");
	const [newRoom, setNewRoom] = useState("");
	const [newPlayer, setNewPlayer] = useState("");
	const [roomList, setRoomList] = useState(defaultRooms);
	const [showTextfield, setShowTextfield] = useState(false);
	const handleChange = (event) => {
		if (event.target.value === "new") {
			setShowTextfield(true);
			setRoomToJoin(event.target.value);
		} else {
			setRoomToJoin(event.target.value);
			setNewRoom("");
		}
	};

	const handleClickSubmit = (e) => {
		e.preventDefault();

		if (playMode === "multi") {
			if (newPlayer.length > 0) {
				socket.emit(
					"joinRoom",
					roomToJoin === "new" ? newRoom : roomToJoin
				);
				socket.emit("playerSet", newPlayer);
			}
			setDialogOpen(false);
		}
	};

	const handleClose = () => {
		setDialogOpen(false);
	};

	useEffect(() => {
		socket.on("roomList", (roomList) => {
			console.log("roomList: ", roomList);
			setRoomList([...defaultRooms, ...roomList]);
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
		<Backdrop
			open={dialogOpen}
			//onClick={handleClose}
		>
			<Dialog open={dialogOpen} onClose={handleClose}>
				<DialogTitle>Choose a Room</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Enter your name, choose a room and click "Join the Game"
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="playerName"
						label="Player Name"
						type="text"
						fullWidth
						value={newPlayer}
						onChange={(e) => setNewPlayer(e.target.value)}
					/>
					<Box sx={{ marginTop: 4 }}>
						<FormControl fullWidth>
							<InputLabel id="room-selection-label">
								Rooms
							</InputLabel>
							<Select
								labelId="room-selection"
								id="demo-simple-select"
								value={roomToJoin}
								label="Join Room"
								onChange={handleChange}
							>
								{roomList.map((room) => (
									<MenuItem key={room} value={room}>
										{room}
									</MenuItem>
								))}
								<MenuItem value={"new"}>
									Create new Room
								</MenuItem>
							</Select>
						</FormControl>
						<TextField
							fullWidth
							sx={{
								display: showTextfield ? "block" : "none",
								marginTop: 4,
							}}
							id="newRoomName"
							label="New Room Name"
							margin="dense"
							value={newRoom}
							onChange={(e) => setNewRoom(e.target.value)}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							handleClose();
							setPlayMode("");
						}}
						variant="outlined"
						color="error"
					>
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
		</Backdrop>
	);
}
