import fastifyPassport from '@fastify/passport';
import { User } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { authorize } from '../../middlewares/auth.strategy';
import logger from '../../utils/logger.util';
import { sanitizeEmail } from '../../utils/string.util';

import { userGetList, login, logout, register, userAssingRoles } from './user.controller';
import { LoginUserInput, RegisterUserInput, schemaUser, UserAssignRolesInput } from './user.schema';

export const routesUser = async (app: FastifyInstance) => {
  logger.info('USER  - routes registered');

  /*********************************************************************************************************************
  MARK: - get user list
   ********************************************************************************************************************/
  app.get(
    '/',
    { preHandler: fastifyPassport.authenticate('jwt', { session: false }), schema: { tags: ['User'] } },
    userGetList,
  );

  /*********************************************************************************************************************
  MARK: - register user
   ********************************************************************************************************************/
  app.post(
    '/register',
    {
      preValidation: async (req: FastifyRequest<{ Body: RegisterUserInput }>) => {
        if (req.body && typeof req.body.email === 'string') {
          req.body.email = sanitizeEmail(req.body.email);
        }
      },
      schema: {
        tags: ['User'],
        body: schemaUser.registerUserSchema,
        response: { 201: schemaUser.registerUserResponseSchema },
      },
    },
    register,
  );

  /*********************************************************************************************************************
  MARK: - login
   ********************************************************************************************************************/
  app.post(
    '/login',
    {
      preValidation: async (req: FastifyRequest<{ Body: LoginUserInput }>) => {
        if (req.body && typeof req.body.email === 'string') {
          req.body.email = sanitizeEmail(req.body.email);
        }
      },
      schema: { tags: ['User'], body: schemaUser.loginSchema, response: { 201: schemaUser.loginResponseSchema } },
    },
    login,
  );

  /*********************************************************************************************************************
  MARK: - logout
   ********************************************************************************************************************/
  app.delete(
    '/logout',
    { preHandler: fastifyPassport.authenticate('jwt', { session: false }), schema: { tags: ['User'] } },
    logout,
  );

  /*********************************************************************************************************************
  MARK: - assign user rolse
   ********************************************************************************************************************/
  app.post(
    '/:id/assign-role',
    {
      preHandler: [
        fastifyPassport.authenticate('jwt', { session: false }),
        async (
          req: FastifyRequest<{ Body: UserAssignRolesInput; user: User; Params: { id: string } }>,
          reply: FastifyReply,
        ) => await authorize(req, reply, ['assign_roles']),
      ],
      schema: {
        tags: ['User'],
        body: schemaUser.userAssingRolesSchema,
        response: { 201: schemaUser.userAssingRolesResonseSchema },
      },
    },
    userAssingRoles,
  );
};
