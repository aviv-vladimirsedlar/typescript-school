import fastifyPassport from '@fastify/passport'
import { FastifyInstance } from 'fastify'

import { $ref } from '../schema'

import { createMovie, deleteMovie, getMovie, getMovies, updateMovie } from './movie.controller'

export const routesMovie = async (app: FastifyInstance) => {
  app.get('/', { preValidation: fastifyPassport.authenticate('jwt', { session: false }) }, getMovies)

  app.post(
    '/create',
    {
      preValidation: fastifyPassport.authenticate('jwt', { session: false }),
      schema: { body: $ref('createMovieSchema'), response: { 201: $ref('createMovieResponseSchema') } },
    },
    createMovie,
  )

  app.put(
    '/:id/update',
    {
      preValidation: fastifyPassport.authenticate('jwt', { session: false }),
      schema: { body: $ref('updateMovieSchema'), response: { 201: $ref('updateMovieResponseSchema') } },
    },
    updateMovie,
  )

  app.get(
    '/:id',
    {
      preValidation: fastifyPassport.authenticate('jwt', { session: false }),
      schema: { response: { 201: $ref('getMovieResponseSchema') } },
    },
    getMovie,
  )

  app.delete(
    '/:id',
    {
      preValidation: fastifyPassport.authenticate('jwt', { session: false }),
      schema: { response: { 201: $ref('deleteMovieResponseSchema') } },
    },
    deleteMovie,
  )

  app.log.info('movie routes registered')
}
