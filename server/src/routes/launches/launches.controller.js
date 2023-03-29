const {
	getAllLaunches,
	addNewLaunch,
} = require("../../model/launches.model.js");

function httpGetAllLaunches(req, res) {
	return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
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
	return res.status(201).json(addNewLaunch(launch));
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch };
