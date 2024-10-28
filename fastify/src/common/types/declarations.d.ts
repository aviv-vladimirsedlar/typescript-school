import { JWT } from '@fastify/jwt';

type UserPayload = {
  id: string
  email: string
  firstName: string
  lastName: string
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    jwt: JWT
    user: UserPayload
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }

  export interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate: any
  }
}

declare module 'fastify-passport' {
  import { FastifyPluginCallback, FastifyRequest } from 'fastify';
  import { Strategy } from 'passport';

  export interface FastifyPassport {
    use(name: string, strategy: Strategy): FastifyPassport
    initialize(): FastifyPluginCallback
    secureSession(): FastifyPluginCallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate(strategy: string, options?: object): (req: FastifyRequest, res: any) => void
  }

  const fastifyPassport: FastifyPassport;
  export default fastifyPassport;
}
