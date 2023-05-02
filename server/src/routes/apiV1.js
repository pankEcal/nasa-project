const express = require("express");

const planetsRouter = require("../routes/planets/planets.router");
const launchesRouter = require("../routes/launches/launches.router");

const apiV1 = express.Router();

apiV1.use("/planets", planetsRouter);
apiV1.use("/launches", launchesRouter);

module.exports = apiV1;
