import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const registerSwagger = async (app: FastifyInstance) => {
  const swagger = await import('@fastify/swagger')
  app.register(swagger.default)

  app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request: FastifyRequest, reply: FastifyReply, next: (err?: Error) => void) {
        next()
      },
      preHandler: function (request: FastifyRequest, reply: FastifyReply, next: (err?: Error) => void) {
        next()
      },
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
    transformSpecification: (swaggerObject: Record<string, unknown>) => {
      return swaggerObject
    },
    transformSpecificationClone: true,
  })
}
