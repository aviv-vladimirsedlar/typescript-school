import fp from 'fastify-plugin';

import logger from '../utils/logger.util';

export default fp(async (app) => {
  app.decorate('logger', logger);

  // Log incoming requests
  app.addHook('onRequest', (request, reply, done) => {
    logger.info(`Incoming request:  ${request.method} ${request.url}`);
    done();
  });

  // Log request errors
  app.addHook('onError', (request, reply, error, done) => {
    logger.error(`Error in request ${request.method} ${request.url}: ${error.message}`);
    done();
  });

  // Log completed requests
  app.addHook('onResponse', (request, reply, done) => {
    logger.info(`Completed request: ${request.method} ${request.url} - Status: ${reply.statusCode}`);
    done();
  });
});
