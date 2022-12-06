import { TableRow, TableCell } from "@mui/material";
import { useScores } from "../context/scoresContext";
import { Points } from "@backend/types";
import { memo } from "react";

const ScoreTableRow = ({ rowNameLarge, rowNameSmall, handleClick }: any) => {
	const scores = useScores();

	return (
		<TableRow
			hover
			onClick={() => handleClick(rowNameSmall)}
			sx={{ cursor: "pointer" }}
		>
			<TableCell>{rowNameLarge}</TableCell>

			{scores.map((score, index) => {
				return (
					<TableCell
						align="right"
						sx={{
							color: `${
								score.points[rowNameSmall as keyof Points] !==
								null
									? "red"
									: "primary"
							}`,
						}}
						key={index}
					>
						{score.points[rowNameSmall as keyof Points] || 0}
					</TableCell>
				);
			})}
		</TableRow>
	);
};

export default memo(ScoreTableRow);
