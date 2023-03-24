// import from dependecies
const express = require("express");
const cors = require("cors");
const path = require("path");

// import from modules
const planetsRouter = require("./routes/planets/planets.router");

const app = express();

// implement middlewares
app.use(cors({ origin: "http://localhost:3000" })); // enable CORS for API access to frontend
app.use(express.json()); // enable JSON parse
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// implement routes
app.use(planetsRouter);
module.exports = app;
