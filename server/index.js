import path from "path";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

var players = [];

dotenv.config();

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	//socket.join("room1");
	console.log(socket.id);

	socket.on("disconnecting", (reason) => {
		for (const room of socket.rooms) {
			if (room !== socket.id) {
				socket.to(room).emit("user has left", socket.id);
			}
		}
	});

	socket.on("playerSet", (newPlayer) => {
		players.push(newPlayer);
		console.log("newPlayers after push", players);
		io.emit("playersArray", players);
	});

	socket.on("scoreChange", (newScoreCard) => {
		io.emit("newScoreCard", newScoreCard);
	});

	socket.on("newDice", (newDice) => {
		io.emit("newDice", newDice);
	});

	socket.on("newRounds", (newRounds) => {
		io.emit("newRounds", newRounds);
	});

	socket.on("newTurn", (newTurn) => {
		io.emit("newTurn", newTurn);
	});

	socket.on("throwsLeft", (throwsLeft) => {
		io.emit("throwsLeft", throwsLeft);
	});

	socket.on("rotateDice", (rotateDice) => {
		io.emit("rotateDice", rotateDice);
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
