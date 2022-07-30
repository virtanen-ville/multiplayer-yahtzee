import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";

const ScoreTable = (props) => {
	const handleClick = (e, name) => {
		console.log(e.target);
		console.log(name);
	};

	return (
		<TableContainer component={Paper}>
			<Table
				aria-label="Upper-section-Yahtzee-score-table"
				//sx={{ minWidth: 650 }}
			>
				<TableHead>
					<TableRow>
						<TableCell>Upper Section</TableCell>
						{props.players.map((player) => {
							return <TableCell>{player}</TableCell>;
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow
						hover
						onClick={(event) => handleClick(event, "ones")}
						key="ones"
					>
						<TableCell>Ones</TableCell>
						{props.players.map((player) => {
							<TableCell>0</TableCell>;
						})}
					</TableRow>
					<TableRow
						hover
						onClick={(event) => handleClick(event, "ones")}
						key="twos"
					>
						<TableCell>Twos</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow
						hover
						onClick={(event) => handleClick(event, "ones")}
						key="threes"
					>
						<TableCell>Threes</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow
						hover
						onClick={(event) => handleClick(event, "ones")}
						key="fours"
					>
						<TableCell>Fours</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow
						hover
						onClick={(event) => handleClick(event, "ones")}
						key="fives"
					>
						<TableCell>Fives</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow
						hover
						onClick={(event) => handleClick(event, "ones")}
						key="sixes"
					>
						<TableCell>Sixes</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow key="bonus">
						<TableCell>Bonus</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<Table
				lined
				headerLined
				shadow={false}
				aria-label="Lower-section-Yahtzee-score-table"
				sx={{
					height: "auto",
					//minWidth: "100%",
				}}
			>
				<TableHead>
					<TableRow>
						<TableCell>Lower Section</TableCell>
						<TableCell>Player Score</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow key="1">
						<TableCell>1 Pair</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow key="2">
						<TableCell>2 Pairs</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow key="3">
						<TableCell>Three of Kind</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow key="4">
						<TableCell>Four of Kind</TableCell>
						<TableCell>0</TableCell>
					</TableRow>

					<TableRow key="6">
						<TableCell>Small Straight</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow key="7">
						<TableCell>Large Straight</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow key="8">
						<TableCell>Full House</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow key="9">
						<TableCell>Chance</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
					<TableRow key="10">
						<TableCell>Yatzy</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ScoreTable;
