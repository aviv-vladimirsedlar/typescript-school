import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";

export const registerSwagger = async (app: FastifyInstance) => {
  app.register(swagger, {
    swagger: {
      info: {
        title: "TODO API",
        description: "API documentation",
        version: "1.0.0",
      },
      tags: [{ name: "User" }, { name: "Todo" }],
    },
  });
  app.register(swaggerUi, {
    routePrefix: "/docs",
  });
};
