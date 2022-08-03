import { Typography, Button } from "@mui/material";

import React from "react";
const Throw = (props) => {
	return (
		<>
			<Button
				disabled={props.throwsLeft > 0 ? false : true}
				sx={{
					display: "block",
					marginY: "10px",
					marginX: "auto",
				}}
				variant="contained"
				size="large"
				onClick={props.throwDice}
			>
				Throw
			</Button>

			<Typography gutterBottom variant="h4">
				{props.throwsLeft} throws left
			</Typography>
		</>
	);
};

export default Throw;
