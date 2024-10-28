import fastifyPassport from '@fastify/passport';
import { User } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { authorize } from '../../middlewares/auth.strategy';

import { createMovie, deleteMovie, getMovie, getMovies, updateMovie } from './movie.controller';
import { CreateMovieInput, schemaMovie, UpdateMovieInput } from './movie.schema';

export const routesMovie = async (app: FastifyInstance) => {
  app.get(
    '/',
    { preHandler: fastifyPassport.authenticate('jwt', { session: false }), schema: { tags: ['Movie'] } },
    getMovies,
  );

  app.get(
    '/:id',
    {
      preHandler: fastifyPassport.authenticate('jwt', { session: false }),
      schema: { tags: ['Movie'], response: { 201: schemaMovie.getMovieResponseSchema } },
    },
    getMovie,
  );

  app.post(
    '/create',
    {
      preHandler: [
        fastifyPassport.authenticate('jwt', { session: false }),
        async (req: FastifyRequest<{ Body: CreateMovieInput; user: User }>, reply: FastifyReply) =>
          await authorize(req, reply, ['create_movie']),
      ],
      schema: {
        tags: ['Movie'],
        body: schemaMovie.createMovieSchema,
        response: { 201: schemaMovie.createMovieResponseSchema },
      },
    },
    createMovie,
  );

  app.put(
    '/:id',
    {
      preHandler: [
        fastifyPassport.authenticate('jwt', { session: false }),
        async (req: FastifyRequest<{ Body: UpdateMovieInput; Params: { id: string } }>, reply: FastifyReply) =>
          await authorize(req, reply, ['edit_movie', 'edit_own_movie']),
      ],
      schema: {
        tags: ['Movie'],
        body: schemaMovie.updateMovieSchema,
        response: { 201: schemaMovie.updateMovieResponseSchema },
      },
    },
    updateMovie,
  );

  app.delete(
    '/:id',
    {
      preHandler: [
        fastifyPassport.authenticate('jwt', { session: false }),
        async (req: FastifyRequest<{ Body: UpdateMovieInput; Params: { id: string } }>, reply: FastifyReply) =>
          await authorize(req, reply, ['delete_movie', 'delete_own_movie']),
      ],
      schema: { tags: ['Movie'], response: { 201: schemaMovie.deleteMovieResponseSchema } },
    },
    deleteMovie,
  );

  app.log.info('movie routes registered');
};
