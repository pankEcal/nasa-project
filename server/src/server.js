const http = require("http");
const { mongooseConnect } = require("./services/mongo");

const app = require("./app.js");
const { loadPlanetsData } = require("./model/planets.model.js");
const { loadLaunchData } = require("./model/launches.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
	// process the data asynchronously using promise and return the values after completion
	await mongooseConnect();
	await loadPlanetsData();
	await loadLaunchData();

	server.listen(PORT, () => {
		console.log(`sever is listening on PORT ${PORT}`);
	});
}

startServer();
