const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;

// event handler: log message as the connection is successfully made.
mongoose.connection.once("open", () => {
	console.log("db connection ready");
});

mongoose.connection.on("error", (error) => {
	console.error(error);
});

async function mongooseConnect() {
	try {
		await mongoose.connect(MONGO_URL).then(() => {
			console.log("db connected");
		});
	} catch (error) {
		throw Error(error);
	}
}

async function mongooseDisconnect() {
	await mongoose.disconnect();
}

module.exports = { mongooseConnect, mongooseDisconnect };
