import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import * as calculateScores from "../../utils/calculateScores";

const TotalScores = (props) => {
	return (
		<TableContainer sx={{ marginTop: "1rem" }} component={Paper}>
			<Table
				aria-label="Yahtzee-total-score-table"
				sx={{ minWidth: "100%" }}
			>
				<TableHead>
					<TableRow sx={{ backgroundColor: "#757de8" }}>
						<TableCell sx={{ fontWeight: "bold" }}>
							TOTAL SCORES
						</TableCell>
						{props.allScores.map((player, index) => {
							return (
								<TableCell
									sx={{ fontWeight: "bold" }}
									key={index}
								>
									{player.playerName}
								</TableCell>
							);
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
						{props.allScores.map((player, index) => {
							return (
								<TableCell
									sx={{ fontWeight: "bold" }}
									key={index}
								>
									{player.totalScore}
								</TableCell>
							);
						})}
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default TotalScores;
