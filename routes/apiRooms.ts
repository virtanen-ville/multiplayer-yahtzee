import express from "express";
import { CustomError } from "../errors/errorHandler";
import { MongoClient, ObjectId } from "mongodb";
import { Room } from "../types/types";
import dotenv from "dotenv";
import authorizeRoomPlayer from "../middleware/authorizeRoomPlayer";

dotenv.config();

const apiRoomsRouter: express.Router = express.Router();

apiRoomsRouter.use(express.json());

const uri: string = String(process.env.MONGO_URI);
const client = new MongoClient(uri);
const database = client.db("yahtzee");
const roomsCollection = database.collection<Room>("rooms");

apiRoomsRouter.post(
	"/",
	authorizeRoomPlayer,
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const room = await roomsCollection.findOne({
			name: req.body.name,
		});
		if (room) {
			next(new CustomError(400, "Room name already exists."));
		} else {
			const newRoom = await roomsCollection.insertOne({
				_id: new ObjectId(),
				name: req.body.name,
				createdAt: new Date(),
				createdBy: req.body.createdBy,
				currentPlayers: [req.body.createdBy],
				isLocked: false,
				playersWithAccess: [],
				currentMatch: undefined,
			});

			res.send(newRoom);
		}
	}
);

apiRoomsRouter.get(
	"/:roomName",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const room = await roomsCollection.findOne({
			name: req.params.roomName,
		});
		res.send(room);
	}
);

apiRoomsRouter.put(
	"/:roomName",
	authorizeRoomPlayer, // Putting this here will disallow new players from joining a room. This is because the middleware will check if the user is in the room, and if not, it will throw an error.

	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const room = await roomsCollection.findOneAndUpdate(
			{ name: req.params.roomName },
			{
				$push: {
					currentPlayers: req.body.newPlayer,
				},
			},
			{
				returnDocument: "after",
			}
		);
		res.send(room);
	}
);

apiRoomsRouter.delete(
	"/:roomName",
	authorizeRoomPlayer,
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const room = await roomsCollection.deleteOne({
			name: req.params.roomName,
		});
		res.send(room);
	}
);

apiRoomsRouter.get(
	"/",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		if (!req.query) {
			const allRooms = await roomsCollection.find().toArray();
			res.send(allRooms);
		} else {
			const filteredRoom = await roomsCollection.findOne({
				currentPlayers: { $elemMatch: { _id: req.query.userId } },
			});
			res.send(filteredRoom);
		}
	}
);

export default apiRoomsRouter;
