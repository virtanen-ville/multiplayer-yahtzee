import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

import { User, Score, Match } from "../types/types";
dotenv.config();
const uri: string = String(process.env.MONGO_URI);
const client = new MongoClient(uri);
const database = client.db("yahtzee");
const matchesCollection = database.collection<Match>("matches");

const authorizeMatchPlayer = async (
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
		const match = await matchesCollection.findOne({
			_id: req.params.matchId as unknown as ObjectId,
		});
		// First check params (on put and delete)
		const userIds = match?.scores.map((score) => score.userId);
		if (match && userIds?.includes(user._id)) {
			next();
		}
		// Then check body (on post)
		else if (
			// If the params exist only allow to check that
			!req.params.matchId &&
			req.body.match.scores.find(
				(score: Score) => score.userId === user._id
			)
		) {
			next();
		} else {
			res.status(401).json("Unauthorized.");
		}
	} catch (e: any) {
		res.status(401).json("Unauthorized.");
	}
};

export default authorizeMatchPlayer;
