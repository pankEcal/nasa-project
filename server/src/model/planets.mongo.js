const mongoose = require("mongoose");

const planetsSchema = new mongoose.Schema({
	keplerName: {
		type: String,
		required: true,
	},
});

// connects planetsSchema with the "planets" collection
module.exports = mongoose.model("Planet", planetsSchema);
