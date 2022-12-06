import { memo, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	useTheme,
} from "@mui/material";
import ScoreTableRow from "./ScoreTableRow";
import { Points, ThrowsLeft } from "@backend/types";
import { useSocket } from "../context/socketContext";
import { usePlaymode } from "../context/playmodeContext";
import { useScores, useSetScores } from "../context/scoresContext";
import calculate from "../utils/calculatePoints";
import { useSetMatch, useMatch } from "../context/matchContext";
import { initialDice } from "../utils/initialStates";
import { PointsClass } from "src/classes/Points";
import { updateSingleScoreToDB } from "src/controllers/scoresController";
import { updateMatchToDB } from "src/controllers/matchesController";
import { useUser } from "src/context/userContext";

const ScoreTable = ({ setGameoverDialogOpen, isTurnOfPlayer }: any) => {
	const theme = useTheme();
	const scores = useScores();
	const setScores = useSetScores();
	const match = useMatch();
	const setMatch = useSetMatch();
	const socket = useSocket();
	const playmode = usePlaymode();
	const user = useUser();

	// Check if it is the last round
	const lastTurn =
		match.round === 15 &&
		match.turn === scores.length - 1 &&
		scores.length > 0;

	// Handle click on score table row.
	const handleClickOnScore = async (pointName: string) => {
		const scoreId =
			scores.length === 1
				? scores[0]._id
				: scores.find((score) => score.userId === user?._id)?._id;

		// Check to see that the first throw is made
		if (match.throwsLeft >= 3) return;

		// Check to see that the score is not already set
		if (
			scores.find((score) => score._id === scoreId)?.points[
				pointName as keyof Points
			] !== null
		)
			return;

		const oldScore = scores.find((score) => score._id === scoreId);
		if (!oldScore) return;

		const newPoint = calculate[pointName as keyof typeof calculate](
			match.dice
		);

		const updatedScore = {
			...oldScore,
			points: new PointsClass({
				...oldScore.points,
				[pointName]: newPoint,
			}),
		};
		let newMatch;
		if (lastTurn) {
			newMatch = {
				...match,
				round: match.round + 1,
				throwsLeft: 0 as ThrowsLeft,
				endTime: new Date(),
				isActive: false,
			};
		} else {
			newMatch = {
				...match,
				round:
					match.turn === scores.length - 1
						? match.round + 1
						: match.round,
				turn: match.turn === scores.length - 1 ? 0 : match.turn + 1,
				throwsLeft: 3 as ThrowsLeft,
				dice: initialDice,
			};
		}

		if (playmode === "guest") {
			setScores({
				type: "created",
				newScores: [updatedScore],
			});
			setMatch({ type: "updateMatch", newMatch: newMatch });

			if (lastTurn) {
				setGameoverDialogOpen(true);
			}
		} else if (playmode === "single") {
			setScores({
				type: "created",
				newScores: [updatedScore],
			});
			setMatch({ type: "updateMatch", newMatch: newMatch });
			const matchResponse = await updateMatchToDB(newMatch);
			const scoreResponse = await updateSingleScoreToDB(updatedScore);
			if (lastTurn) {
				setGameoverDialogOpen(true);
			}
		} else if (playmode === "multi") {
			if (!socket) return;
			if (!isTurnOfPlayer(user?.username)) return;

			socket.emit("newScore", updatedScore, match._id);
			if (lastTurn) {
				socket.emit("gameOverDialogOpen", true, match._id);
			}
			// Make sure that the turn is changed last
			socket.emit("newMatch", newMatch);
		}
	};

	useEffect(() => {
		if (!socket) return;

		socket.on("newScore", (newScore) => {
			setScores({
				type: "updateOne",
				newScore: {
					...newScore,
					points: new PointsClass({
						...newScore.points,
					}),
				},
			});
		});
		socket.on("gameOverDialogOpen", (gameOverDialogOpen) => {
			setGameoverDialogOpen(gameOverDialogOpen);
		});
		return () => {
			socket.off("newScore");
			socket.off("gameOverDialogOpen");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return (
		<TableContainer component={Paper}>
			<Table size="small" aria-label="Yahtzee-score-table">
				<TableHead>
					<TableRow sx={{ backgroundColor: "secondary.light" }}>
						<TableCell>Upper Section</TableCell>
						{scores.map((score, index) => {
							return (
								<TableCell align="right" key={index}>
									{score.username}
								</TableCell>
							);
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					<ScoreTableRow
						rowNameLarge={"Ones"}
						rowNameSmall={"ones"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"Twos"}
						rowNameSmall={"twos"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"Threes"}
						rowNameSmall={"threes"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"Fours"}
						rowNameSmall={"fours"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"Fives"}
						rowNameSmall={"fives"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"Sixes"}
						rowNameSmall={"sixes"}
						handleClick={handleClickOnScore}
					/>

					<TableRow
						sx={{
							backgroundColor:
								theme.palette.mode === "light"
									? "primary.light"
									: "primary.main",
						}}
					>
						<TableCell>Bonus</TableCell>
						{scores.map((score, index) => {
							return (
								<TableCell align="right" key={index}>
									{score.points.bonus}
								</TableCell>
							);
						})}
					</TableRow>
				</TableBody>
				<TableHead>
					<TableRow sx={{ backgroundColor: "secondary.light" }}>
						<TableCell>Lower Section</TableCell>
						{scores.map((score, index) => {
							return (
								<TableCell align="right" key={index}>
									{score.username}
								</TableCell>
							);
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					<ScoreTableRow
						rowNameLarge={"1 Pair"}
						rowNameSmall={"onePair"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"2 Pairs"}
						rowNameSmall={"twoPairs"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"3 of a Kind"}
						rowNameSmall={"threeOfAKind"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"4 of a Kind"}
						rowNameSmall={"fourOfAKind"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"Small Straight"}
						rowNameSmall={"smallStraight"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"Large Straight"}
						rowNameSmall={"largeStraight"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"Full House"}
						rowNameSmall={"fullHouse"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"Chance"}
						rowNameSmall={"chance"}
						handleClick={handleClickOnScore}
					/>
					<ScoreTableRow
						rowNameLarge={"Yahtzee"}
						rowNameSmall={"yahtzee"}
						handleClick={handleClickOnScore}
					/>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default memo(ScoreTable);
