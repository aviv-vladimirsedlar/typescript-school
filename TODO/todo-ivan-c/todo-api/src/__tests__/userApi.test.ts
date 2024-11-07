import request from "supertest";
import { serverReadyPromise, fastifyInstance, sequelize } from "../server";

beforeAll(async () => {
  await serverReadyPromise;
});

afterAll(async () => {
  await fastifyInstance.close();
  await sequelize.close();
});

describe("User API", () => {
  const password = "password123";
  const name = "Test User";
  it("should register a new user", async () => {
    const email = `test${Date.now()}@example.com`;

    const response = await request(fastifyInstance.server)
      .post("/user/register")
      .send({
        email,
        password,
        name,
      })
      .expect(201);

    expect(response.body).toHaveProperty("userId");
  });

  it("should login an existing user", async () => {
    const email = `test${Date.now()}@example.com`;

    // First, register the user
    await request(fastifyInstance.server)
      .post("/user/register")
      .send({
        email,
        password,
        name,
      })
      .expect(201);

    // Then, login the user
    const response = await request(fastifyInstance.server)
      .post("/user/login")
      .send({
        email,
        password,
      })
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });
});
