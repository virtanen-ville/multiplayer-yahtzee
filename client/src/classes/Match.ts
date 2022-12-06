import { Die, UserIdAndScoreId, ThrowsLeft } from "@backend/types";
import { ObjectId } from "bson";
import { initialDice } from "../utils/initialStates";

export class MatchClass {
	_id: ObjectId = new ObjectId();
	startTime: Date = new Date();
	endTime: Date | null = null;
	scores: UserIdAndScoreId[] = [];
	round: number = 1;
	turn: number = 0;
	throwsLeft: ThrowsLeft = 3;
	isActive: boolean = false;
	dice: Die[] = initialDice;

	constructor(initializer?: any) {
		if (!initializer) return;
		if (initializer._id) this._id = initializer._id;
		if (initializer.startTime) this.startTime = initializer.startTime;
		if (initializer.endTime) this.endTime = initializer.endTime;
		if (initializer.round) this.round = initializer.round;
		if (initializer.turn !== undefined) this.turn = initializer.turn;
		if (initializer.throwsLeft !== undefined)
			this.throwsLeft = initializer.throwsLeft;
		if (initializer.scores) this.scores = initializer.scores;
		if (initializer.isActive !== undefined)
			this.isActive = initializer.isActive;
	}
}
