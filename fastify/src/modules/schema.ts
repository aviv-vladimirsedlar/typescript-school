import { FastifyInstance } from 'fastify';

import { schemaMovie } from './movie/movie.schema';
import { schemaUser } from './user/user.schema';

export const registerSchema = (app: FastifyInstance) => {
  Object.values(schemaUser).forEach((schema) => app.addSchema(schema));
  Object.values(schemaMovie).forEach((schema) => app.addSchema(schema));
};
