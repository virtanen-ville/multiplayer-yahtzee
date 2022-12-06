import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material";

const DieComponent = ({ value, locked, rotateDice }: any) => {
	const [rollingValue, setRollingValue] = useState(1);
	const rolling = rotateDice && !locked;
	const theme = useTheme();
	const breakPointUpMedium = useMediaQuery(theme.breakpoints.up("md"));

	useEffect(() => {
		if (rolling) {
			var count = 0;
			const interval = setInterval(() => {
				setRollingValue(Math.floor(Math.random() * 6) + 1);
				if (count >= 6) clearInterval(interval);
				count++;
			}, 500);
		}
	}, [rolling]);

	return (
		<Icon
			className={rolling ? "rotate" : undefined}
			inline
			width={breakPointUpMedium ? "100" : "65"}
			color={locked ? "#ff6f60" : "#ab000d"}
			icon={`mdi:dice-${rolling ? rollingValue : value}`}
		/>
	);
};

export default DieComponent;
