const API_URL = "v1"; // calling the domain it's hosted on

async function httpGetPlanets() {
	// TODO: Once API is ready.
	// Load planets and return as JSON.
	const response = await fetch(`${API_URL}/planets`);
	return await response.json();
}

async function httpGetLaunches() {
	// TODO: Once API is ready.
	// Load launches, sort by flight number, and return as JSON.

	const response = await fetch(`${API_URL}/launches`);
	return await response.json();
}

async function httpSubmitLaunch(launch) {
	// TODO: Once API is ready.
	// Submit given launch data to launch system.
	try {
		const response = await fetch(`${API_URL}/launches`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(launch),
		});

		return response;
	} catch (err) {
		console.log("error at httpSubmitLaunch()");
		console.log(err);
		return {
			ok: false,
		};
	}
}

async function httpAbortLaunch(id) {
	// TODO: Once API is ready.
	// Delete launch with given ID.
	try {
		return await fetch(`${API_URL}/launches/${id}`, {
			method: "delete",
		});
	} catch (err) {
		console.log(err);
		return {
			ok: false,
		};
	}
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
