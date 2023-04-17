const {
	getAllLaunches,
	scheduleNewLaunch,
	abortLaunchById,
	existsLaunchWithId,
} = require("../../model/launches.model.js");

async function httpGetAllLaunches(req, res) {
	return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
	const launch = req.body;

	if (
		!launch.mission ||
		!launch.rocket ||
		!launch.target ||
		!launch.launchDate
	) {
		// validate data and send relevant response if data is missing
		return res.status(400).json({
			error: "missing required launch data",
		});
	}

	launch.launchDate = new Date(launch.launchDate); // create date format from string
	if (isNaN(launch.launchDate)) {
		// validating date
		return res.status(400).json({
			error: "Invalid launch date",
		});
	}

	// send request data to add function
	await scheduleNewLaunch(launch);
	return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
	const launchId = Number(req.params.id);

	if (!existsLaunchWithId(launchId)) {
		return res.status(404).json({
			error: "Launch not found!",
		});
	}

	return res.status(200).json(abortLaunchById(launchId));
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
