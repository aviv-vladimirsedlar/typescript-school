import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

import { getAuthorizationStrategy } from '../../config/constants';
import prisma from '../../config/prisma.db';
import { UserRole } from '../../types/user.types';
import logger from '../../utils/logger.util';
import { extractAndSanitizeRoles } from '../../utils/string.util';

import { LoginUserInput, RegisterUserInput, UserAssignRolesInput } from './user.schema';

export const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-strong-secret';

/***********************************************************************************************************************
 MARK: - register user
 **********************************************************************************************************************/
export async function register(req: FastifyRequest<{ Body: RegisterUserInput }>, reply: FastifyReply) {
  const { email, password, firstName, lastName } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    return reply.code(401).send({ message: 'User already exists with this email' });
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const role = await prisma.role.findFirst({ where: { name: 'user' } });
    if (!role) {
      return reply.code(404).send({ message: 'Role "user" not found' });
    }

    const user = await prisma.user.create({
      data: { password: hash, email, firstName, lastName },
      include: { roles: { include: { role: true } } },
    });

    const userRole = await prisma.userRole.create({
      data: { userId: user.id, roleId: role.id },
      include: { role: true },
    });
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: [{ id: userRole.id, role: { name: userRole.role.name } }],
    };

    // USING COOKIE
    const authorizationStrategy = getAuthorizationStrategy();
    if (authorizationStrategy === 'cookie') {
      const payload = { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      reply.setCookie('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only set to true in production
        maxAge: 3600 * 1000, // 1 hour
      });
      reply.code(201).send({ user: userResponse });
    } else {
      // USING JWT
      const payload = {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: extractAndSanitizeRoles(user.roles as unknown as UserRole[]),
      };
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      reply.code(201).send({ accessToken, user: userResponse });
    }
  } catch (e) {
    logger.error('ERROR "register": ', e);
    return reply.code(500).send(e);
  }
}

/***********************************************************************************************************************
 MARK: - get current user
 **********************************************************************************************************************/
export async function useGetCurrentUser(req: FastifyRequest, reply: FastifyReply) {
  return reply.code(200).send(req.user);
}

/***********************************************************************************************************************
 MARK: - get users
 **********************************************************************************************************************/
export async function userGetList(
  req: FastifyRequest<{ Querystring: { page?: string; limit?: string } }>,
  reply: FastifyReply,
) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let data = await prisma.user.findMany({
    skip: offset,
    take: limit,
    orderBy: { firstName: 'asc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      roles: { select: { role: { select: { name: true } } } },
    },
  });
  data = data.map((user) => ({
    ...user,
    roles: extractAndSanitizeRoles(user.roles as unknown as UserRole[]),
  }));

  const totalCount = await prisma.user.count(); // Total count for pagination metadata
  const totalPages = Math.ceil(totalCount / limit);

  return reply.code(200).send({
    data,
    meta: { page, limit, totalPages, totalCount },
  });
}

/***********************************************************************************************************************
 MARK: - login
 **********************************************************************************************************************/
export const login = async (req: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: { include: { roleAllowed: true } } } } },
  });
  if (!user) {
    return reply.code(404).send({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!user || !isMatch) {
    return reply.code(401).send({ message: 'Invalid email or password' });
  }

  if (!user) {
    return reply.status(401).send({ message: 'Invalid email or password' });
  }
  const userResponse = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: extractAndSanitizeRoles(user.roles as unknown as UserRole[]),
  };

  // USING COOKIE
  const authorizationStrategy = getAuthorizationStrategy();
  if (authorizationStrategy === 'cookie') {
    const payload = { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    reply.setCookie('access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only set to true in production
      maxAge: 3600 * 1000, // 1 hour
    });
    reply.code(200).send({ user: userResponse });
  } else {
    // USING JWT
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: extractAndSanitizeRoles(user.roles as unknown as UserRole[]),
    };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    reply.code(200).send({ accessToken, user: userResponse });
  }
};

/***********************************************************************************************************************
 MARK: - logout
 **********************************************************************************************************************/
export async function logout(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token');
  return reply.code(201).send({ message: 'Logout successful' });
}

/***********************************************************************************************************************
 MARK: - user assing roles
 **********************************************************************************************************************/
export async function userAssingRoles(
  req: FastifyRequest<{ Body: UserAssignRolesInput; Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { roles: rolesInput } = req.body;
  const { id: userId } = req.params;

  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: { include: { roleAllowed: true } } } } },
  });
  if (!user) {
    return reply.code(404).send({ message: 'User not found' });
  }

  const userRoles = user?.roles.map((role) => role.role.name);
  const rolesInputFiltered = rolesInput.filter((role: string) => !userRoles?.includes(role));

  if (!rolesInputFiltered.length) {
    return reply.code(401).send({ message: 'User already has all of the roles' });
  }

  const roles = await prisma.role.findMany({ where: { name: { in: rolesInputFiltered } } });
  try {
    await prisma.userRole.createMany({
      data: roles.map((role) => ({ userId, roleId: role.id })),
    });

    user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: { include: { roleAllowed: true } } } } },
    });
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: extractAndSanitizeRoles(user.roles as unknown as UserRole[]),
    };
    return reply.code(201).send(userResponse);
  } catch (e) {
    logger.error('ERROR "userAssingRoles": ', e);
    return reply.code(500).send(e);
  }
}
