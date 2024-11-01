import request from "supertest";
import app from "../app";

describe("User API", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      })
      .expect(201);

    expect(response.body).toHaveProperty("userId");
  });

  it("should login an existing user", async () => {
    // First, register the user
    await request(app)
      .post("/user/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      })
      .expect(201);

    // Then, login the user
    const response = await request(app)
      .post("/user/login")
      .send({
        email: "test@example.com",
        password: "password123",
      })
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });
});
