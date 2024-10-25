import bcrypt from 'bcrypt'
import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

import prisma from '../../config/prisma.db'

import { CreateUserInput, LoginUserInput } from './user.schema'

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-strong-secret'
const authorizationStrategy = process.env.AUTHORIZATION_STRATEGY || 'cookie'

export async function createUser(req: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
  const { password, email, firstName, lastName } = req.body
  const user = await prisma.user.findUnique({
    where: { email: email },
  })
  if (user) {
    return reply.code(401).send({
      message: 'User already exists with this email',
    })
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: { password: hash, email, firstName, lastName },
    })
    return reply.code(201).send(user)
  } catch (e) {
    return reply.code(500).send(e)
  }
}

export const login = async (req: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string }

  const user = await prisma.user.findUnique({ where: { email: email } })
  if (!user) {
    return reply.code(404).send({
      message: 'User not found',
    })
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!user || !isMatch) {
    return reply.code(401).send({
      message: 'Invalid email or password',
    })
  }

  if (!user) {
    return reply.status(401).send({ message: 'Invalid email or password' })
  }
  const userResponse = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }

  // USING COOKIE
  if (authorizationStrategy === 'cookie') {
    const payload = { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
    reply.setCookie('access_token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only set to true in production
      maxAge: 3600 * 1000, // 1 hour
    })
    reply.send({ user: userResponse })
  } else {
    // USING JWT
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
    reply.send({ token, user: userResponse })
  }
}

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token')
  return reply.send({ message: 'Logout successful' })
}

export async function getUsers(req: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  })
  return reply.code(200).send(users)
}
