import GameScreen from "../components/GameScreen";
import Container from "@mui/material/Container";
import NavigationBar from "../components/NavigationBar";
import { Box, useTheme } from "@mui/material";
import RoomSelectionDialog from "../components/RoomSelectionDialog";
// import { MatchProvider } from "../context/matchContext";
// import { ScoresProvider } from "../context/scoresContext";
import { useLocation } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useSocket } from "../context/socketContext";
import { useState } from "react";
import GameoverDialog from "src/components/GameoverDialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import NavigationDrawer from "src/components/NavigationDrawer";
import { usePlaymode } from "src/context/playmodeContext";

const Play = () => {
	const { state } = useLocation();
	const guestName = state ? state.guestName : undefined;
	const user = useUser();
	const socket = useSocket();
	const theme = useTheme();
	const [gameoverDialogOpen, setGameoverDialogOpen] = useState(false);
	const breakPointUpMedium = useMediaQuery(theme.breakpoints.up("md"));
	const playmode = usePlaymode();

	return (
		<>
			{/* <MatchProvider>
		 	<ScoresProvider> */}
			{breakPointUpMedium ? <NavigationBar /> : <NavigationDrawer />}
			<Box
				sx={{
					display: "flex",
					flexGrow: 1,
					width: "100vw",
					height: "100%",
					minHeight: "100vh",
					backgroundImage:
						theme.palette.mode === "light"
							? "linear-gradient(white, red)"
							: "linear-gradient(black, red)",
				}}
			>
				<Container maxWidth="md">
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<GameScreen
							setGameoverDialogOpen={setGameoverDialogOpen}
							guestName={guestName}
						/>
						<GameoverDialog
							gameoverDialogOpen={gameoverDialogOpen}
							setGameoverDialogOpen={setGameoverDialogOpen}
						/>
						{user && socket && playmode === "" ? (
							<RoomSelectionDialog />
						) : null}
					</Box>
				</Container>
			</Box>
			{/* </ScoresProvider>
		</MatchProvider> */}
		</>
	);
};

export default Play;
