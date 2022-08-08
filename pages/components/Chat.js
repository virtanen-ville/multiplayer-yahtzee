import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("ws://127.0.0.1:8999");

const URL = "ws://127.0.0.1:8999";

const Chat = () => {
	const [isConnected, setIsConnected] = useState(socket.connected);

	const [user, setUser] = useState("Tarzan");
	const [message, setMessage] = useState([]);
	const [messages, setMessages] = useState([]);
	const [ws, setWs] = useState({});

	const submitMessage = (usr, msg) => {
		const message = { user: usr, message: msg };
		//ws.send(JSON.stringify(message));
		socket.emit("message", message);
		setMessages([message, ...messages]);
	};

	useEffect(() => {
		socket.on("connect", () => {
			setIsConnected(true);
			console.log(socket.id);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
			console.log(socket.id);
		});

		socket.on("pong", () => {
			setLastPong(new Date().toISOString());
		});
		socket.on("hello", (arg) => {
			console.log(arg); // world
		});
		socket.on("message", (message) => {
			setMessages([message, ...messages]);
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("pong");
			socket.off("hello");
		};
	}, []);
	/*
useEffect(() => {
		let ws = new WebSocket(URL);
		setWs(ws);
	}, []);

	useEffect(() => {
		if (ws) {
			ws.onopen = () => {
				console.log("WebSocket Connected");
			};

			ws.onmessage = (e) => {
				//ws.binaryType = "blob";
				if (e.data instanceof Blob) {
					const reader = new FileReader();
					reader.onload = () => {
						const data = JSON.parse(reader.result);
						setMessages([data, ...messages]);
					};
					reader.readAsText(e.data);
				} else {
					const data = JSON.parse(e.data);
					setMessages([data, ...messages]);
				}
			};

			// console.log("Message from server: ", e.data, " JUST e:", e);
			// const message = JSON.parse(e.data);
			// console.log("message", message);
			// setMessages([message, ...messages]);

			return () => {
				ws.onclose = () => {
					console.log("WebSocket Disconnected");
					setWs(new WebSocket(URL));
				};
			};
		}
	}, [ws.onmessage, ws.onopen, ws.onclose, messages]);
*/

	return (
		<div>
			<label htmlFor="user">
				Name :
				<input
					type="text"
					id="user"
					placeholder="User"
					value={user}
					onChange={(e) => setUser(e.target.value)}
				/>
			</label>

			<ul>
				{messages.reverse().map((message, index) => (
					<li key={index}>
						<b>{message.user}</b>: <em>{message.message}</em>
					</li>
				))}
			</ul>

			<form
				action=""
				onSubmit={(e) => {
					e.preventDefault();
					submitMessage(user, message);
					setMessage([]);
				}}
			>
				<input
					type="text"
					placeholder={"Type a message ..."}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<input type="submit" value={"Send"} />
			</form>
		</div>
	);
};

export default Chat;
