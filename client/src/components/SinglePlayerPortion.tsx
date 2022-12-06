import { Button, DialogContent, DialogContentText } from "@mui/material";
import { useSetPlaymode } from "../context/playmodeContext";
import { useSetMatch } from "src/context/matchContext";
import { useSetScores } from "../context/scoresContext";
import { useUser } from "../context/userContext";
import { Match } from "@backend/types";
import { ScoresClass } from "../classes/Scores";
import { NavigateFunction, useNavigate } from "react-router-dom";

import {
	updateMatchToDB,
	deleteMatchFromDB,
} from "../controllers/matchesController";
import { saveMatchToDB } from "src/controllers/matchesController";
import {
	deleteScoreFromDB,
	getFilteredScoresFromDB,
	saveScoresArrayToDB,
} from "src/controllers/scoresController";
import { MatchClass } from "src/classes/Match";

interface SinglePlayerPortionProps {
	setRoomSelectionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	openSingleMatch: Match | undefined;
}

const SinglePlayerPortion = ({
	setRoomSelectionDialogOpen,
	openSingleMatch,
}: SinglePlayerPortionProps) => {
	const setScores = useSetScores();
	const user = useUser();
	const setPlaymode = useSetPlaymode();
	const setMatch = useSetMatch();

	const navigate: NavigateFunction = useNavigate();

	const handleClickReturnSingleGame = async () => {
		if (!user) return;
		if (!openSingleMatch) return;
		// Make an array of the scoreIds
		const scoreIds = openSingleMatch.scores.map((score) => score.scoreId);
		// Make a query string from the array of scoreIds
		// Model: colors[]=blue&colors[]=green
		const queryString = scoreIds
			.map((scoreId) => `scoreIds[]=${scoreId}`)
			.join("&");
		const scoresResponse = await getFilteredScoresFromDB(queryString);
		if (scoresResponse) {
			setMatch({ type: "updateMatch", newMatch: openSingleMatch });
			setScores({
				type: "updateMulti",
				newScores: scoresResponse,
			});
			setPlaymode("single");
			setRoomSelectionDialogOpen(false);
		}
	};

	const handleClickQuitSingleGameAndStartNew = async () => {
		// Mark the match as finished and start a new one
		if (!user) {
			setPlaymode("");
			navigate("/");
			return;
		}
		if (!openSingleMatch) return;
		const deletedMatch = await deleteMatchFromDB(openSingleMatch._id);
		const deletedScore = await deleteScoreFromDB(
			openSingleMatch.scores[0].scoreId
		);
		if (deletedMatch && deletedScore) {
			handleClickSingle();
		}
	};

	const handleClickSingle = async () => {
		if (!user) {
			setPlaymode("");
			navigate("/");
			return;
		}
		const newScore = new ScoresClass({
			_id: user._id,
			username: user.username,
		});
		setRoomSelectionDialogOpen(false);
		setPlaymode("single");

		const newMatchInitializer = {
			isActive: true,
			scores: [{ userId: user._id, scoreId: newScore._id }],
		};
		const newMatch: Match = new MatchClass(newMatchInitializer);
		setMatch({ type: "updateMatch", newMatch: newMatch });
		setScores({
			type: "created",
			newScores: [newScore],
		});
		const matchesResponse = await saveMatchToDB(newMatch);
		const scoresResponse = await saveScoresArrayToDB([newScore]);
	};

	return openSingleMatch ? (
		<>
			<DialogContentText>
				You have an uncompleted single player game open...
			</DialogContentText>

			<Button
				sx={{ marginY: 1 }}
				fullWidth
				onClick={handleClickReturnSingleGame}
				variant="contained"
				color="primary"
			>
				Return to the game
			</Button>

			<Button
				sx={{ marginY: 1 }}
				fullWidth
				onClick={handleClickQuitSingleGameAndStartNew}
				variant="contained"
				color="secondary"
			>
				Quit and start new game
			</Button>
		</>
	) : (
		<>
			<DialogContentText>Play as single player...</DialogContentText>

			<Button
				sx={{ marginY: 2 }}
				fullWidth
				onClick={handleClickSingle}
				variant="contained"
				color="secondary"
			>
				Single Player
			</Button>
		</>
	);
};

export default SinglePlayerPortion;
