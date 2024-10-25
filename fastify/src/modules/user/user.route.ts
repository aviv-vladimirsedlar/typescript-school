import fastifyPassport from '@fastify/passport'
import { FastifyInstance } from 'fastify'

import { $ref } from '../schema'

import { createUser, getUsers, login, logout } from './user.controller'

export const routesUser = async (app: FastifyInstance) => {
  app.get('/', { preValidation: fastifyPassport.authenticate('jwt', { session: false }) }, getUsers)

  app.post(
    '/register',
    { schema: { body: $ref('createUserSchema'), response: { 201: $ref('createUserResponseSchema') } } },
    createUser,
  )

  app.post('/login', { schema: { body: $ref('loginSchema'), response: { 201: $ref('loginResponseSchema') } } }, login)

  app.delete('/logout', { preValidation: fastifyPassport.authenticate('jwt', { session: false }) }, logout)

  app.log.info('user routes registered')
}
