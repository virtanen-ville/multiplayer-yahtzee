import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Score, User } from "../types/types";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();
const uri: string = String(process.env.MONGO_URI);
const client = new MongoClient(uri);
const database = client.db("yahtzee");
const scoresCollection = database.collection<Score>("scores");

const authorizeScoreOwner = async (
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
		const score = await scoresCollection.findOne({
			_id: req.params.scoreId as unknown as ObjectId,
		});
		// First check params (on put and delete)
		if (score && score.userId === user._id) {
			next();
		}
		// Then check body (on post)
		else if (
			// If the params exist only allow to check that
			!req.params.scoreId &&
			req.body.scores?.find((score: any) => score.userId === user._id)
		) {
			next();
		} else {
			res.status(401).json("Unauthorized.");
		}
	} catch (e: any) {
		res.status(500).json("There was an error.");
	}
};

export default authorizeScoreOwner;
