import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

import { User, Score, Room } from "../types/types";
dotenv.config();
const uri: string = String(process.env.MONGO_URI);
const client = new MongoClient(uri);
const database = client.db("yahtzee");
const roomsCollection = database.collection<Room>("rooms");

const authorizeRoomPlayer = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		let token: string = req.headers.authorization!.split(" ")[1];

		const user = jwt.verify(
			token,
			String(process.env.ACCESS_TOKEN_KEY)
		) as User;
		const room = await roomsCollection.findOne({
			name: req.params.roomName,
		});
		// check params (on put and delete)
		const userIds = room?.currentPlayers.map((player) => player._id);
		if (room && userIds?.includes(user._id)) {
			next();
		} // Then check body (on post that only allows the sender to be made as creator)
		else if (
			// If the params exist only allow to check that
			!req.params.scoreId &&
			req.body.createdBy._id === user._id
		) {
			next();
		} else {
			res.status(401).json("Unauthorized.");
		}
	} catch (e: any) {
		res.status(401).json("Unauthorized.");
	}
};

export default authorizeRoomPlayer;
