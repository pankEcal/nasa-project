const express = require("express");

const planetsRouter = express.Router();
const { httpGetAllPlanets } = require("./planets.controller.js");

planetsRouter.get("/", httpGetAllPlanets);

module.exports = planetsRouter;
