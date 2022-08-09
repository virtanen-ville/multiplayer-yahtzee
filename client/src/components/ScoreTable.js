import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";

import ScoreTableRow from "./ScoreTableRow";

import * as calculateScores from "../utils/calculateScores";

import socket from "../utils/socket";

const ScoreTable = (props) => {
	const handleClick = (e, name, playerName) => {
		e.preventDefault();

		// TODO: This is ugly and not good state management. Fix when you have time
		//let newScoreCard = [...props.scoreCard];
		//props.setScoreCard((prevState) => {
		const newState = props.scoreCard.map((player) => {
			if (player.playerName === playerName) {
				return {
					...player,
					scores: player.scores.map((score) => {
						if (score.name === name && !score.isFilled) {
							return {
								...score,
								isFilled: true,
								score: calculateScores[name](props.dice),
							};
						}
						return score;
					}),
				};
			}
			return player;
		});
		//return newState;
		//});

		if (
			props.scoreCard
				.find((player) => player.playerName === playerName)
				.scores.find((score) => score.name === name && !score.isFilled)
		) {
			props.resetDice();
			//props.setThrowsLeft(2);
			socket.emit("throwsLeft", 2);

			//props.setRounds((prevState) => prevState - 1);
			socket.emit("newRounds", props.rounds - 1);

			socket.emit("newScoreCard", newState);

			// Be sure to set the turn last so that the server can know that the player has finished
			if (props.playerTurn === props.players.length - 1) {
				//props.setPlayerTurn(0);
				socket.emit("newTurn", 0);
			} else {
				//props.setPlayerTurn((prevState) => prevState + 1);
				socket.emit("newTurn", props.playerTurn + 1);
			}
		}
	};

	return (
		<TableContainer component={Paper}>
			<Table
				size="small"
				aria-label="Yahtzee-score-table"
				sx={{ minWidth: "100%" }}
			>
				<TableHead>
					<TableRow sx={{ backgroundColor: "#757de8" }}>
						<TableCell>Upper Section</TableCell>
						{props.scoreCard.map((player, index) => {
							return (
								<TableCell key={index}>
									{player.playerName}
								</TableCell>
							);
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					<ScoreTableRow
						rowNameLarge={"Ones"}
						rowNameSmall={"ones"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"Twos"}
						rowNameSmall={"twos"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"Threes"}
						rowNameSmall={"threes"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"Fours"}
						rowNameSmall={"fours"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"Fives"}
						rowNameSmall={"fives"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"Sixes"}
						rowNameSmall={"sixes"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>

					<TableRow>
						<TableCell
							sx={{
								backgroundColor: "lightgray",
							}}
						>
							Bonus
						</TableCell>
						{props.bonusScores.map((player, index) => {
							return (
								<TableCell
									sx={{
										backgroundColor: "lightgray",
									}}
									key={index}
								>
									{player.bonusScore}
								</TableCell>
							);
						})}
					</TableRow>
				</TableBody>
				<TableHead>
					<TableRow sx={{ backgroundColor: "#757de8" }}>
						<TableCell>Lower Section</TableCell>
						{props.scoreCard.map((player, index) => {
							return (
								<TableCell key={index}>
									{player.playerName}
								</TableCell>
							);
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					<ScoreTableRow
						rowNameLarge={"1 Pair"}
						rowNameSmall={"onePair"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"2 Pairs"}
						rowNameSmall={"twoPairs"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"3 of a Kind"}
						rowNameSmall={"threeOfAKind"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"4 of a Kind"}
						rowNameSmall={"fourOfAKind"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"Small Straight"}
						rowNameSmall={"smallStraight"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"Large Straight"}
						rowNameSmall={"largeStraight"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"Full House"}
						rowNameSmall={"fullHouse"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"Chance"}
						rowNameSmall={"chance"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
					<ScoreTableRow
						rowNameLarge={"Yahtzee"}
						rowNameSmall={"yahtzee"}
						scoreCard={props.scoreCard}
						handleClick={handleClick}
					/>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ScoreTable;
