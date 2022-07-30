import Die from "./Die";
const ThrowButton = (props) => {
	return (
		<>
			<button onClick={props.onClick}>Throw</button>
		</>
	);
};

export default ThrowButton;
