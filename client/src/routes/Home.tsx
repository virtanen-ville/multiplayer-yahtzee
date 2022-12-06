import { useState } from "react";
import {
	Box,
	Button,
	CircularProgress,
	Container,
	Stack,
	TextField,
} from "@mui/material";
import { useNavigate, NavigateFunction } from "react-router-dom";
import BackgroundImage from "../assets/yahtzee.png";
import Typography from "@mui/material/Typography";
import { useUser, useSetUser } from "../context/userContext";
import { useTheme } from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import { usePlaymode, useSetPlaymode } from "src/context/playmodeContext";

const Home = ({ loading }: any) => {
	const navigate: NavigateFunction = useNavigate();
	const [guestName, setGuestName] = useState("");
	const user = useUser();
	const setUser = useSetUser();
	const theme = useTheme();
	const playmode = usePlaymode();
	const setPlaymode = useSetPlaymode();

	return (
		<>
			<NavigationBar />

			<Box
				sx={{
					display: "flex",
					width: "100vw",
					height: "100vh",
					backgroundImage:
						theme.palette.mode === "light"
							? "linear-gradient(white, red)"
							: "linear-gradient(black, red)",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Container
					maxWidth="md"
					sx={{
						padding: "5rem",
						height: "100%",
					}}
				>
					<Box
						sx={{
							backgroundImage: `url(${BackgroundImage})`,
							backgroundRepeat: "no-repeat",
							backgroundSize: "100%",
							width: "100%",
							height: "100%",
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: "100%",
							}}
						>
							{loading ? (
								<CircularProgress />
							) : (
								<Stack spacing={2}>
									{user ? (
										<>
											<Typography
												sx={{
													textShadow:
														"2px 2px  black",
												}}
												variant="h4"
												color="white"
											>
												You are logged in as{" "}
												<strong>{user.username}</strong>
											</Typography>
											<Button
												color="primary"
												variant="contained"
												onClick={() => {
													navigate("/play");
												}}
											>
												Play Yahtzee
											</Button>
											<Button
												color="secondary"
												variant="contained"
												onClick={
													// clear local storage and navigate to home
													() => {
														localStorage.clear();
														setUser(null);
													}
												}
											>
												Log Out
											</Button>
										</>
									) : (
										<>
											<Button
												variant="contained"
												onClick={() =>
													navigate("/login")
												}
											>
												Log In
											</Button>
											<Button
												variant="contained"
												onClick={() =>
													navigate("/register")
												}
											>
												Register
											</Button>
											<Button
												sx={{}}
												color="secondary"
												variant="contained"
												onClick={() => {
													setPlaymode("guest");
												}}
											>
												Play as Guest
											</Button>
										</>
									)}

									{playmode === "guest" && (
										<>
											<TextField
												autoFocus
												margin="dense"
												id="playerName"
												label="Guest Name"
												type="text"
												fullWidth
												variant="outlined"
												value={guestName}
												onChange={(e) =>
													setGuestName(e.target.value)
												}
											/>
											<Button
												sx={{}}
												color="primary"
												variant="contained"
												disabled={guestName.length <= 0}
												onClick={() => {
													localStorage.removeItem(
														"token"
													);

													setUser(null);
													navigate("/play", {
														state: { guestName },
													});
												}}
											>
												Start Game as Guest
											</Button>
										</>
									)}
								</Stack>
							)}
						</Box>
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default Home;
