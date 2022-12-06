import React, { useRef } from "react";
import {
	Backdrop,
	Box,
	Button,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useSetUser } from "../context/userContext";
import { useSetSocket } from "../context/socketContext";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { io } from "socket.io-client";

const Login = () => {
	const navigate: NavigateFunction = useNavigate();
	const setUser = useSetUser();
	const setSocket = useSetSocket();
	const formRef = useRef<HTMLFormElement>();

	const logIn = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();

		if (formRef.current?.username.value) {
			if (formRef.current?.password.value) {
				const response = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: formRef.current?.username.value,
						password: formRef.current?.password.value,
					}),
				});

				if (response.status === 200) {
					console.log("logged in - set the socket");
					let { token, userInfo } = await response.json();
					localStorage.setItem("token", token);
					setUser(userInfo);
					let newSocket = io({
						auth: {
							token: localStorage.getItem("token"),
						},
					});
					setSocket(newSocket);
					navigate("/play");
				}
			}
		}
	};

	return (
		<Backdrop open={true}>
			<Paper sx={{ padding: 2 }}>
				<Box
					component="form"
					onSubmit={logIn}
					ref={formRef}
					style={{
						width: 300,
						padding: 20,
					}}
				>
					<Stack spacing={2}>
						<Typography variant="h6">Log in</Typography>
						<TextField label="Username" name="username" />
						<TextField
							label="Password"
							name="password"
							type="password"
						/>
						<Box
							sx={{
								marginBottom: 2,
								marginTop: 2,
								textAlign: "center",
							}}
						>
							<Button
								type="submit"
								variant="contained"
								sx={{ marginRight: 1 }}
							>
								Log in
							</Button>
							<Button
								sx={{ marginLeft: 1 }}
								onClick={(e: React.FormEvent) => {
									e.preventDefault();
									navigate("/");
								}}
								variant="outlined"
							>
								Cancel
							</Button>
						</Box>
						<Typography
							variant="body1"
							color="initial"
							textAlign={"center"}
						>
							Register a new account
						</Typography>
						<Button
							onClick={(e: React.FormEvent) => {
								e.preventDefault();
								navigate("/register");
							}}
							variant="contained"
							color="secondary"
						>
							Create new account
						</Button>
					</Stack>
				</Box>
			</Paper>
		</Backdrop>
	);
};

export default Login;
