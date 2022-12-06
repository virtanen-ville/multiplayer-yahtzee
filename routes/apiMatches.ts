import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { Match } from "../types/types";
import authorizeMatchPlayer from "../middleware/authorizeMatchPlayer";

dotenv.config();
const apiMatchesRouter: express.Router = express.Router();

apiMatchesRouter.use(express.json());

const uri: string = String(process.env.MONGO_URI);
const client = new MongoClient(uri);
const database = client.db("yahtzee");
const matchesCollection = database.collection<Match>("matches");

apiMatchesRouter.post(
	"/",
	authorizeMatchPlayer,
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const newMatchWithDate = {
			...req.body.match,
			startTime: new Date(req.body.match.startTime),
			endTime: req.body.match.endTime
				? new Date(req.body.match.endTime)
				: undefined,
		};

		const matchResponse = await matchesCollection.insertOne(
			newMatchWithDate
		);
		res.send(matchResponse);
	}
);

apiMatchesRouter.put(
	"/:matchId",
	authorizeMatchPlayer,
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const newMatchWithDate = {
			...req.body.match,
			startTime: new Date(req.body.match.startTime),
			endTime: req.body.match.endTime
				? new Date(req.body.match.endTime)
				: undefined,
		};

		const matchResponse = await matchesCollection.replaceOne(
			{
				_id: req.params.matchId as unknown as ObjectId,
			},
			newMatchWithDate
		);
		res.send(matchResponse);
	}
);

apiMatchesRouter.get(
	"/",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		if (!req.query) {
			const allMatches = await matchesCollection.find().toArray();
			res.send(allMatches);
		}
		if (req.query) {
			const match = await matchesCollection.findOne({
				"scores.userId": req.query.userId as unknown as ObjectId,
				scores: { $size: 1 },
				isActive: req.query.isActive === "true" ? true : false,
			});
			res.send(match);
		}
	}
);

apiMatchesRouter.get(
	"/:matchId",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const matchRes = await matchesCollection.findOne({
			_id: req.params.matchId as unknown as ObjectId,
		});
		res.send(matchRes);
	}
);

apiMatchesRouter.delete(
	"/:matchId",
	authorizeMatchPlayer,
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const match = await matchesCollection.deleteOne({
			_id: req.params.matchId as unknown as ObjectId,
		});
		res.send(match);
	}
);

export default apiMatchesRouter;
