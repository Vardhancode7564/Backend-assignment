const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/server"); // We need to export app from server.js for this to work
const Contact = require("../src/models/contact.model");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Contact.deleteMany({});
});

describe("Contact API Integration Tests", () => {
  const apiKey = process.env.API_KEY || "my-super-secret-api-key-123";

  it("should reject requests without an API key", async () => {
    const res = await request(app).get("/api/v1/contacts");
    expect(res.statusCode).toEqual(401);
  });

  it("should create a new contact", async () => {
    const res = await request(app)
      .post("/api/v1/contacts")
      .set("x-api-key", apiKey)
      .send({
        first_name: "Test",
        last_name: "User",
        email: "test@example.com",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toEqual("test@example.com");
  });
});
