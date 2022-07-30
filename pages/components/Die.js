import { Typography, Button } from "@mui/material";

const Die = (props) => {
	return (
		<div
			//style={{ color: "red", display: "inline" }}
			onClick={props.onClick}
		>
			<Typography size="2em" span color="primary">
				{props.value}
			</Typography>
			<Typography
				size="2em"
				span
				margin="100"
				css={{ marginLeft: "10px", marginBottom: "20px" }}
			>
				{props.locked ? "Locked" : "Open"}
			</Typography>
		</div>
	);
};

export default Die;
