import { FastifyInstance } from 'fastify';
import { buildJsonSchemas } from 'fastify-zod';

import { schemaMovie } from './movie/movie.schema';
import { schemaUser } from './user/user.schema';

// // to build our JSON schema, we use buildJsonSchemas from fastify-zod
// it returns all the schemas to register and a ref to refer these schemas
export const { schemas, $ref } = buildJsonSchemas({
  ...schemaUser,
  ...schemaMovie,
});

export const registerSchema = (app: FastifyInstance) => {
  for (const schema of [...schemas]) {
    app.addSchema(schema);
  }
};
