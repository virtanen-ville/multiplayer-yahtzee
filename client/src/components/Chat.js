/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
	List,
	ListItem,
	ListItemText,
	InputAdornment,
	IconButton,
	Box,
	TextField,
} from "@mui/material";
import { Icon } from "@iconify/react";

import socket from "../utils/socket";

const Chat = () => {
	const [chatMessages, setChatMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");

	useEffect(() => {
		socket.on("message", (message, sender) => {
			setChatMessages((prevState) => [
				{ message: message, sender: sender },
				...prevState,
			]);
		});

		return () => {
			socket.off("message");
		};
	}, []);

	return (
		<Box sx={{ display: "inline-block", flexGrow: 1 }}>
			<TextField
				margin="dense"
				id="newMessage"
				label="Message"
				type="text"
				multiline
				value={newMessage}
				onChange={(e) => setNewMessage(e.target.value)}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => {
									socket.emit("sendMessage", newMessage);
									setNewMessage("");
								}}
							>
								<Icon icon="akar-icons:send" />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>

			<List
				sx={{
					width: "100%",
					maxWidth: 360,
					bgcolor: "background.paper",
				}}
			>
				{chatMessages.map((message, index) => (
					<React.Fragment>
						<ListItem
							divider
							dense
							key={index} //alignItems="flex-start"
						>
							<ListItemText
								primary={message.sender}
								secondary={message.message}
							/>
						</ListItem>
					</React.Fragment>
				))}
			</List>
		</Box>
	);
};

export default Chat;
