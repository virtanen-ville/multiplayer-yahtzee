import Head from "next/head";
import Dice from "./components/Dice";
import ThrowButton from "./components/ThrowButton";
import ScoreTable from "./components/ScoreTable";
import GameScreen from "./components/GameScreen";
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../src/Link";

export default function Home() {
	return (
		<div>
			<main>
				<Container maxWidth="md">
					<Box sx={{ my: 4 }}>
						<GameScreen />
					</Box>
				</Container>
			</main>
		</div>
	);
}
