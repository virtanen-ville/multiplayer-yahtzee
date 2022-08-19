import path from "path";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

let roomTurns = {};

dotenv.config();

const app = express();
app.use(cors());

app.use(express.static(path.resolve(__dirname, "build")));

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
});
const getUsernamesFromSockets = async () => {
	let usernames = [];
	const sockets = await io.fetchSockets();
	for (let socket of sockets) {
		if (socket.data.username) {
			usernames.push(socket.data.username);
		}
	}
	return usernames;
};

const getActiveRooms = () => {
	const roomsArray = Array.from(io.sockets.adapter.rooms);

	const filtered = roomsArray.filter((room) => !room[1].has(room[0]));

	const roomNames = filtered.map((i) => i[0]);
	return roomNames;
};

const getUsersInRoom = (room) => {
	let users = [];
	const userSet = io.sockets.adapter.rooms.get(room);
	if (userSet) {
		users = Array.from(userSet?.values());
	}
	let usernames = [];
	for (let user of users) {
		let socket = io.sockets.sockets.get(user);
		if (socket.data?.username) {
			usernames.push(socket.data.username);
		}
	}
	return usernames;
};

io.on("connection", (socket) => {
	console.log("socket ID: ", socket.id);

	socket.on("disconnecting", (reason) => {
		for (const room of socket.rooms) {
			if (room !== socket.id) {
				socket.to(room).emit("user has left", socket.id);
			}
		}
	});

	socket.on("joinRoom", (room) => {
		socket.join(room);
		roomTurns[room] = 0;
		socket.emit("roomJoined", room);
		io.emit("roomList", getActiveRooms());
	});

	socket.on("getRooms", () => {
		socket.emit("roomList", getActiveRooms());
	});

	socket.on("playerSet", (newPlayer) => {
		socket.data.username = newPlayer;
		let room = Array.from(socket.rooms)[1];
		console.log(`users in room ${room}: `, getUsersInRoom(room));
		io.to(room).emit("playersArray", getUsersInRoom(room));
	});

	socket.on("sendMessage", (message) => {
		let room = Array.from(socket.rooms)[1];
		io.to(room).emit("message", message, socket.data.username);
	});

	socket.on("newScoreCard", (newScoreCard) => {
		let room = Array.from(socket.rooms)[1];
		const players = getUsersInRoom(room);
		if (players[roomTurns[room]] === socket.data.username) {
			io.to(room).emit("newScoreCard", newScoreCard);
		}
	});

	socket.on("newDice", (newDice) => {
		let room = Array.from(socket.rooms)[1];
		const players = getUsersInRoom(room);
		if (players[roomTurns[room]] === socket.data.username) {
			io.to(room).emit("newDice", newDice);
		}
	});

	socket.on("newRounds", (newRounds) => {
		let room = Array.from(socket.rooms)[1];
		const players = getUsersInRoom(room);
		if (players[roomTurns[room]] === socket.data.username) {
			io.to(room).emit("newRounds", newRounds);
		}
	});

	socket.on("newTurn", (newTurn) => {
		let room = Array.from(socket.rooms)[1];
		const players = getUsersInRoom(room);
		if (players[roomTurns[room]] === socket.data.username) {
			roomTurns[room] = newTurn;
			io.to(room).emit("newTurn", newTurn);
		}
	});

	socket.on("throwsLeft", (throwsLeft) => {
		let room = Array.from(socket.rooms)[1];
		const players = getUsersInRoom(room);
		if (players[roomTurns[room]] === socket.data.username) {
			io.to(room).emit("throwsLeft", throwsLeft);
		}
	});

	socket.on("rotateDice", (rotateDice) => {
		let room = Array.from(socket.rooms)[1];
		const players = getUsersInRoom(room);
		if (players[roomTurns[room]] === socket.data.username) {
			io.to(room).emit("rotateDice", rotateDice);
		}
	});

	socket.on("leaveRoom", () => {
		let room = Array.from(socket.rooms)[1];
		socket.leave(room);
		socket.emit("leftRoom", room);
	});
});

io.of("/").adapter.on("delete-room", (room) => {
	delete roomTurns.room;
	//roomTurns[room] = 0;
	console.log(`room ${room} was deleted`);
});

httpServer.listen(process.env.PORT || 8999, () => {
	console.log(`Server started on port ${httpServer.address().port}`);
});
