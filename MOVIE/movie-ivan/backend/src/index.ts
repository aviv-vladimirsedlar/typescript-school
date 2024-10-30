import 'reflect-metadata';
import * as dotenv from 'dotenv';
import Fastify from 'fastify';

import { registerSwagger } from './config/swagger';
import { registerAuthorizationStrategy } from './middlewares/auth.strategy';
import { registerRoutes } from './modules/routes';
import { registerSchema } from './modules/schema';
import winstonLogger from './plugins/winston-logger.plugin';
import logger from './utils/logger.util';

dotenv.config();

const { PORT = '19200' } = process.env;
const HOST = 'localhost';

// Factory function to build the Fastify server instance
export function buildServer() {
  const app = Fastify();
  app.register(winstonLogger);

  // Authorization strategy and other plugins
  registerAuthorizationStrategy(app);

  // Register routes, schemas, and Swagger
  registerSwagger(app);
  registerRoutes(app);
  registerSchema(app);

  return app;
}

// Function to start the server in production
async function startServer() {
  const app = buildServer();

  await app.listen({ host: HOST, port: parseInt(PORT) });

  const listeners = ['SIGINT', 'SIGTERM'];
  listeners.forEach((signal) => {
    process.on(signal, async () => {
      await app.close();
      process.exit(0);
    });
  });
}

if (require.main === module) {
  startServer()
    .then(() => {
      logger.info(`Server started successfully: http://${HOST}:${PORT}`);
      logger.info(`Swagger:                     http://${HOST}:${PORT}/docs`);
    })
    .catch((err) => {
      logger.error('Error starting server:', err);
      process.exit(1);
    });
}
