import fastify from "fastify";
import fastifyCors from "@fastify/cors";

import { AppError } from "./errors/appError";
import auth from "./routes/userRoutes";
import todo from "./routes/todoRoutes";
import { registerSwagger } from "./config/swagger";
import loggerConfig from "./config/logger";

const app = fastify({
  logger: loggerConfig,
});

app.register(fastifyCors, {
  origin: "*",
  methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

registerSwagger(app);

app.register(auth, { prefix: "/user" });
app.register(todo, { prefix: "/todos" });

app.setErrorHandler((error: AppError, _, reply) => {
  app.log.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  reply.status(status).send({ message });
});

export default app;
