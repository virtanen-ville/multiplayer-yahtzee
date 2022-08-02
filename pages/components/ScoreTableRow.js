import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ButtonBase from "@mui/material/ButtonBase";

const ScoreTableRow = (props) => {
	return (
		<TableRow hover>
			<TableCell>{props.rowNameLarge}</TableCell>
			{props.scoreCard.map((player, index) => {
				return (
					<TableCell
						sx={{
							color: `${
								props.scoreCard[index].scores.find(
									(scoreName) =>
										scoreName.name === props.rowNameSmall
								).isFilled
									? "red"
									: "black"
							}`,
						}}
						key={index}
					>
						<ButtonBase
							onClick={(event) =>
								props.handleClick(
									event,
									props.rowNameSmall,
									player.playerName
								)
							}
						>
							{
								player.scores.find(
									({ name }) => name === props.rowNameSmall
								).score
							}
						</ButtonBase>
					</TableCell>
				);
			})}
		</TableRow>
	);
};

export default ScoreTableRow;
