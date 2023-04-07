const http = require("http");
const mongoose = require("mongoose");

const app = require("./app.js");
const { loadPlanetsData } = require("./model/planets.model.js");

const PORT = process.env.PORT || 8000;
const MONGO_URL =
	"mongodb+srv://pankecal:helokecha@nasa-api.a1bzr17.mongodb.net/nasa-api?retryWrites=true&w=majority";

const server = http.createServer(app);

// event handler: log message as the connection is successfully made.
mongoose.connection.once("open", () => {
	console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (error) => {
	console.error(error);
});

async function startServer() {
	// process the data asynchronously using promise and return the values after completion
	await mongoose.connect(MONGO_URL);
	await loadPlanetsData();

	server.listen(PORT, () => {
		console.log(`sever is listening on PORT ${PORT}`);
	});
}

startServer();
