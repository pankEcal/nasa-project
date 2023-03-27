// import from dependecies
const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

// import from modules
const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");

const app = express();

// implement middlewares
app.use(cors({ origin: "http://localhost:3000" })); // enable CORS for API access to frontend
app.use(morgan("combined"));
app.use(express.json()); // enable JSON parse
app.use(express.static(path.join(__dirname, "..", "public"))); // add static file serving

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// implement routes
app.use(planetsRouter);
app.use(launchesRouter);

module.exports = app;
