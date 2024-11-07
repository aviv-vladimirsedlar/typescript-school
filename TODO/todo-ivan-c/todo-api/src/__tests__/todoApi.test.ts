import request from "supertest";
import { serverReadyPromise, fastifyInstance, sequelize } from "../server";

beforeAll(async () => {
  await serverReadyPromise;
});

afterAll(async () => {
  await fastifyInstance.close();
  await sequelize.close();
});

let token: string;
let userId: number;

beforeEach(async () => {
  const email = `test${Date.now()}@example.com`;
  const password = "password123";

  // Register a user and get a token
  const response = await request(fastifyInstance.server)
    .post("/user/register")
    .send({
      email,
      password,
      name: "Test User",
    })
    .expect(201);

  userId = response.body.userId;

  const loginResponse = await request(fastifyInstance.server)
    .post("/user/login")
    .send({
      email,
      password,
    })
    .expect(200);

  token = loginResponse.body.token;
});

const createTodo = async (title: string, description: string) => {
  const response = await request(fastifyInstance.server)
    .post("/todos")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title,
      description,
    })
    .expect(201);

  return response.body;
};

describe("Todo API", () => {
  it("should create a new todo", async () => {
    const todo = await createTodo("Test Todo", "Test Description");

    expect(todo).toHaveProperty("id");
    expect(todo.title).toBe("Test Todo");
    expect(todo.description).toBe("Test Description");
  });

  it("should update an existing todo", async () => {
    const todo = await createTodo("Test Todo", "Test Description");

    const todoId = todo.id;

    // Then, update the todo
    const updateResponse = await request(fastifyInstance.server)
      .put(`/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Todo",
        description: "Updated Description",
      })
      .expect(200);

    expect(updateResponse.body.title).toBe("Updated Todo");
    expect(updateResponse.body.description).toBe("Updated Description");
  });

  it("should delete an existing todo", async () => {
    const todo = await createTodo("Test Todo", "Test Description");

    const todoId = todo.id;

    // Then, delete the todo
    const deleteResponse = await request(fastifyInstance.server)
      .delete(`/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  it("should fetch all todos for the user", async () => {
    await createTodo("Test Todo 1", "Test Description 1");

    await createTodo("Test Todo 2", "Test Description 2");

    const response = await request(fastifyInstance.server)
      .get("/todos")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toHaveProperty("title");
    expect(response.body.data[0]).toHaveProperty("description");
  });
});
