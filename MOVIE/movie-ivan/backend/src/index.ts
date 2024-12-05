import awsLambdaFastify from '@fastify/aws-lambda';
import cors from '@fastify/cors';
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

  // CORS
  app.register(cors, { origin: true, credentials: true });

  // Authorization strategy and other plugins
  registerAuthorizationStrategy(app);

  // Register routes, schemas, and Swagger
  registerSwagger(app);
  registerRoutes(app);
  registerSchema(app);

  return app;
}

const app = buildServer();

async function startServer() {
  logger.info('Starting server on ENV: ', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'local') {
    await app.listen({ host: HOST, port: parseInt(PORT) });
    logger.info(`Server started successfully: http://${HOST}:${PORT}`);
    logger.info(`Swagger:                     http://${HOST}:${PORT}/docs`);

    const listeners = ['SIGINT', 'SIGTERM'];
    listeners.forEach((signal) => {
      process.on(signal, async () => {
        await app.close();
        process.exit(0);
      });
    });
  } else {
    logger.info('Server start not required for AWS Lambda');
  }
}

startServer();

const proxy = awsLambdaFastify(app);

export const handler = proxy;
