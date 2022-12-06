import React, {
	createContext,
	useContext,
	useState,
	Dispatch,
	SetStateAction,
} from "react";
import { Playmode, Props } from "@backend/types";

const PlaymodeContext = createContext<Playmode>("");
const PlaymodeDispatchContext = createContext<
	Dispatch<SetStateAction<Playmode>>
>(() => {});

export const PlaymodeProvider: React.FC<Props> = ({ children }) => {
	const [playmode, setPlaymode] = useState<Playmode>("");

	return (
		<PlaymodeContext.Provider value={playmode}>
			<PlaymodeDispatchContext.Provider value={setPlaymode}>
				{children}
			</PlaymodeDispatchContext.Provider>
		</PlaymodeContext.Provider>
	);
};

export function usePlaymode() {
	return useContext(PlaymodeContext);
}

export function useSetPlaymode() {
	return useContext(PlaymodeDispatchContext);
}
