const {
	getAllLaunches,
	scheduleNewLaunch,
	abortLaunchById,
	existsLaunchWithId,
} = require("../../model/launches.model.js");
const { getPagination } = require("../../services/query.js");

async function httpGetAllLaunches(req, res) {
	const { skip, limit } = getPagination(req.query);
	const launches = await getAllLaunches(skip, limit);
	return res.status(200).json(launches);
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

async function httpAbortLaunch(req, res) {
	const launchId = Number(req.params.id);

	const existsLaunch = await existsLaunchWithId(launchId);

	if (!existsLaunch) {
		return res.status(404).json({
			error: "Launch not found!",
		});
	}

	const isAborted = await abortLaunchById(launchId);

	if (!isAborted) {
		return res.status(400).json({
			error: "launch not aborted",
		});
	}

	return res.status(200).json({
		ok: true,
	});
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
