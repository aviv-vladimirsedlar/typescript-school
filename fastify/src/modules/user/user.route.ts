import fastifyPassport from '@fastify/passport';
import { User } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { sanitizeEmail } from '../../common/util/string.util';
import { authorize } from '../../middlewares/auth.strategy';
import { $ref } from '../schema';

import { userGetList, login, logout, register, userAssingRoles } from './user.controller';
import { LoginUserInput, RegisterUserInput, UserAssignRolesInput } from './user.schema';

export const routesUser = async (app: FastifyInstance) => {
  app.get('/', { preHandler: fastifyPassport.authenticate('jwt', { session: false }) }, userGetList);

  app.post(
    '/register',
    {
      preValidation: async (req: FastifyRequest<{ Body: RegisterUserInput }>) => {
        if (req.body && typeof req.body.email === 'string') {
          req.body.email = sanitizeEmail(req.body.email);
        }
      },
      schema: { body: $ref('registerUserSchema'), response: { 201: $ref('registerUserResponseSchema') } },
    },
    register,
  );

  app.post(
    '/login',
    {
      preValidation: async (req: FastifyRequest<{ Body: LoginUserInput }>) => {
        if (req.body && typeof req.body.email === 'string') {
          req.body.email = sanitizeEmail(req.body.email);
        }
      },
      schema: { body: $ref('loginSchema'), response: { 201: $ref('loginResponseSchema') } },
    },
    login,
  );

  app.delete('/logout', { preHandler: fastifyPassport.authenticate('jwt', { session: false }) }, logout);

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
      schema: { body: $ref('userAssingRolesSchema'), response: { 201: $ref('userAssingRolesResonseSchema') } },
    },
    userAssingRoles,
  );

  app.log.info('USER - routes registered');
};
