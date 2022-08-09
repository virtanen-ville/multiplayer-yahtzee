import path from "path";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

//var players = [];
let turn = 0;

dotenv.config();

const app = express();
app.use(cors());

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
		console.log("ID: ", socket.id);
		console.log("USERNAME: ", socket.data.username);
		if (socket.data.username) {
			usernames.push(socket.data.username);
		}
	}
	console.log("usernames: ", usernames);
	return usernames;
};

io.on("connection", (socket) => {
	//socket.join("room1");
	console.log("socket ID: ", socket.id);

	socket.on("disconnecting", (reason) => {
		for (const room of socket.rooms) {
			if (room !== socket.id) {
				socket.to(room).emit("user has left", socket.id);
			}
		}
	});

	socket.on("playerSet", async (newPlayer) => {
		//players.push(newPlayer);
		socket.data.username = newPlayer;
		//console.log("newPlayers after push", players);

		//io.emit("playerSet", socketIdsArray);

		const players = await getUsernamesFromSockets();
		console.log("players: ", players);
		io.emit("playersArray", players);
	});

	socket.on("newScoreCard", async (newScoreCard) => {
		const players = await getUsernamesFromSockets();
		if (players[turn] === socket.data.username) {
			io.emit("newScoreCard", newScoreCard);
		}
	});

	socket.on("newDice", async (newDice) => {
		const players = await getUsernamesFromSockets();
		if (players[turn] === socket.data.username) {
			io.emit("newDice", newDice);
		}
	});

	socket.on("newRounds", async (newRounds) => {
		const players = await getUsernamesFromSockets();
		if (players[turn] === socket.data.username) {
			io.emit("newRounds", newRounds);
		}
	});

	socket.on("newTurn", async (newTurn) => {
		const players = await getUsernamesFromSockets();
		if (players[turn] === socket.data.username) {
			turn = newTurn;
			io.emit("newTurn", newTurn);
		}
	});

	socket.on("throwsLeft", async (throwsLeft) => {
		const players = await getUsernamesFromSockets();
		if (players[turn] === socket.data.username) {
			io.emit("throwsLeft", throwsLeft);
		}
	});

	socket.on("rotateDice", async (rotateDice) => {
		const players = await getUsernamesFromSockets();
		if (players[turn] === socket.data.username) {
			io.emit("rotateDice", rotateDice);
		}
	});

	/*
socket.on("playerSet", (newPlayer) => {
		players.push(newPlayer);
		console.log("newPlayers after push", players);
		socket.broadcast.emit("playersArray", players);
	});

	socket.on("scoreChange", (newScoreCard) => {
		socket.broadcast.emit("newScoreCard", newScoreCard);
	});

	socket.on("newDice", (newDice) => {
		socket.broadcast.emit("newDice", newDice);
	});

	socket.on("newRounds", (newRounds) => {
		socket.broadcast.emit("newRounds", newRounds);
	});

	socket.on("newTurn", (newTurn) => {
		socket.broadcast.emit("newTurn", newTurn);
	});

	socket.on("throwsLeft", (throwsLeft) => {
		socket.broadcast.emit("throwsLeft", throwsLeft);
	});

	socket.on("rotateDice", (rotateDice) => {
		socket.broadcast.emit("rotateDice", rotateDice);
	});
*/
});

httpServer.listen(process.env.PORT || 8999, () => {
	console.log(`Server started on port ${httpServer.address().port}`);
});
