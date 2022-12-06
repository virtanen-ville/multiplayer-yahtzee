import { Score } from "@backend/types";
import { ObjectId } from "bson";
type GenericObject = Record<string, unknown>;

export const saveScoresArrayToDB = async (
	scores: Score[],
	controller?: AbortController
) => {
	const res = await fetch("/api/scores", {
		method: "POST",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
		body: JSON.stringify({
			scores: scores,
		}),
	});
	const data = await res.json();
	return data;
};

export const updateSingleScoreToDB = async (
	score: Score,
	controller?: AbortController
) => {
	const res = await fetch(`/api/scores/${score._id}`, {
		method: "PUT",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
		body: JSON.stringify({
			score: score,
		}),
	});
	const data = await res.json();
	return data;
};

export const getScoreFromDB = async (
	scoreId: ObjectId,
	controller?: AbortController
) => {
	const res = await fetch(`/api/scores/${scoreId}`, {
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

export const getTopScoresFromDB = async (controller?: AbortController) => {
	const res = await fetch("/api/scores/top", {
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

export const getLatestScoresFromDB = async (controller?: AbortController) => {
	const res = await fetch("/api/scores/latest", {
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

export const getMyScoresFromDB = async (controller?: AbortController) => {
	const res = await fetch("/api/scores/my", {
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

export const getAllScoresFromDB = async (controller?: AbortController) => {
	const res = await fetch("/api/scores", {
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

export const getFilteredScoresFromDB = async (
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
	const res = await fetch(`/api/scores?${query}`, {
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

export const deleteScoreFromDB = async (
	scoreId: ObjectId,
	controller?: AbortController
) => {
	const res = await fetch(`/api/scores/${scoreId}`, {
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
