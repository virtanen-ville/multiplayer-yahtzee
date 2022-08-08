import React, { useState, useEffect } from "react";

const URL = "ws://127.0.0.1:8999";

const HomePage = (props) => {
	const [user, setUser] = useState("John");
	const [message, setMessage] = useState([]);
	const [messages, setMessages] = useState([]);
	const [ws, setWs] = useState(new WebSocket(URL));

	const submitMessage = (usr, msg) => {
		const message = { user: usr, message: msg };
		ws.send(JSON.stringify(message));
		setMessages([message, ...messages]);
	};

	useEffect(() => {
		ws.onopen = () => {
			console.log("WebSocket Connected");
		};

		ws.onmessage = (e) => {
			const message = JSON.parse(e.data);
			setMessages([message, ...messages]);
		};

		return () => {
			ws.onclose = () => {
				console.log("WebSocket Disconnected");
				setWs(new WebSocket(URL));
			};
		};
	}, [ws.onmessage, ws.onopen, ws.onclose, messages]);

	const apiPhotosFetch = async (method = "GET", body = null) => {
		let url = `/api/test`;

		let settings = {
			method: method || "GET",
			headers: {
				Authorization: `Bearer ${login.token}`,
			},
		};

		if (method === "POST") {
			settings = {
				...settings,
				body: body,
			};
		}

		if (method === "PUT") {
			settings = {
				...settings,
				headers: {
					...settings.headers,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			};
		}
		try {
			const response = await fetch(url, settings);

			if (response.status === 200) {
				let data = await response.json();
				setPhotoData({
					...photoData,
					photos: data,
					loaded: true,
				});
			} else {
				let errorText = "";

				switch (response.status) {
					case 400:
						errorText = "Virhe pyynnön tiedoissa";
						break;
					case 401:
						errorText = "Virhe tunnistautumisessa";
						break;
					default:
						errorText = "Palvelimella tapahtui odottamaton virhe!";
						break;
				}

				setPhotoData({
					...photoData,
					error: errorText,
					loaded: true,
				});
			}
		} catch (error) {
			console.log(error);
			setPhotoData({
				...photoData,
				error: "Palvelimeen ei saada yhteyttä",
				loaded: true,
			});
		}
	};

	useEffect(() => {
		apiPhotosFetch();
	}, []);

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

export default HomePage;
