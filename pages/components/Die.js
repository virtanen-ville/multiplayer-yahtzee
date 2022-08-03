import { Icon } from "@iconify/react";

const Die = (props) => {
	return (
		<Icon
			onClick={props.onClick}
			inline
			width="100"
			color={`${props.locked ? "#ff6f60" : "#ab000d"}`}
			icon={`mdi:dice-${props.value}`}
		/>
	);
};

export default Die;
