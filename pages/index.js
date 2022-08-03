import GameScreen from "./components/GameScreen";
import * as React from "react";
import Container from "@mui/material/Container";
import { Button, Box } from "@mui/material";
import PlayerDialog from "./components/PlayerDialog";
import { useState } from "react";

export default function Home() {
	const [players, setPlayers] = React.useState([]);
	const [dialogOpen, setDialogOpen] = useState(true);
	return (
		<div>
			<main>
				<Container maxWidth="md">
					<Box sx={{ my: 4, textAlign: "center" }}>
						<GameScreen players={players} />
						<PlayerDialog
							players={players}
							setPlayers={setPlayers}
							dialogOpen={dialogOpen}
							setDialogOpen={setDialogOpen}
						/>
						<Button
							onClick={() => setDialogOpen(true)}
							variant="outlined"
							color="primary"
							sx={{ margin: "1rem" }}
						>
							New game
						</Button>
					</Box>
				</Container>
			</main>
		</div>
	);
}
