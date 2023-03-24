const http = require("http");

const app = require("./app.js");
const { loadPlanetsData } = require("./model/planets.model.js");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  // process the data asynchronously using promise and return the values after completion
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`sever is listening on PORT ${PORT}`);
  });
}

startServer();
