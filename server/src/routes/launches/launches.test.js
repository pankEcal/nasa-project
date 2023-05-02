const request = require("supertest");
const app = require("../../app");
const { mongooseConnect, mongooseDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
	beforeAll(async () => {
		await mongooseConnect();
	});

	afterAll(async () => {
		await mongooseDisconnect();
	});

	describe("Test GET /launches", () => {
		test("It should respond with 200 success", async () => {
			const response = await request(app)
				.get("/v1/launches")
				.expect("Content-Type", /json/)
				.expect(200);
		});
	});

	describe("Test POST /launches", () => {
		const completeLaunchData = {
			mission: "New launch in May 2",
			rocket: "NCC helo",
			target: "Kepler-296 A f",
			launchDate: "January 14, 2038",
		};

		const launchDataWithoutDate = {
			mission: "New launch in May 2",
			rocket: "NCC helo",
			target: "Kepler-296 A f",
		};

		const launchDataWithInvalidDate = {
			mission: "Helo, kecha",
			rocket: "NCC helo",
			target: "kepler-128",
			launchDate: "hello",
		};

		test("It should respond with 201 created", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(completeLaunchData)
				.expect("Content-Type", /json/)
				.expect(201);

			const requestDate = new Date(completeLaunchData.launchDate).valueOf();
			const responseDate = new Date(response.body.launchDate).valueOf();

			expect(responseDate).toBe(requestDate);
			expect(response.body).toMatchObject(launchDataWithoutDate);
		});

		test("It should catch missing required properties", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(launchDataWithoutDate)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toStrictEqual({
				error: "missing required launch data",
			});
		});

		test("It should catch invalid dates", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(launchDataWithInvalidDate)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toStrictEqual({
				error: "Invalid launch date",
			});
		});
	});
});
