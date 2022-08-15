import {
	Button,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import socket from "../utils/socket";

export default function SingleVsMultiDialog({
	dialogOpen,
	setDialogOpen,
	setPlayMode,
}) {
	const handleClickSubmit = (mode) => {
		setPlayMode(mode);
		setDialogOpen(false);

		if (mode === "multi") {
			socket.emit("getRooms");
		}
	};

	const handleClose = () => {
		setDialogOpen(false);
	};

	return (
		<Dialog open={dialogOpen} onClose={handleClose}>
			<DialogTitle>Single or Multi computer</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Single mode has 1-4 players on single computer. In multi
					mode you can play over the web against others.
				</DialogContentText>
			</DialogContent>
			<Button
				sx={{
					marginX: 2,
				}}
				onClick={() => handleClickSubmit("single")}
				variant="contained"
				color="primary"
			>
				Single Computer
			</Button>
			<Button
				sx={{
					margin: 2,
				}}
				onClick={() => handleClickSubmit("multi")}
				variant="contained"
				color="primary"
			>
				Multi Computer
			</Button>
		</Dialog>
	);
}
