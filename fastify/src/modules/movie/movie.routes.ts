import fastifyPassport from '@fastify/passport';
import { User } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { authorize } from '../../middlewares/auth.strategy';
import { $ref } from '../schema';

import { createMovie, deleteMovie, getMovie, getMovies, updateMovie } from './movie.controller';
import { CreateMovieInput, UpdateMovieInput } from './movie.schema';

export const routesMovie = async (app: FastifyInstance) => {
  app.get('/', { preHandler: fastifyPassport.authenticate('jwt', { session: false }) }, getMovies);

  app.post(
    '/create',
    {
      preHandler: [
        fastifyPassport.authenticate('jwt', { session: false }),
        async (req: FastifyRequest<{ Body: CreateMovieInput; user: User }>, reply: FastifyReply) =>
          await authorize(req, reply, ['create_movie']),
      ],
      schema: { body: $ref('createMovieSchema'), response: { 201: $ref('createMovieResponseSchema') } },
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
      schema: { body: $ref('updateMovieSchema'), response: { 201: $ref('updateMovieResponseSchema') } },
    },
    updateMovie,
  );

  app.get(
    '/:id',
    {
      preHandler: fastifyPassport.authenticate('jwt', { session: false }),
      schema: { response: { 201: $ref('getMovieResponseSchema') } },
    },
    getMovie,
  );

  app.delete(
    '/:id',
    {
      preHandler: [
        fastifyPassport.authenticate('jwt', { session: false }),
        async (req: FastifyRequest<{ Body: UpdateMovieInput; Params: { id: string } }>, reply: FastifyReply) =>
          await authorize(req, reply, ['delete_movie', 'delete_own_movie']),
      ],
      schema: { response: { 201: $ref('deleteMovieResponseSchema') } },
    },
    deleteMovie,
  );

  app.log.info('movie routes registered');
};
