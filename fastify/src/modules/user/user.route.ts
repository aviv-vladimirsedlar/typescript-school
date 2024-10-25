import fastifyPassport from '@fastify/passport'
import { FastifyInstance } from 'fastify'

import { createUser, getUsers, login, logout } from './user.controller'
import { $ref, userSchemas } from './user.schema'

const userRoutes = async (app: FastifyInstance) => {
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

export const registerUserSchemasAndRoutes = (app: FastifyInstance) => {
  for (const schema of [...userSchemas]) {
    app.addSchema(schema)
  }
  app.register(userRoutes, { prefix: 'api/users' })
}
