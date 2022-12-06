type GenericObject = Record<string, unknown>;

export const getRoomUserIsIn = async (
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
	const res = await fetch(`/api/rooms?${query}`, {
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
