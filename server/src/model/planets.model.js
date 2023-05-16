const { parse } = require("csv-parse");
const path = require("path");
const fs = require("fs");

// importing planets model from mongo
const planets = require("./planets.mongo");

// determine habitable planet based on criterias:
// 1. koi_disposition: 'CONFIRMED' (is confirmed to be existing)
// 2. koi_insol > 0.36 && koi_insol < 1.11 (defines that the light and heat is suitable enough like in earth)
// 3. koi_prad < 1.6  upper of limit of size of the planet as compared to earth
const isHabitablePlanet = (planet) => {
	const isHabitable =
		planet["koi_disposition"] === "CONFIRMED" &&
		planet["koi_insol"] > 0.36 &&
		planet["koi_insol"] < 1.11 &&
		planet["koi_prad"] < 1.6;

	return isHabitable;
};

function loadPlanetsData() {
	// use promise to asynchronously process and return the data
	return new Promise((resolve, reject) => {
		// create stream based on the type of event. In this case, data
		// chaining event handlers
		fs.createReadStream(
			path.join(__dirname, "..", "..", "data", "kepler_data.csv")
		)
			// piping data to parse. i.e getting readable data and process it and make it writeable as meaningful data
			.pipe(
				parse({
					comment: "#", // to indicate comments. (line starting with a '#')
					columns: true, // to get each csv field as a seprate line
				})
			)
			// processing the received data as a column
			.on("data", async (planet) => {
				// the data received are buffers only and may not have any particular usage.
				// The buffer has to be parsed in order to get meaningful data

				if (isHabitablePlanet(planet)) {
					savePlanet(planet);
				}
			})
			.on("error", (error) => {
				console.log("some error occured!!");
				// indicate promise is not resolved
				reject(error);
			})
			.on("end", async () => {
				// get habitable planets (using await as it's a promise)
				console.log(`habitable planets:  ${(await getAllPlanets()).length}`);

				// indicate promise is resolved after end of the processing of the data
				resolve();
			});
	});
}

async function savePlanet(planet) {
	try {
		// will perform updateOne action. (order matters)
		// first option object acts as a filter
		// second option object update into database
		// third object option performs upsert operation. i.e:
		await planets.updateOne(
			{
				keplerName: planet.kepler_name,
			},
			{
				keplerName: planet.kepler_name,
			},
			{
				upsert: true,
			}
		);
	} catch (error) {
		console.log(`couldn't save planet. ${error}`);
	}
}

async function getAllPlanets() {
	// with second argument, removing the unrequired fields "_id" and "__v" while getting data from mongodb collection
	return await planets.find(
		{},
		{
			_id: 0,
			__v: 0,
		}
	);
}

module.exports = { getAllPlanets, loadPlanetsData };
