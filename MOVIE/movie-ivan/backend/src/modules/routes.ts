import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { routesMovie } from './movie/movie.routes';
import { routesUser } from './user/user.route';

export const registerRoutes = (app: FastifyInstance) => {
  app.get('*', (_: FastifyRequest, reply: FastifyReply) => reply.redirect('/docs'));
  app.register(routesMovie, { prefix: 'api/movies' });
  app.register(routesUser, { prefix: 'api/users' });
};
