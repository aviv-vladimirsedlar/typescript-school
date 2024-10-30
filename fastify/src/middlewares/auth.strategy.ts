import 'reflect-metadata';
import * as fs from 'fs';
import path from 'path';

import fastifyPassport from '@fastify/passport';
import fastifySecureSession from '@fastify/secure-session';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import { getAuthorizationStrategy } from '../config/constants';
import prisma from '../config/prisma.db';
import { PassportUser } from '../types/declarations';

const authorizationStrategy = getAuthorizationStrategy();

export const registerAuthorizationStrategy = (app: FastifyInstance) => {
  if (authorizationStrategy === 'cookie') {
    app.register(fastifySecureSession, {
      key: fs.readFileSync(path.join(__dirname, '../../secretKeyPassport')),
      cookie: {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600 * 1000, // 1 hour
      },
    });
  } else {
    app.register(fastifySecureSession, { key: fs.readFileSync(path.join(__dirname, '../../secretKeyPassport')) });
  }

  const cookieExtractor = (req: FastifyRequest) => {
    return req.cookies?.access_token || null;
  };

  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());

  fastifyPassport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: authorizationStrategy === 'cookie' ? cookieExtractor : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'a-very-strong-secret',
      },
      async (payload, done) => {
        const user = {
          id: payload.sub,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
        };
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      },
    ),
  );
};

export const authorize = async (req: FastifyRequest, reply: FastifyReply, actions: string[]) => {
  const user = req.user as PassportUser;

  if (!user?.id) {
    return reply.code(404).send({ message: 'User not found' });
  }

  const userId = user.id;

  if (!userId) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  // Get user's roles and permissions
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: { include: { roleAllowed: true } } },
  });

  // Extract allowed actions from user's roles
  const userActions = new Set<string>();
  userRoles.forEach((userRole) => {
    userRole.role.roleAllowed.forEach((permission) => {
      userActions.add(permission.action);
    });
  });

  // Check if any of the required actions is allowed
  const hasPermission = actions.some((action) => userActions.has(action));
  if (!hasPermission) {
    return reply.code(403).send({ message: `Forbidden, missing permissions to '${actions.join(', ')}'` });
  }
};

export const isUserAdmin = async (user: PassportUser | undefined) => {
  if (!user) {
    return false;
  }
  const userRoles = await prisma.userRole.findMany({
    where: { userId: user.id },
    include: { role: { include: { roleAllowed: true } } },
  });
  const check = userRoles.some((userRole) => userRole.role.name === 'admin');
  return check;
};
