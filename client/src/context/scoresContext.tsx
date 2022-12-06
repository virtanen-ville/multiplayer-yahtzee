import React, { createContext, useContext, useReducer, Dispatch } from "react";
import { Score, Props, ScoresAction } from "@backend/types";
import { PointsClass } from "src/classes/Points";

const initialScores: Score[] = [];
const ScoresContext = createContext<Score[]>([]);
const SetScoresContext = createContext<Dispatch<ScoresAction>>(() => {});

export const ScoresProvider: React.FC<Props> = ({ children }) => {
	const [scores, dispatch] = useReducer<React.Reducer<Score[], ScoresAction>>(
		scoresReducer,
		initialScores
	);

	return (
		<ScoresContext.Provider value={scores}>
			<SetScoresContext.Provider value={dispatch}>
				{children}
			</SetScoresContext.Provider>
		</ScoresContext.Provider>
	);
};

export function useScores() {
	return useContext(ScoresContext);
}

export function useSetScores() {
	return useContext(SetScoresContext);
}

function scoresReducer(scores: Score[], action: ScoresAction): Score[] {
	switch (action.type) {
		case "created": {
			if (action.newScores === undefined) return scores;
			return action.newScores;
		}

		case "updateOne": {
			return scores.map((score, _idx) => {
				if (score._id === action.newScore?._id) {
					return action.newScore;
				} else {
					return score;
				}
			});
		}
		case "deleteOne": {
			return scores.filter(
				(score) => score.username !== action.deletedScoreUsername
			);
		}
		case "updateMulti": {
			if (action.newScores === undefined) return scores;
			const newScores = action.newScores.map((score, _idx) => {
				const newPointsClass = new PointsClass(score.points);
				const updatedScore = {
					...score,
					points: newPointsClass,
				};
				return updatedScore;
			});
			return newScores;
		}
		case "reset": {
			return initialScores;
		}
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
}
