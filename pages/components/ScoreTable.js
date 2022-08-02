import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import ScoreTableRow from "./ScoreTableRow";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ButtonBase from "@mui/material/ButtonBase";

import { useEffect, useState } from "react";
import * as calculateScores from "../../utils/calculateScores";

const ScoreTable = (props) => {
	const handleClick = (e, name, playerName) => {
		e.preventDefault();

		// TODO: This is ugly and not good state management. Fix when you have time
		props.setScoreCard((prevState) => {
			const newState = prevState.map((player) => {
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
			return newState;
		});

		if (
			props.scoreCard
				.find((player) => player.playerName === playerName)
				.scores.find((score) => score.name === name && !score.isFilled)
		) {
			props.resetDice();
			props.setThrowsLeft(2);
			props.setRounds((prevState) => prevState - 1);
			if (props.playerTurn === props.players.length - 1) {
				props.setPlayerTurn(0);
			} else {
				props.setPlayerTurn((prevState) => prevState + 1);
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
