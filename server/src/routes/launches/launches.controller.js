const {
	getAllLaunches,
	addNewLaunch,
} = require("../../model/launches.model.js");

function httpGetAllLaunches(req, res) {
	return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
	const launch = req.body;
	launch.launchDate = new Date(launch.launchDate); // create date format from string
	// send request data to add function
	return res.status(201).json(addNewLaunch(launch));
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch };
