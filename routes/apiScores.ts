import express from "express";
import { CustomError } from "../errors/errorHandler";
import { MongoClient, ObjectId } from "mongodb";
import { Score, User } from "../types/types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { calculateTotal } from "../utils/calculateTotal";
import authorizeScoreOwner from "../middleware/authorizeScoreOwner";
dotenv.config();

const apiScoresRouter: express.Router = express.Router();

apiScoresRouter.use(express.json());

const uri: string = String(process.env.MONGO_URI);
const client = new MongoClient(uri);
const database = client.db("yahtzee");
const scoresCollection = database.collection<Score>("scores");

apiScoresRouter.get(
	"/top",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const getTopScoresWithEndTimeAggregation = [
			{
				$match: {
					"points.total": { $exists: true },
				},
			},
			{
				$lookup: {
					from: "matches",
					localField: "_id",
					foreignField: "scores.scoreId",
					as: "matchInfo",
				},
			},
			{
				$project: {
					username: 1,
					total: "$points.total",
					endTime: {
						$arrayElemAt: ["$matchInfo.endTime", 0],
					},
				},
			},
			{
				$sort: {
					total: -1,
				},
			},
			{
				$limit: 20,
			},
		];
		// Errors are send to next() automatically in express v5 and above.
		const topScoresWithEndTime = await scoresCollection
			.aggregate(getTopScoresWithEndTimeAggregation)
			.toArray();
		res.send(topScoresWithEndTime);
	}
);

apiScoresRouter.get(
	"/latest",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const getLatestScoresWithEndTimeAggregation = [
			{
				$match: {
					"points.total": { $exists: true },
				},
			},
			{
				$lookup: {
					from: "matches",
					localField: "_id",
					foreignField: "scores.scoreId",
					as: "matchInfo",
				},
			},
			{
				$project: {
					username: 1,
					total: "$points.total",
					endTime: {
						$arrayElemAt: ["$matchInfo.endTime", 0],
					},
				},
			},
			{
				$sort: {
					endTime: -1,
				},
			},
			{
				$limit: 20,
			},
		];
		// Errors are send to next() automatically in express v5 and above.
		const latestScoresWithEndTime = await scoresCollection
			.aggregate(getLatestScoresWithEndTimeAggregation)
			.toArray();
		res.send(latestScoresWithEndTime);
	}
);

apiScoresRouter.get(
	"/my",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		let token: string = req.headers.authorization!.split(" ")[1];
		const user = jwt.verify(
			token,
			String(process.env.ACCESS_TOKEN_KEY)
		) as User;

		const getMyScoresWithEndTimeAggregation = [
			{
				$match: {
					username: user.username,
					"points.total": { $exists: true },
				},
			},
			{
				$lookup: {
					from: "matches",
					localField: "_id",
					foreignField: "scores.scoreId",
					as: "matchInfo",
				},
			},
			{
				$project: {
					username: 1,
					total: "$points.total",
					endTime: {
						$arrayElemAt: ["$matchInfo.endTime", 0],
					},
				},
			},
			{
				$sort: {
					endTime: -1,
				},
			},
			{
				$limit: 20,
			},
		];
		// Errors are send to next() automatically in express v5 and above.
		const myScoresWithEndTime = await scoresCollection
			.aggregate(getMyScoresWithEndTimeAggregation)
			.toArray();
		res.send(myScoresWithEndTime);
	}
);

apiScoresRouter.post(
	"/",
	authorizeScoreOwner,
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		// Errors are send to next() automatically in express v5 and above.
		const newScores = await scoresCollection.insertMany(req.body.scores);
		res.send(newScores);
	}
);

apiScoresRouter.put(
	"/:scoreId",
	authorizeScoreOwner,
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		// Errors are send to next() automatically in express v5 and above.

		const response = await scoresCollection.replaceOne(
			{
				_id: req.params.scoreId as unknown as ObjectId,
			},
			{
				...req.body.score,
				points: {
					...req.body.score.points,
					total: calculateTotal(req.body.score.points),
				},
			},
			{ upsert: true }
		);
		res.json(response);
	}
);

apiScoresRouter.get(
	"/",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		if (Object.keys(req.query).length === 0) {
			const allScores = await scoresCollection
				.find({
					"points.total": { $exists: true },
				})
				.toArray();
			res.send(allScores);
		} else {
			const scoresRes = await scoresCollection
				.find({
					_id: {
						$in:
							(req.query.scoreIds as unknown as ObjectId[]) || [],
					},
				})
				.toArray();
			res.send(scoresRes);
		}
	}
);

apiScoresRouter.get(
	"/:scoreId",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const response = await scoresCollection.findOne({
			_id: req.params.scoreId as unknown as ObjectId,
		});
		res.send(response);
	}
);

apiScoresRouter.delete(
	"/:scoreId",
	authorizeScoreOwner,
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const response = await scoresCollection.deleteOne({
			_id: req.params.scoreId as unknown as ObjectId,
		});
		res.send(response);
	}
);

export default apiScoresRouter;
