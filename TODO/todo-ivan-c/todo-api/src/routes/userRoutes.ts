import { FastifyInstance } from "fastify";
import { User } from "../models/userModel";
import { login, register } from "../controllers/userControllers";
import { LoginRequestBody, RegisterRequestBody } from "../types/requests";

const MIN_PASS_LENGTH = 4;

async function userRoutes(app: FastifyInstance) {
  app.post<{ Body: RegisterRequestBody }>(
    "/register",
    {
      schema: {
        tags: ["User"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: MIN_PASS_LENGTH },
          },
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        reply.status(400).send({ message: "Email address already exists" });
        return;
      }

      await register(request.body, reply);
    }
  );

  app.post<{ Body: LoginRequestBody }>(
    "/login",
    {
      schema: {
        tags: ["User"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: MIN_PASS_LENGTH },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              token: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      await login(request.body, reply);
    }
  );
}

export default userRoutes;
