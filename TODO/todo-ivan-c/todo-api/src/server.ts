import { FastifyInstance } from "fastify";
import app from "./app";
import { sequelize } from "./config/database";

const PORT = parseInt(process.env.PORT as string, 10) || 8080;

let fastifyInstance: FastifyInstance;

// Create a promise that resolves when both the server and database are ready
export const serverReadyPromise: Promise<FastifyInstance> = sequelize
  .sync()
  .then(() => {
    app.log.info("Database synced");
    return app.listen({ port: PORT });
  })
  .then(() => {
    fastifyInstance = app;
    return fastifyInstance;
  })
  .catch((error) => {
    app.log.error(`Error during server startup: ${error}`);
    throw error;
  });

export { fastifyInstance, sequelize };
