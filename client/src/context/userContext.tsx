import React, {
	createContext,
	useContext,
	useState,
	Dispatch,
	SetStateAction,
} from "react";
import { User, Props } from "@backend/types";

const UserContext = createContext<User | null>(null);

const UserDispatchContext = createContext<
	Dispatch<SetStateAction<User | null>>
>(() => {});

export const UserProvider: React.FC<Props> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

	return (
		<UserContext.Provider value={user}>
			<UserDispatchContext.Provider value={setUser}>
				{children}
			</UserDispatchContext.Provider>
		</UserContext.Provider>
	);
};

export function useUser() {
	return useContext(UserContext);
}

export function useSetUser() {
	return useContext(UserDispatchContext);
}
