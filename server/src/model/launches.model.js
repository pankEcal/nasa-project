const launches = new Map();

let latestFlightNumber = 100;

const launch = {
	flightNumber: 100,
	mission: "Kepler Exploration X",
	rocket: "Explorer IS1",
	launchDate: new Date("December 7, 2030"),
	target: "Kepler-442 b",
	customers: ["ZTM", "NASA"],
	upcoming: true,
	success: true,
};

launches.set(launch.flightNumber, launch);

function addNewLaunch(newLaunchData) {
	latestFlightNumber++;
	// while creating new launch, update the flightNumber and keep everything same
	launches.set(
		latestFlightNumber,
		Object.assign(newLaunchData, {
			success: true,
			upcoming: true,
			flightNumber: latestFlightNumber,
			customers: ["Zero To Mastery", "NASA"],
		})
	);
	return launches.get(newLaunchData.flightNumber);
}

function getAllLaunches() {
	return Array.from(launches.values());
}

function existsLaunchWithId(launchId) {
	return launches.has(Number(launchId));
}

function abortLaunchById(launchId) {
	const abortedLaunch = launches.get(launchId);
	abortedLaunch.upcoming = false;
	abortedLaunch.success = false;

	return abortedLaunch;
}

module.exports = {
	getAllLaunches,
	addNewLaunch,
	abortLaunchById,
	existsLaunchWithId,
};
