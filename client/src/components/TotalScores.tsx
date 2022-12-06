import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import { memo } from "react";
import { useScores } from "../context/scoresContext";

const TotalScores = () => {
	const scores = useScores();
	return (
		<TableContainer sx={{ marginTop: "1rem" }} component={Paper}>
			<Table aria-label="Yahtzee-total-score-table">
				<TableHead>
					<TableRow sx={{ backgroundColor: "secondary.main" }}>
						<TableCell sx={{ fontWeight: "bold" }}>
							TOTAL SCORES
						</TableCell>
						{scores.map((score, index) => {
							return (
								<TableCell
									align="right"
									sx={{ fontWeight: "bold" }}
									key={index}
								>
									{score.username}
								</TableCell>
							);
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
						{scores.map((score, index) => {
							return (
								<TableCell
									align="right"
									sx={{ fontWeight: "bold" }}
									key={index}
								>
									{score.points.total || 0}
								</TableCell>
							);
						})}
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default memo(TotalScores);
