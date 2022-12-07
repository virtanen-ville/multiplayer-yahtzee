import path from "path";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import {
	ServerToClientEvents,
	ClientToServerEvents,
	InterServerEvents,
	SocketData,
	Room,
	Match,
	Score,
	CustomJwtPayload,
	ThrowsLeft,
} from "./types/types";
import { MongoClient, ObjectId } from "mongodb";
import apiAuthRouter from "./routes/apiAuth";
import apiMatchesRouter from "./routes/apiMatches";
import authenticateToken from "./middleware/authenticateToken";
import apiRoomsRouter from "./routes/apiRooms";
import cors from "cors";
import { UsernameAndId } from "./types/types";
import apiScoresRouter from "./routes/apiScores";
import { calculateTotal } from "./utils/calculateTotal";
import { initialDice } from "./utils/initialStates";
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

// BodyParser to change the body json date to new Date() Object

app.use(express.static(path.resolve(__dirname, "build")));
app.use("/api/auth", apiAuthRouter);
app.use("/api/scores", authenticateToken, apiScoresRouter);
app.use("/api/matches", authenticateToken, apiMatchesRouter);
app.use("/api/rooms", authenticateToken, apiRoomsRouter);

app.get("/*", function (req, res) {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

const uri: string = String(process.env.MONGO_URI);
const client = new MongoClient(uri);
const database = client.db("yahtzee");
const roomsCollection = database.collection<Room>("rooms");
const matchesCollection = database.collection<Match>("matches");
const scoresCollection = database.collection<Score>("scores");

const httpServer = createServer(app);
const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>(httpServer, {
	cors: {
		origin: "http://localhost:3000",
	},
});

// Get the active rooms from db
const getActiveRooms = async () => {
	try {
		const rooms = await roomsCollection.find().toArray();
		return rooms;
	} catch (error) {
		console.log(error);
		return [];
	}
};

// Returns the socket room name that the socket is in
const getRoomOfSocket = (socket: any): string => {
	let room: string = Array.from(socket.rooms)[1] as string;
	return room;
};

const checkThatSocketHasTurn = async (socket: any, matchId: ObjectId) => {
	try {
		const match = await matchesCollection.findOne({
			_id: matchId,
		});
		if (!match) {
			console.log("Match not found", matchId);
			return false;
		}
		if (match.scores[match.turn].userId === socket.data._id) return true;
		else return false;
	} catch (error) {
		console.log(error);
	}
};

// MIDDLEWARE
//Check the token and add the user to the socket
io.use((socket, next) => {
	const token = socket.handshake.auth.token;
	try {
		var decoded = jwt.verify(token, String(process.env.ACCESS_TOKEN_KEY));
		next();
		console.log("Socket auhenticated! Decoded token:", decoded);
	} catch (err) {
		console.log(`Socket not authenticated - Wrong token ${err}`);
		next(new Error("Socket authentication error"));
	}
});

io.on("connection", (socket) => {
	const token = socket.handshake.auth.token;
	let decoded = undefined;
	try {
		decoded = jwt.verify(
			token,
			String(process.env.ACCESS_TOKEN_KEY)
		) as CustomJwtPayload;
	} catch (err) {
		console.log(`Socket not authenticated - Wrong token ${err}`);
	}
	if (decoded) {
		socket.data.username = decoded.username;
		socket.data._id = String(decoded._id);
	}

	socket.on("createRoom", async (room) => {
		console.log("Creating room", room);
		try {
			const player = {
				username: socket.data.username,
				_id: socket.data._id as unknown as ObjectId,
			} as UsernameAndId;
			const newRoom = await roomsCollection.insertOne({
				_id: new ObjectId(),
				name: room,
				currentPlayers: [player],
				isLocked: false,
				createdAt: new Date(),
				createdBy: player,
				playersWithAccess: [socket.data._id as unknown as ObjectId],
				currentMatch: undefined,
			});

			if (newRoom.acknowledged) {
				socket.join(room);
				socket.data.roomName = room;
				socket.emit("joinRoom", room, [player]); // This will alert the user that they have joined the room
				// Emit to everybody else so everybody sees the new room.
				socket.broadcast.emit("getRooms", await getActiveRooms());
				//io.emit("getRooms", await getActiveRooms());
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("joinRoom", async (room) => {
		console.log("Joining room", room, "with user", socket.data.username);
		try {
			const player = {
				username: socket.data.username,
				_id: socket.data._id as unknown as ObjectId,
			} as UsernameAndId;

			const roomResponse = await roomsCollection.findOneAndUpdate(
				{
					name: room,
					isLocked: false,
				},
				{
					$push: {
						currentPlayers: player,
					},
				},
				{
					returnDocument: "after",
				}
			);

			if (roomResponse.ok && roomResponse.value) {
				socket.join(room);
				socket.data.roomName = room;
				io.to(room).emit(
					"joinRoom",
					room,
					roomResponse.value.currentPlayers
				);
			}
			socket.broadcast.emit("getRooms", await getActiveRooms());
			//io.emit("getRooms", await getActiveRooms());
		} catch (error) {
			console.log(error);
		}
	});

	//Emit the rooms to the one client who is asking them.
	socket.on("getRooms", async () => {
		socket.emit("getRooms", await getActiveRooms());
	});

	socket.on("deleteRoom", async (roomId?) => {
		try {
			let room;
			if (roomId) {
				room = await roomsCollection.findOneAndDelete({
					_id: new ObjectId(roomId),
				});
			} else {
				room = await roomsCollection.findOneAndDelete({
					name: socket.data.roomName,
				});
			}
			if (room.value) {
				// Make all sockets leave the room
				io.socketsLeave(room.value.name);
				io.emit("getRooms", await getActiveRooms());
			} else {
				console.log("Error deleting the room", roomId);
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("newScore", async (newScore, matchId) => {
		try {
			// Check that the clicker is the current player AND that the clicker clicks on his own score

			if (
				(await checkThatSocketHasTurn(socket, matchId)) &&
				socket.data._id === String(newScore.userId)
			) {
				const result = await scoresCollection.replaceOne(
					{
						_id: newScore._id,
					},
					{
						...newScore,
						points: {
							...newScore.points,
							total: calculateTotal(newScore.points),
						},
					},
					{
						upsert: true,
					}
				);
				if (result.acknowledged) {
					io.to(getRoomOfSocket(socket)).emit("newScore", newScore);
				} else {
					console.log("Error updating score to DB");
					return;
				}
			} else {
				console.log(
					"Error updating score - not current player or wrong player"
				);
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("createNewMatchAndScores", async (newMatch, scores) => {
		console.log("Creating new match and scores");
		try {
			const room = getRoomOfSocket(socket);
			const roomResponse = await roomsCollection.findOneAndUpdate(
				{
					name: room,
				},
				{
					$set: {
						isLocked: true,
						currentMatch: newMatch._id,
					},
				}
			);
			const newMatchWithDate = {
				...newMatch,
				startTime: new Date(newMatch.startTime),
			};
			// Don't check for the current player here, because the match hasn't started yet.
			const scoreResponse = await scoresCollection.insertMany(scores);
			const matchResponse = await matchesCollection.insertOne(
				newMatchWithDate
			);
			if (
				scoreResponse.acknowledged &&
				matchResponse.acknowledged &&
				roomResponse.ok
			) {
				console.log(
					"🚀 ~ file: index.ts:333 ~ socket.on ~ getRoomOfSocket(socket)",
					getRoomOfSocket(socket)
				);
				io.to(getRoomOfSocket(socket)).emit(
					"createNewMatchAndScores",
					newMatch,
					scores
				);
				// Emit to everybody so everybody sees the room as locked.
				io.emit("getRooms", await getActiveRooms());
			} else {
				console.log("Error inserting the new scores and match to DB");
				return;
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("newMatch", async (newMatch) => {
		try {
			// Change the correct bson Date value to the DB
			const newMatchWithDate = {
				...newMatch,
				startTime: new Date(newMatch.startTime),
				endTime: newMatch.endTime ? new Date(newMatch.endTime) : null,
			};
			// Check that the clicker is the current player OR that the game is over
			if (
				(await checkThatSocketHasTurn(socket, newMatch._id)) ||
				!newMatch.isActive
			) {
				const result = await matchesCollection.replaceOne(
					{
						_id: newMatch._id,
					},
					newMatchWithDate,
					{
						upsert: true,
					}
				);
				if (result.acknowledged) {
					io.to(getRoomOfSocket(socket)).emit("newMatch", newMatch);
				} else {
					console.log("Error updating match in DB");
					return;
				}
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("rotateDice", async (rotateDice, matchId) => {
		try {
			if (await checkThatSocketHasTurn(socket, matchId)) {
				io.to(getRoomOfSocket(socket)).emit("rotateDice", rotateDice);
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("gameOverDialogOpen", async (gameOverDialogOpen, matchId) => {
		try {
			// Let this be sent to room if player is current player or someone closes it (if it's open)
			if (
				(await checkThatSocketHasTurn(socket, matchId)) ||
				!gameOverDialogOpen
			) {
				io.to(getRoomOfSocket(socket)).emit(
					"gameOverDialogOpen",
					gameOverDialogOpen
				);
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("goHome", () => {
		try {
			io.to(getRoomOfSocket(socket)).emit("goHome");
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("leaveRoom", async () => {
		try {
			console.log(
				socket.data.username,
				" leaving room ",
				socket.data.roomName
			);
			const room = await roomsCollection.findOne({
				name: socket.data.roomName,
			});

			if (!room) return;
			let newRoom;
			if (room.currentPlayers.length <= 1) {
				newRoom = await roomsCollection.deleteOne({
					_id: new ObjectId(room._id),
				});
			} else {
				newRoom = await roomsCollection.updateOne(
					{
						_id: new ObjectId(room._id),
					},
					{
						$pull: {
							currentPlayers: {
								username: socket.data.username,
								_id: socket.data._id as unknown as ObjectId,
							},
						},
					}
				);
			}
			if (newRoom.acknowledged) {
				socket.leave(room.name);
				io.to(room.name).emit(
					"leaveRoom",
					String(socket.data.username)
				);
				io.emit("getRooms", await getActiveRooms());
				console.log(socket.data.username, " left room ", room.name);
				console.log("socket.rooms from leaveRoom: ", socket.rooms);
			} else {
				console.log("Error leaving room");
			}

			// Find the multiplayer match that the user is in
			const match = await matchesCollection.findOne({
				_id: room.currentMatch,
				isActive: true,
			});
			// If no match is found => return
			if (!match) return;
			// Delete the score of the user that left the room
			const scoreToDeleteId = match.scores.find(
				(score) => String(score.userId) === socket.data._id
			)?.scoreId;
			const deletedScore = await scoresCollection.deleteOne({
				_id: scoreToDeleteId,
			});

			// If there is only one player left in the match, delete the match
			if (match.scores.length <= 1) {
				const updatedMatch = await matchesCollection.deleteOne({
					_id: new ObjectId(match._id),
				});
				if (updatedMatch.acknowledged) {
					console.log("Match deleted");
				} else {
					console.log("Error deleting match from DB");
				}
			}
			// Else pull the player and score from the match and send the new match to the room
			else if (match.scores.length > 1) {
				const playerIndex = match.scores.findIndex(
					(score) => String(score.userId) === socket.data._id
				);

				const matchWithPlayerRemoved = {
					...match,
					scores: [
						...match.scores.slice(0, playerIndex),
						...match.scores.slice(playerIndex + 1),
					],
				};
				// Figure out the right turn and round when player removed
				let newMatch = matchWithPlayerRemoved;
				if (match.turn < playerIndex) {
					newMatch = {
						...matchWithPlayerRemoved,
					};
				} else if (match.turn === playerIndex) {
					if (match.turn !== match.scores.length - 1) {
						newMatch = {
							...matchWithPlayerRemoved,
							throwsLeft: 3 as ThrowsLeft,
							dice: initialDice,
						};
					} else {
						newMatch = {
							...matchWithPlayerRemoved,
							turn: 0,
							throwsLeft: 3 as ThrowsLeft,
							round: matchWithPlayerRemoved.round + 1,
							dice: initialDice,
						};
					}
				} else if (match.turn > playerIndex) {
					newMatch = {
						...matchWithPlayerRemoved,
						turn: matchWithPlayerRemoved.turn - 1,
					};
				}

				const updatedMatch = await matchesCollection.replaceOne(
					{
						_id: newMatch._id,
					},
					newMatch,
					{
						upsert: true,
					}
				);

				if (updatedMatch.acknowledged) {
					io.to(room.name).emit("newMatch", newMatch);
				} else {
					console.log("Error updating match in DB");
				}
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("disconnect", async (reason) => {
		console.log(
			`Client ${String(socket.data?.username)} disconnected: ${reason}`
		);

		try {
			console.log(
				socket.data.username,
				" leaving room ",
				socket.data.roomName
			);
			const room = await roomsCollection.findOne({
				name: socket.data.roomName,
			});

			if (!room) return;
			let newRoom;
			if (room.currentPlayers.length <= 1) {
				newRoom = await roomsCollection.deleteOne({
					_id: new ObjectId(room._id),
				});
			} else {
				newRoom = await roomsCollection.updateOne(
					{
						_id: new ObjectId(room._id),
					},
					{
						$pull: {
							currentPlayers: {
								username: socket.data.username,
								_id: socket.data._id as unknown as ObjectId,
							},
						},
					}
				);
			}
			if (newRoom.acknowledged) {
				socket.leave(room.name);
				io.to(room.name).emit(
					"leaveRoom",
					String(socket.data.username)
				);
				io.emit("getRooms", await getActiveRooms());
				console.log(socket.data.username, " left room ", room.name);
				console.log("socket.rooms from leaveRoom: ", socket.rooms);
			} else {
				console.log("Error leaving room");
			}

			// Find the multiplayer match that the user is in
			const match = await matchesCollection.findOne({
				_id: room.currentMatch,
				isActive: true,
			});
			// If no match is found => return
			if (!match) return;
			// Delete the score of the user that left the room
			const scoreToDeleteId = match.scores.find(
				(score) => String(score.userId) === socket.data._id
			)?.scoreId;
			const deletedScore = await scoresCollection.deleteOne({
				_id: scoreToDeleteId,
			});

			// If there is only one player left in the match, delete the match
			if (match.scores.length <= 1) {
				const updatedMatch = await matchesCollection.deleteOne({
					_id: new ObjectId(match._id),
				});
				if (updatedMatch.acknowledged) {
					console.log("Match deleted");
				} else {
					console.log("Error deleting match from DB");
				}
			}
			// Else pull the player and score from the match and send the new match to the room
			else if (match.scores.length > 1) {
				const playerIndex = match.scores.findIndex(
					(score) => String(score.userId) === socket.data._id
				);

				const matchWithPlayerRemoved = {
					...match,
					scores: [
						...match.scores.slice(0, playerIndex),
						...match.scores.slice(playerIndex + 1),
					],
				};
				// Figure out the right turn and round when player removed
				let newMatch = matchWithPlayerRemoved;
				if (match.turn < playerIndex) {
					newMatch = {
						...matchWithPlayerRemoved,
					};
				} else if (match.turn === playerIndex) {
					if (match.turn !== match.scores.length - 1) {
						newMatch = {
							...matchWithPlayerRemoved,
							throwsLeft: 3 as ThrowsLeft,
							dice: initialDice,
						};
					} else {
						newMatch = {
							...matchWithPlayerRemoved,
							turn: 0,
							throwsLeft: 3 as ThrowsLeft,
							round: matchWithPlayerRemoved.round + 1,
							dice: initialDice,
						};
					}
				} else if (match.turn > playerIndex) {
					newMatch = {
						...matchWithPlayerRemoved,
						turn: matchWithPlayerRemoved.turn - 1,
					};
				}

				const updatedMatch = await matchesCollection.replaceOne(
					{
						_id: newMatch._id,
					},
					newMatch,
					{
						upsert: true,
					}
				);

				if (updatedMatch.acknowledged) {
					io.to(room.name).emit("newMatch", newMatch);
				} else {
					console.log("Error updating match in DB");
				}
			}
		} catch (error) {
			console.log(error);
		}
	});
});

io.of("/").adapter.on("delete-room", async (room) => {
	try {
		const deletedRoom = await roomsCollection.deleteOne({ name: room });
		if (deletedRoom.acknowledged) {
			console.log(`room ${room} was deleted`);
			io.emit("getRooms", await getActiveRooms());
		} else {
			console.log(`Error deleting room ${room} from DB`);
		}
	} catch (error) {
		console.log(error);
	}
});

httpServer.listen(process.env.PORT || 3100, () => {
	console.log(`Server started on port ${process.env.PORT}`);
});
