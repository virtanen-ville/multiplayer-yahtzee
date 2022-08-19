import { io } from "socket.io-client";

//const socket2 = io("http://127.0.0.1:8999");

const socket = io("/");

export default socket;
