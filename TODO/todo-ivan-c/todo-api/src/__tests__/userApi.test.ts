import request from "supertest";
import app from "../app";
import { Server } from "http";
import { sequelize, serverReadyPromise } from "../server";
import logger from "../config/logger";

let server: Server;

beforeAll(async () => {
  server = await serverReadyPromise;
});

afterAll(async () => {
  if (server) {
    await server.close();
  }
  await sequelize.close();
});

describe("User API", () => {
  it("should register a new user", async () => {
    const email = `test${Date.now()}@example.com`;
    logger.debug(`Created test user with email: ${email}`);
    const response = await request(app)
      .post("/user/register")
      .send({
        email,
        password: "password123",
        name: "Test User",
      })
      .expect(201);

    expect(response.body).toHaveProperty("userId");
  });

  it("should login an existing user", async () => {
    const email = `test${Date.now()}@example.com`;
    logger.debug(`Created test user with email: ${email}`);
    // First, register the user
    await request(app)
      .post("/user/register")
      .send({
        email,
        password: "password123",
        name: "Test User",
      })
      .expect(201);

    // Then, login the user
    const response = await request(app)
      .post("/user/login")
      .send({
        email,
        password: "password123",
      })
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });
});
