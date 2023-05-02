// import from dependecies
const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

// import from modules
const apiV1 = require("./routes/apiV1");
const app = express();

// implement middlewares
app.use(cors({ origin: "http://localhost:3000" })); // enable CORS for API access to frontend
app.use(morgan("short"));

app.use(express.json()); // enable JSON parse
app.use(express.static(path.join(__dirname, "..", "public"))); // add static file serving

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// implement routes

app.use("/v1", apiV1);

module.exports = app;
