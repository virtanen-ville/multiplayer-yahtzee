import { Icon } from "@iconify/react";

const Die = (props) => {
	return (
		<Icon
			onClick={props.onClick}
			inline
			width="100"
			color={`${props.locked ? "#757de8" : "#002984"}`}
			icon={`mdi:dice-${props.value}`}
		/>
	);
};

export default Die;
