import {
	ListItemIcon,
	ListItemText,
	ListItem,
	ListItemButton,
	IconButton,
	List,
	TextField,
} from "@mui/material";
import { useSocket } from "../context/socketContext";
import { useUser } from "../context/userContext";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ObjectId } from "bson";
import { Room } from "@backend/types";

interface RoomListProps {
	roomList: Room[];
	handleClickMulti: (roomName: string) => void;
	newRoomName: string;
	roomNames: string[];
	setNewRoomName: React.Dispatch<React.SetStateAction<string>>;
}

const RoomList = ({
	newRoomName,
	roomList,
	handleClickMulti,
	roomNames,
	setNewRoomName,
}: RoomListProps) => {
	const socket = useSocket();
	const user = useUser();

	const deleteRoom = (roomId: ObjectId) => {
		if (!user) return;
		if (!socket) return;
		socket.emit("deleteRoom", roomId);
	};

	return (
		<List dense>
			<ListItem
				//divider
				disablePadding
			>
				<TextField
					fullWidth
					variant="standard"
					error={roomNames.includes(newRoomName)}
					helperText={
						roomNames.includes(newRoomName)
							? "Room name already exists"
							: ""
					}
					label="Create new Room"
					value={newRoomName}
					onChange={(e) => setNewRoomName(e.target.value)}
				/>
			</ListItem>
			{roomList.map((room, idx) => (
				<ListItem
					divider
					key={idx}
					value={room.name}
					disabled={room.isLocked ? true : false}
					disablePadding
					secondaryAction={
						room.createdBy._id === user?._id ? (
							<IconButton
								edge="end"
								aria-label="delete-room"
								onClick={() => {
									deleteRoom(room._id);
								}}
							>
								<DeleteForeverIcon color="warning" />
							</IconButton>
						) : null
					}
				>
					<ListItemButton
						onClick={() => {
							handleClickMulti(room.name);
						}}
						disabled={room.isLocked ? true : false}
					>
						<ListItemIcon>
							{room.isLocked ? (
								<LockOutlinedIcon
									fontSize="small"
									color="warning"
								/>
							) : (
								<LockOpenOutlinedIcon
									fontSize="small"
									color="success"
								/>
							)}
						</ListItemIcon>
						<ListItemText
							primary={room.name}
							secondary={`${room.currentPlayers.length} players`}
						/>
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
};

export default RoomList;
