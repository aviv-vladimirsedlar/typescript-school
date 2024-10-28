import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

import prisma from '../../config/prisma.db';

import { LoginUserInput, RegisterUserInput, UserAssignRolesInput } from './user.schema';

export const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-strong-secret';
const authorizationStrategy = process.env.AUTHORIZATION_STRATEGY || 'cookie';

const extractAndSanitizeRoles = (roles: { id: string; role: { name: string } }[]) => {
  return [...roles]
    .sort((a, b) => {
      if (a.role.name < b.role.name) {
        return -1;
      }
      if (a.role.name > b.role.name) {
        return 1;
      }
      return 0;
    })
    .map((role) => ({ id: role.id, role: { name: role.role.name } }));
};

/***********************************************************************************************************************
 * REGISTER USER
 **********************************************************************************************************************/
export async function register(req: FastifyRequest<{ Body: RegisterUserInput }>, reply: FastifyReply) {
  const { email, password, firstName, lastName } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    return reply.code(401).send({
      message: 'User already exists with this email',
    });
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const role = await prisma.role.findFirst({ where: { name: 'user' } });
    console.log(role);
    if (!role) {
      return reply.code(404).send({ message: 'Role "user" not found' });
    }

    const user = await prisma.user.create({
      data: { password: hash, email, firstName, lastName },
      include: { roles: { include: { role: true } } },
    });

    console.log('data: ', { userId: user.id, roleId: role.id });
    const userRole = await prisma.userRole.create({
      data: { userId: user.id, roleId: role.id },
      include: { role: true },
    });
    console.log('userRole: ', userRole);

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: [{ id: userRole.id, role: { name: userRole.role.name } }],
    };
    console.log('userResponse: ', userResponse);
    return reply.code(201).send(userResponse);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

/***********************************************************************************************************************
 * REGISTER USER
 **********************************************************************************************************************/
export async function userAssingRole(req: FastifyRequest<{ Body: RegisterUserInput }>, reply: FastifyReply) {
  const { email, password, firstName, lastName } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return reply.code(401).send({
      message: 'User already exists with this email',
    });
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { password: hash, email, firstName, lastName },
      include: { roles: { include: { role: true } } },
    });

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: extractAndSanitizeRoles(user.roles),
    };
    return reply.code(201).send(userResponse);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

/***********************************************************************************************************************
 * GET USERS
 **********************************************************************************************************************/
export async function userGetList(req: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true },
  });
  return reply.code(200).send(users);
}

/***********************************************************************************************************************
 * LOGIN
 **********************************************************************************************************************/
export const login = async (req: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } },
  });
  if (!user) {
    return reply.code(404).send({
      message: 'User not found',
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!user || !isMatch) {
    return reply.code(401).send({
      message: 'Invalid email or password',
    });
  }

  if (!user) {
    return reply.status(401).send({ message: 'Invalid email or password' });
  }
  const userResponse = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: extractAndSanitizeRoles(user.roles),
  };

  // USING COOKIE
  if (authorizationStrategy === 'cookie') {
    const payload = { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    reply.setCookie('access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only set to true in production
      maxAge: 3600 * 1000, // 1 hour
    });
    reply.send({ user: userResponse });
  } else {
    // USING JWT
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: extractAndSanitizeRoles(user.roles),
    };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    reply.send({ accessToken, user: userResponse });
  }
};

/***********************************************************************************************************************
 * LOGOUT
 **********************************************************************************************************************/
export async function logout(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token');
  return reply.send({ message: 'Logout successful' });
}

/***********************************************************************************************************************
 * USER ASSING ROLES
 **********************************************************************************************************************/

export async function userAssingRoles(
  req: FastifyRequest<{ Body: UserAssignRolesInput; Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { roleId: roleIds } = req.body;
  const { id: userId } = req.params;

  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } } },
  });
  if (!user) {
    return reply.code(404).send({ message: 'User not found' });
  }

  const userRoleIds = user?.roles.map((role) => role.roleId);
  const rolesFiltered = roleIds.filter((roleId) => !userRoleIds?.includes(roleId));

  console.log('rolesFiltered: ', rolesFiltered);
  if (!rolesFiltered.length) {
    return reply.code(401).send({ message: 'User already has all of the roles' });
  }

  const roles = await prisma.role.findMany({ where: { id: { in: rolesFiltered } } });
  try {
    await prisma.userRole.createMany({
      data: roles.map((role) => ({ userId, roleId: role.id })),
    });

    user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: extractAndSanitizeRoles(user.roles),
    };
    return reply.code(201).send(userResponse);
  } catch (e) {
    return reply.code(500).send(e);
  }
}