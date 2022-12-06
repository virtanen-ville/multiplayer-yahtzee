import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

export interface CustomJwtPayload extends JwtPayload {
	_id: string;
	username: string;
}

export interface ServerToClientEvents {
	joinRoom: (roomName: string, players: UsernameAndId[]) => void;
	gameOverDialogOpen: (gameOverDialogOpen: boolean) => void;
	createRoom: (roomName: string) => void;
	leaveRoom: (username: string) => void;
	rotateDice: (rotating: boolean) => void;
	getRooms: (rooms: Room[]) => void;
	goHome: () => void;
	newMatch: (newMatch: Match) => void;
	newScore: (newScore: Score) => void;
	createNewMatchAndScores: (newMatch: Match, newScores: Score[]) => void;
}

export interface ClientToServerEvents {
	joinRoom: (roomToJoin: string) => void;
	gameOverDialogOpen: (
		gameOverDialogOpen: boolean,
		matchId: ObjectId
	) => void;
	createRoom: (newRoomName: string) => void;
	rotateDice: (rotating: boolean, matchId: ObjectId) => void;
	leaveRoom: () => void;
	quitMatch: () => void;
	getRooms: () => void;
	goHome: () => void;
	deleteRoom: (roomId?: ObjectId) => void;
	newMatch: (newMatch: Match) => void;
	newScore: (newScore: Score, matchId: ObjectId) => void;
	createNewMatchAndScores: (newMatch: Match, scores: Score[]) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
	username?: string;
	_id?: string;
	roomName?: string;
}

export interface Score {
	_id: ObjectId;
	userId: ObjectId;
	username: string;
	points: Points;
}

export interface Props {
	children?: React.ReactNode;
	navigation?: any;
}

export interface User {
	_id: ObjectId;
	username: string;
	email: string;
	password?: string;
	createdAt: Date;
	firstName: string;
	lastName: string;
	lastLogin: Date;
	profilePicture?: string | Buffer;
	loggedIn: boolean;
}

export interface UsernameAndId {
	_id: ObjectId;
	username: string;
}

export interface Room {
	_id: ObjectId;
	name: string;
	createdAt: Date;
	createdBy: UsernameAndId;
	currentPlayers: UsernameAndId[];
	isLocked: boolean;
	playersWithAccess: ObjectId[];
	currentMatch: ObjectId | undefined;
}

export type ThrowsLeft = 0 | 1 | 2 | 3;

export interface UserIdAndScoreId {
	userId: ObjectId;
	scoreId: ObjectId;
}

export interface Match {
	_id: ObjectId;
	startTime: Date;
	endTime: Date | null;
	round: number;
	turn: number;
	throwsLeft: ThrowsLeft;
	scores: UserIdAndScoreId[];
	isActive: boolean;
	dice: Die[];
}

export interface Die {
	locked: boolean;
	value: DieValues;
}

export type DieValues = 1 | 2 | 3 | 4 | 5 | 6;

export interface Points {
	ones: number | null;
	twos: number | null;
	threes: number | null;
	fours: number | null;
	fives: number | null;
	sixes: number | null;
	onePair: number | null;
	twoPairs: number | null;
	threeOfAKind: number | null;
	fourOfAKind: number | null;
	smallStraight: number | null;
	largeStraight: number | null;
	fullHouse: number | null;
	chance: number | null;
	yahtzee: number | null;
	bonus: number;
	total: number;
}

export type Playmode = "" | "guest" | "multi" | "single";

type ScoresActionType =
	| "updateMulti"
	| "updateOne"
	| "reset"
	| "created"
	| "deleteOne";

type MatchActionType = "lockDie" | "updateMatch" | "reset";

export interface ScoresAction {
	type: ScoresActionType;
	newScores?: Score[];
	newScore?: Score;
	deletedScoreUsername?: string;
}

export interface MatchAction {
	type: MatchActionType;
	newMatch?: Match;
	newDice?: Die[];
	dieToLock?: number;
}

export type MatchDispatch = React.Dispatch<MatchAction>;

export type ScoresDispatch = React.Dispatch<ScoresAction>;
