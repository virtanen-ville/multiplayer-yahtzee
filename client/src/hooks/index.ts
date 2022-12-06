import React from "react";
//import isEqual from "lodash/isEqual";

// This hook can be found from the React documentation, but doesn't work with input fields https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state

export const usePreviousNonPersistent: any = (value: any) => {
	const ref = React.useRef();
	React.useEffect(() => {
		ref.current = value; //assign the value of ref to the argument
	}, [value]); //this code will run when the value of 'value' changes
	return ref.current; //in the end, return the current ref value.
};

// This updated hook can be found here https://www.developerway.com/posts/implementing-advanced-use-previous-hook

export const usePrevious: any = (newValue: any) => {
	// initialise the ref with previous and current values
	const ref = React.useRef({
		value: newValue,
		prev: null,
	});

	// if the value passed into hook doesn't match what we store as "current" move the "current" to the "previous" and store the passed value as "current"
	if (newValue !== ref.current.value) {
		ref.current = {
			value: newValue,
			prev: ref.current.value,
		};
	}

	// return the previous value only
	return ref.current.prev;
};

// This works with initial values
export const usePreviousInitial = (newValue: any, initial: any) => {
	const ref = React.useRef({ value: newValue, prev: initial });
	if (ref.current.value !== newValue) {
		ref.current.prev = ref.current.value;
		ref.current.value = newValue;
	}
	return ref.current.prev;
};

// This version is for use with objects and arrays (and will check deep equality). Needs lodash/isEqual
// export const usePreviousDeep: any = (newValue: any) => {
// 	const ref = React.useRef({
// 		value: newValue,
// 		prev: null,
// 	});

// 	if (!isEqual(newValue, ref.current.value)) {
// 		ref.current = {
// 			value: newValue,
// 			prev: ref.current.value,
// 		};
// 	}

// 	return ref.current.prev;
// };
