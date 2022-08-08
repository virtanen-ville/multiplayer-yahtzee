import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const Die = (props) => {
	//let rolling = props.rotateDice && !props.locked;
	const [rollingValue, setRollingValue] = useState(1);
	useEffect(() => {
		if (props.rotateDice && !props.locked) {
			var count = 0;
			const interval = setInterval(() => {
				setRollingValue(Math.floor(Math.random() * 6) + 1);
				console.log("setting value to:", rollingValue);
				if (count >= 6) clearInterval(interval);
				count++;
			}, 500);
		}
	}, [props.rotateDice, !props.locked]);
	return (
		<Icon
			className={props.rotateDice && !props.locked ? "rotate" : null}
			onClick={props.onClick}
			inline
			width="100"
			color={`${props.locked ? "#ff6f60" : "#ab000d"}`}
			icon={`mdi:dice-${
				props.rotateDice && !props.locked ? rollingValue : props.value
			}`}
		/>
	);
};

export default Die;
