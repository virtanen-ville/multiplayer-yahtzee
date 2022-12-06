import { Match } from "@backend/types";
import { ObjectId } from "bson";
type GenericObject = Record<string, unknown>;

export const saveMatchToDB = async (
	match: Match,
	controller?: AbortController
) => {
	const res = await fetch("/api/matches", {
		method: "POST",
		signal: controller?.signal,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
		body: JSON.stringify({
			match: match,
		}),
	});
	const data = await res.json();
	return data;
};

export const updateMatchToDB = async (
	match: Match,
	controller?: AbortController
) => {
	const res = await fetch(`/api/matches/${match._id}`, {
		method: "PUT",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
		body: JSON.stringify({
			match: match,
		}),
	});
	const data = await res.json();
	return data;
};

export const getMatchFromDB = async (
	matchId: ObjectId,
	controller?: AbortController
): Promise<Match> => {
	const res = await fetch(`/api/matches/${matchId}`, {
		method: "GET",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	const data = await res.json();
	return data;
};

export const deleteMatchFromDB = async (
	matchId: ObjectId,
	controller?: AbortController
) => {
	const res = await fetch(`/api/matches/${matchId}`, {
		method: "DELETE",
		signal: controller?.signal,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	const data = await res.json();
	return data;
};

export const getAllMatchesFromDB = async (controller?: AbortController) => {
	const res = await fetch("/api/matches", {
		method: "GET",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	const data = await res.json();
	return data;
};

export const getFilteredMatchesFromDB = async (
	reqQueryFilters: GenericObject | string,
	controller?: AbortController
) => {
	let query;
	if (typeof reqQueryFilters === "string") {
		query = reqQueryFilters;
	} else {
		// Make a query string from the filters
		query = Object.keys(reqQueryFilters)
			.map((key) => `${key}=${reqQueryFilters[key]}`)
			.join("&");
	}
	const res = await fetch(`/api/matches?${query}`, {
		method: "GET",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	const data = await res.json();
	return data;
};
