import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const registerSwagger = async (app: FastifyInstance) => {
  app.register(swagger, {
    swagger: {
      info: {
        title: 'Fastify Movie API',
        description: 'API documentation for the Movie API with RBAC',
        version: '1.0.0',
      },
      tags: [
        { name: 'User', description: 'User-related endpoints' },
        { name: 'Movie', description: 'Movie-related endpoints' },
      ],
    },
  });
  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request: FastifyRequest, reply: FastifyReply, next: (err?: Error) => void) {
        next();
      },
      preHandler: function (request: FastifyRequest, reply: FastifyReply, next: (err?: Error) => void) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
    transformSpecification: (swaggerObject: Record<string, unknown>) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
};
