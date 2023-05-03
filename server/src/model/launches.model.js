const axios = require("axios");

const launchesData = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
	console.log("downloading launch data....");

	const {
		data: { docs: launchDocs },
	} = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: "rocket",
					select: {
						name: 1,
					},
				},
				{
					path: "payloads",
					select: {
						customers: 1,
					},
				},
			],
		},
	});

	for (const launchDoc of launchDocs) {
		const payloads = launchDoc["payloads"];
		const customers = payloads.flatMap((payload) => {
			return payload["customers"];
		});

		const launch = {
			flightNumber: launchDoc["flight_number"],
			mission: launchDoc["name"],
			rocket: launchDoc["rocket"]["name"],
			launchDate: launchDoc["date_local"],
			upcoming: launchDoc["upcoming"],
			success: launchDoc["success"],
			customers,
		};
	}

	// TODO: populate launches collection
}

async function loadLaunchData() {
	const firstLaunch = await findLaunch({
		flightNumber: 101,
		rocket: "Explorer IS122",
		mission: "all new Kepler",
	});

	if (firstLaunch) {
		console.log("queried data already exists: ");
		return;
	} else {
		await populateLaunches();
	}
}

async function getAllLaunches() {
	return await launchesData.find({}, { _id: 0, __v: 0 });
}

async function getLatestFlightNumber() {
	// get the item having highest value of "flightNumber". "-" means to get the value in decreasing order
	const latestLaunch = await launchesData.findOne().sort("-flightNumber");

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	} else {
		return latestLaunch.flightNumber;
	}
}

async function saveLaunch(launch) {
	const planet = await planets.findOne(
		{ keplerName: launch.target },
		{ _id: 0, __v: 0 }
	);

	if (!planet) {
		throw new Error("No matching planet was found");
	}

	await launchesData.findOneAndUpdate(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{ upsert: true }
	);
}

async function scheduleNewLaunch(launch) {
	const newFlightNumber = (await getLatestFlightNumber()) + 1;

	const newLaunch = Object.assign(launch, {
		success: true,
		upcoming: true,
		customers: ["ZTM", "Nasa"],
		flightNumber: newFlightNumber,
	});

	await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
	return await launchesData.findOne(filter);
}

async function existsLaunchWithId(launchId) {
	// utilizing generic function to get the data based on the desired filter
	const launch = await findLaunch(launchId);

	return launch ? true : false;
}

async function abortLaunchById(launchId) {
	const aborted = await launchesData.updateOne(
		{ flightNumber: launchId },
		{
			upcoming: false,
			success: false,
		}
	);

	// the returned value provies bunch of metadata which can be used to conditionally check the data
	return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
}

module.exports = {
	getAllLaunches,
	existsLaunchWithId,
	abortLaunchById,
	scheduleNewLaunch,
	loadLaunchData,
	findLaunch,
};
