import 'reflect-metadata'
import * as fs from 'fs'
import path from 'path'

import fastifyPassport from '@fastify/passport'
import fastifySecureSession from '@fastify/secure-session'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'

const authorizationStrategy = process.env.AUTHORIZATION_STRATEGY || 'cookie'

export const registerAuthorizationStrategy = (app: FastifyInstance) => {
  if (authorizationStrategy === 'cooki') {
    app.register(fastifySecureSession, {
      key: fs.readFileSync(path.join(__dirname, '../../secretKeyPassport')),
      cookie: {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600 * 1000, // 1 hour
      },
    })
  } else {
    app.register(fastifySecureSession, { key: fs.readFileSync(path.join(__dirname, '../../secretKeyPassport')) })
  }

  const cookieExtractor = (req: FastifyRequest) => {
    return req.cookies?.access_token || null
  }

  app.register(fastifyPassport.initialize())
  app.register(fastifyPassport.secureSession())

  fastifyPassport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: authorizationStrategy === 'cookie' ? cookieExtractor : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'a-very-strong-secret',
      },
      async (payload, done) => {
        // Here, replace with actual user lookup logic
        const user = { id: payload.sub, email: payload.email, firstName: payload.firstName, lastName: payload.lastName }
        if (!user) {
          return done(null, false)
        }
        return done(null, user)
      },
    ),
  )
}
