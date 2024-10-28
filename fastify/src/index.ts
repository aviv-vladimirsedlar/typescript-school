import 'reflect-metadata';

import * as dotenv from 'dotenv';
import Fastify from 'fastify';

import { registerSwagger } from './config/swagger';
import { registerAuthorizationStrategy } from './middlewares/auth.strategy';
import { routesMovie } from './modules/movie/movie.routes';
import { registerSchema } from './modules/schema';
import { routesUser } from './modules/user/user.route';

dotenv.config();

async function startServer() {
  const app = Fastify({ logger: true });

  // AUTHORIZATION STRATEGY
  registerAuthorizationStrategy(app);

  // REGISTER SWAGGER AND SCHEMA
  registerSwagger(app);
  registerSchema(app);

  // REGISTER ROUTES
  app.register(routesMovie, { prefix: 'api/movies' });
  app.register(routesUser, { prefix: 'api/users' });

  const { PORT = '19200' } = process.env;
  await app.listen({ host: '0.0.0.0', port: parseInt(PORT) });

  const listeners = ['SIGINT', 'SIGTERM'];
  listeners.forEach((signal) => {
    process.on(signal, async () => {
      await app.close();
      process.exit(0);
    });
  });
}

startServer()
  .then(() => {
    console.log(`Server started successfully at ${process.env.PORT}`);
  })
  .catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
  });