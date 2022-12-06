import React, { createContext, useContext, Dispatch, useReducer } from "react";
import { Props, Match, MatchAction } from "@backend/types";
import { MatchClass } from "src/classes/Match";
const initialMatch: Match = new MatchClass();
const MatchContext = createContext<Match>(initialMatch);
const MatchDispatchContext = createContext<Dispatch<MatchAction>>(() => {});

export const MatchProvider: React.FC<Props> = ({ children }) => {
	const [match, dispatch] = useReducer<React.Reducer<Match, MatchAction>>(
		matchReducer,
		initialMatch
	);

	return (
		<MatchContext.Provider value={match}>
			<MatchDispatchContext.Provider value={dispatch}>
				{children}
			</MatchDispatchContext.Provider>
		</MatchContext.Provider>
	);
};

export function useMatch() {
	return useContext(MatchContext);
}

export function useSetMatch() {
	return useContext(MatchDispatchContext);
}

function matchReducer(match: Match, action: MatchAction): Match {
	switch (action.type) {
		case "updateMatch": {
			if (action.newMatch === undefined) return match;
			return action.newMatch;
		}
		case "reset": {
			return new MatchClass();
		}
		case "lockDie": {
			if (action.dieToLock === undefined) {
				throw new Error("No index provided to lock die");
			} else {
				const newDice = match.dice.map((die, index) => {
					if (index === action.dieToLock) {
						return { ...die, locked: !die.locked };
					} else {
						return die;
					}
				});
				const newMatch = { ...match, dice: newDice };
				return newMatch;
			}
		}

		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
}
