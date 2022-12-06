import React, { useRef, useState } from "react";
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
import { useNavigate, NavigateFunction } from "react-router-dom";
import { MuiFileInput } from "mui-file-input";
import { useSetSocket } from "../context/socketContext";
import { io } from "socket.io-client";

const Register = () => {
	const navigate: NavigateFunction = useNavigate();
	const setUser = useSetUser();
	const setSocket = useSetSocket();

	const formRef = useRef<HTMLFormElement>();
	const [file, setFile] = useState(null);
	const [formErrors, setFormErrors] = useState({
		username: "",
		password: "",
		email: "",
		profilePicture: "",
		firstName: "",
		lastName: "",
		password2: "",
	});

	const handlePicChange = (newFile: any) => {
		if (newFile.size > 1024 * 200) {
			setFormErrors({
				...formErrors,
				profilePicture: "File size must be less than 200kb",
			});
		} else {
			setFormErrors({ ...formErrors, profilePicture: "" });
			setFile(newFile);
		}
	};

	const handleRegister = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		let newFormErrors = { ...formErrors };
		if (formRef.current?.username.value.length < 3) {
			newFormErrors.username = "Username must be at least 3 characters";
		} else {
			newFormErrors.username = "";
		}

		if (formRef.current?.password.value.length < 8) {
			newFormErrors.password = "Password must be at least 8 characters";
		} else {
			newFormErrors.password = "";
		}
		if (
			formRef.current?.password.value !== formRef.current?.password2.value
		) {
			newFormErrors.password2 = "Passwords must match";
		} else {
			newFormErrors.password2 = "";
		}
		if (formRef.current?.email.value.length < 5) {
			newFormErrors.email = "Email must be at least 5 characters";
		} else {
			newFormErrors.email = "";
		}
		if (formRef.current?.firstName.value.length < 1) {
			newFormErrors.firstName = "First name must be at least 1 character";
		} else {
			newFormErrors.firstName = "";
		}
		if (formRef.current?.lastName.value.length < 1) {
			newFormErrors.lastName = "Last name must be at least 1 character";
		} else {
			newFormErrors.lastName = "";
		}

		setFormErrors(newFormErrors);

		// if all errors are empty, submit form
		if (Object.values(newFormErrors).every((value) => value === "")) {
			let formData = new FormData(formRef.current);
			if (file) {
				formData.append("profilePicture", file);
			}
			const response = await fetch("/api/auth/register", {
				method: "POST",
				body: formData,
			});

			if (response.status === 200) {
				let { token, userInfo } = await response.json();
				// set token in a httpOnly cookie with this. We use localStorage though
				// document.cookie = `token=${token}; path=/; httpOnly`;
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
	};

	return (
		<Backdrop open={true}>
			<Paper sx={{ padding: 2 }}>
				<Box
					component="form"
					onSubmit={handleRegister}
					ref={formRef}
					style={{
						width: 300,
						padding: 20,
					}}
				>
					<Stack spacing={2}>
						<Typography variant="h6">
							Register a new account
						</Typography>
						<TextField
							label="Username"
							name="username"
							error={formErrors.username.length > 0}
							helperText={formErrors.username}
						/>
						<TextField
							label="Email"
							name="email"
							error={formErrors.email.length > 0}
							helperText={formErrors.email}
						/>
						<TextField
							label="First name"
							name="firstName"
							error={formErrors.firstName.length > 0}
							helperText={formErrors.firstName}
						/>
						<TextField
							label="Last name"
							name="lastName"
							error={formErrors.lastName.length > 0}
							helperText={formErrors.lastName}
						/>
						<MuiFileInput
							value={file}
							onChange={handlePicChange}
							placeholder="Upload a profile picture"
							name="profilePicture"
							error={formErrors.profilePicture.length > 0}
							helperText={formErrors.profilePicture}
						/>
						<TextField
							label="Password"
							name="password"
							type="password"
							error={formErrors.password.length > 0}
							helperText={formErrors.password}
						/>
						<TextField
							label="Confirm password"
							name="password2"
							type="password"
							error={formErrors.password2.length > 0}
							helperText={formErrors.password2}
						/>
						<Button type="submit" variant="contained" size="large">
							Register
						</Button>
						<Button
							onClick={(e: React.FormEvent) => {
								e.preventDefault();
								navigate("/");
							}}
							variant="outlined"
							size="large"
							color="error"
						>
							Cancel
						</Button>
					</Stack>
				</Box>
			</Paper>
		</Backdrop>
	);
};

export default Register;
