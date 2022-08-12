/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const Die = ({ value, locked, rotateDice }) => {
	let rolling = rotateDice && !locked;
	const [rollingValue, setRollingValue] = useState(
		Math.floor(Math.random() * 6) + 1
	);

	useEffect(() => {
		if (rolling) {
			var count = 0;
			const interval = setInterval(() => {
				setRollingValue(Math.floor(Math.random() * 6) + 1);
				if (count >= 6) clearInterval(interval);
				count++;
			}, 500);
		}
	}, [rotateDice, locked]);

	return (
		<Icon
			className={rolling ? "rotate" : null}
			inline
			width="100"
			color={`${locked ? "#ff6f60" : "#ab000d"}`}
			icon={`mdi:dice-${rolling ? rollingValue : value}`}
		/>
	);
};

export default Die;
