import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { useSocket } from "../context/socketContext";
import { useScores, useSetScores } from "../context/scoresContext";
import { useSetMatch, useMatch } from "../context/matchContext";
import { usePlaymode, useSetPlaymode } from "../context/playmodeContext";
import { MatchClass } from "src/classes/Match";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { ScoresClass } from "src/classes/Scores";
import {
	saveMatchToDB,
	updateMatchToDB,
} from "src/controllers/matchesController";
import {
	saveScoresArrayToDB,
	updateSingleScoreToDB,
} from "src/controllers/scoresController";

const GameoverDialog = ({ gameoverDialogOpen, setGameoverDialogOpen }: any) => {
	const socket = useSocket();
	const setScores = useSetScores();
	const scores = useScores();
	const match = useMatch();
	const setMatch = useSetMatch();
	const playmode = usePlaymode();
	const navigate: NavigateFunction = useNavigate();
	const setPlaymode = useSetPlaymode();

	const startNewGame = async () => {
		// Make new scores from the old ones
		const newScores = scores.map(
			(score) =>
				new ScoresClass({
					username: score.username,
					_id: score.userId,
				})
		);

		const newMatchScores = newScores.map((score) => {
			return {
				scoreId: score._id,
				userId: score.userId,
			};
		});

		const newMatchInitializer = {
			startTime: new Date(),
			isActive: true,
			scores: newMatchScores,
		};
		const newMatch = new MatchClass(newMatchInitializer);

		if (playmode === "guest") {
			setMatch({ type: "updateMatch", newMatch: newMatch });
			setScores({
				type: "created",
				newScores: newScores,
			});
		} else if (playmode === "single") {
			setMatch({ type: "updateMatch", newMatch: newMatch });
			setScores({
				type: "created",
				newScores: newScores,
			});
			const savedScores = await saveScoresArrayToDB(newScores);
			const savedMatch = await saveMatchToDB(newMatch);
		} else if (playmode === "multi") {
			if (!socket) return;
			socket.emit("createNewMatchAndScores", newMatch, newScores);
		}
	};

	const saveGame = async () => {
		const endTime = new Date();

		const newMatch = {
			...match,
			isActive: false,
			endTime: endTime,
		};

		if (playmode === "guest") {
			return;
		} else if (playmode === "single") {
			const matchResponse = await updateMatchToDB(newMatch);
			const scoreResponse = await updateSingleScoreToDB(scores[0]);
		} else if (playmode === "multi") {
			if (!socket) return;
			socket.emit("newMatch", newMatch);
		}
	};

	const saveGameAndStartNewGame = async () => {
		await saveGame();
		await startNewGame();
		if (playmode !== "multi") {
			setGameoverDialogOpen(false);
		} else {
			if (!socket) return;
			socket.emit("gameOverDialogOpen", false, match._id);
		}
	};

	const saveGameAndGoHome = async () => {
		await saveGame();
		if (playmode !== "multi") {
			setGameoverDialogOpen(false);
			setPlaymode("");
			navigate("/");
		} else {
			if (!socket) return;
			socket.emit("gameOverDialogOpen", false, match._id);
			socket.emit("deleteRoom");
			socket.emit("goHome");
		}
	};

	return (
		<Dialog open={gameoverDialogOpen}>
			<DialogTitle>GAME OVER</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<strong>Scores</strong>
				</DialogContentText>
				{scores.map((score, idx) => {
					return (
						<DialogContentText key={idx}>
							{score.username}: {score.points.total}
						</DialogContentText>
					);
				})}
			</DialogContent>

			<DialogActions sx={{ marginX: 1 }}>
				<Button
					onClick={saveGameAndGoHome}
					variant="contained"
					color="secondary"
				>
					Go back Home
				</Button>
				<Button
					onClick={saveGameAndStartNewGame}
					variant="contained"
					color="primary"
				>
					Start new Game
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default GameoverDialog;
