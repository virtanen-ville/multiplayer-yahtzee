import React, {
	createContext,
	useContext,
	useState,
	Dispatch,
	SetStateAction,
} from "react";
import { Socket } from "socket.io-client";
import {
	ServerToClientEvents,
	ClientToServerEvents,
	Props,
} from "@backend/types";

// let newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
// 	auth: {
// 		token: localStorage.getItem("token"),
// 	},
// });

let newSocket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

const SocketContext = createContext<Socket<
	ServerToClientEvents,
	ClientToServerEvents
> | null>(newSocket);

const SocketDispatchContext = createContext<
	Dispatch<
		SetStateAction<Socket<
			ServerToClientEvents,
			ClientToServerEvents
		> | null>
	>
>(() => {});

export const SocketProvider: React.FC<Props> = ({ children }) => {
	const [socket, setSocket] = useState<Socket<
		ServerToClientEvents,
		ClientToServerEvents
	> | null>(newSocket);

	return (
		<SocketContext.Provider value={socket}>
			<SocketDispatchContext.Provider value={setSocket}>
				{children}
			</SocketDispatchContext.Provider>
		</SocketContext.Provider>
	);
};

export function useSocket() {
	return useContext(SocketContext);
}

export function useSetSocket() {
	return useContext(SocketDispatchContext);
}
