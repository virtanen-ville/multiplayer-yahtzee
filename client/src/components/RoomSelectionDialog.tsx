import { useState, useEffect } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	CircularProgress,
	Box,
	Divider,
} from "@mui/material";
import { useSetPlaymode } from "../context/playmodeContext";
import { useSocket } from "../context/socketContext";
import { useUser } from "../context/userContext";
import { Match, Room } from "@backend/types";
import { NavigateFunction, useNavigate } from "react-router-dom";
import SinglePlayerPortion from "./SinglePlayerPortion";
import RoomList from "./RoomList";
import { getFilteredMatchesFromDB } from "src/controllers/matchesController";
import { useSetScores } from "../context/scoresContext";
import { useSetMatch } from "../context/matchContext";

const RoomSelectionDialog = () => {
	const [roomSelectionDialogOpen, setRoomSelectionDialogOpen] =
		useState(true);
	const [newRoomName, setNewRoomName] = useState("");
	const [roomList, setRoomList] = useState<Room[]>([]);
	const socket = useSocket();
	const user = useUser();
	const setPlaymode = useSetPlaymode();
	const [roomsLoading, setRoomsLoading] = useState(true);
	const [loading, setLoading] = useState(true);
	const navigate: NavigateFunction = useNavigate();
	const [openSingleMatch, setOpenSingleMatch] = useState<undefined | Match>(
		undefined
	);
	const setScores = useSetScores();
	const setMatch = useSetMatch();
	const roomNames = roomList.map((room) => room.name);

	const handleClickMulti = (roomName: string) => {
		if (!user) return;
		if (!socket) return;
		if (roomName === newRoomName) {
			socket.emit("createRoom", newRoomName);
		} else {
			socket.emit("joinRoom", roomName);
		}
		setPlaymode("multi");
		setRoomSelectionDialogOpen(false);
	};

	useEffect(() => {
		if (!user) {
			setLoading(false);
			setRoomsLoading(false);
			return;
		}
		let controller = new AbortController();
		(async () => {
			try {
				const openMatch = await getFilteredMatchesFromDB(
					{
						userId: user._id,
						isActive: true,
					},
					controller
				);

				if (openMatch._id) {
					setOpenSingleMatch(openMatch);
					setLoading(false);
				} else {
					setOpenSingleMatch(undefined);
					setLoading(false);
				}
			} catch (error) {
				console.log(error);
				setOpenSingleMatch(undefined);
				setLoading(false);
			}
		})();
		return () => {
			// cleanup
			setLoading(true);
			controller?.abort();
		};
	}, [setLoading, setRoomsLoading, user]);

	// Get the rooms when component mounts
	useEffect(() => {
		if (!socket) return;
		socket.emit("getRooms");
		return () => {
			socket.off("getRooms");
		};
	}, [socket]);

	useEffect(() => {
		if (!socket) return;
		socket.on("getRooms", (newRoomList) => {
			setRoomList(newRoomList);
			setRoomsLoading(false);
		});

		return () => {
			socket.off("getRooms");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return loading || roomsLoading ? (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				position: "absolute",
			}}
		>
			<CircularProgress
				sx={{
					justifyContent: "center",
					alignItems: "center",
					textAlign: "center",
				}}
			/>
		</Box>
	) : (
		<Dialog open={roomSelectionDialogOpen}>
			<DialogTitle>Single vs Multi player</DialogTitle>
			<DialogContent>
				<SinglePlayerPortion
					setRoomSelectionDialogOpen={setRoomSelectionDialogOpen}
					openSingleMatch={openSingleMatch}
				/>
				<Divider sx={{ marginY: 2 }} />
				<DialogContentText sx={{ marginBottom: 2 }}>
					Or join a room for online multiplayer mode...
				</DialogContentText>
				<RoomList
					newRoomName={newRoomName}
					roomList={roomList}
					handleClickMulti={handleClickMulti}
					roomNames={roomNames}
					setNewRoomName={setNewRoomName}
				/>
			</DialogContent>

			<DialogActions sx={{ marginX: 1 }}>
				<Button
					onClick={() => {
						setRoomSelectionDialogOpen(false);
						navigate("/");
					}}
					variant="outlined"
					color="error"
				>
					Cancel
				</Button>
				<Button
					disabled={roomNames.includes(newRoomName) || !newRoomName}
					onClick={() => handleClickMulti(newRoomName)}
					variant="contained"
					color="primary"
				>
					Create the Room
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RoomSelectionDialog;
