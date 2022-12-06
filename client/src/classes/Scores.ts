import { Points, UsernameAndId } from "@backend/types";
import { PointsClass } from "./Points";
import { ObjectId } from "bson";

export class ScoresClass {
	_id: ObjectId = new ObjectId();
	userId: ObjectId;
	username: string;
	points: Points = new PointsClass();

	constructor(initializer: UsernameAndId) {
		this.userId = initializer._id;
		this.username = initializer.username;
	}
}
