import { FastifyInstance } from "fastify";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controllers/todoControllers";
import { isAuth } from "../middleware/isAuth";
import {
  CreateTodoRequestBody,
  UpdateTodoRequestBody,
} from "../types/requests";
import {
  CreateTodoRequest,
  UpdateTodoRequest,
  DeleteTodoRequest,
  GetTodosRequest,
} from "../types/requests";

async function todoRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateTodoRequestBody }>(
    "/",
    {
      preHandler: [isAuth],
      schema: {
        tags: ["Todo"],
        body: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string", minLength: 1 },
            description: { type: "string", minLength: 1 },
          },
        },
      },
    },
    async (request, reply) => {
      await createTodo(request as CreateTodoRequest, reply);
    }
  );

  app.put<{ Params: { todoId: string }; Body: UpdateTodoRequestBody }>(
    "/:todoId",
    {
      preHandler: [isAuth],
      schema: {
        tags: ["Todo"],
        body: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string", minLength: 1 },
            description: { type: "string", minLength: 1 },
          },
        },
      },
    },
    async (request, reply) => {
      await updateTodo(request as UpdateTodoRequest, reply);
    }
  );

  app.delete<{ Params: { todoId: string } }>(
    "/:todoId",
    {
      preHandler: [isAuth],
      schema: {
        tags: ["Todo"],
      },
    },
    async (request, reply) => {
      await deleteTodo(request as DeleteTodoRequest, reply);
    }
  );

  app.get(
    "/",
    {
      preHandler: [isAuth],
      schema: {
        tags: ["Todo"],
      },
    },
    async (request, reply) => {
      await getTodos(request as GetTodosRequest, reply);
    }
  );
}

export default todoRoutes;
