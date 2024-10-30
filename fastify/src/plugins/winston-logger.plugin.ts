import fp from 'fastify-plugin';

import logger from '../utils/logger.util';

export default fp(async (app) => {
  if (process.env.NODE_ENV !== 'test') {
    app.decorate('logger', logger);

    app.addHook('onRequest', (request, reply, done) => {
      logger.info(`Incoming request:  ${request.method} ${request.url}`);
      done();
    });

    app.addHook('onError', (request, reply, error, done) => {
      logger.error(`Error in request ${request.method} ${request.url}: ${error.message}`);

      done();
    });

    app.addHook('onResponse', (request, reply, done) => {
      logger.info(`Completed request: ${request.method} ${request.url} - Status: ${reply.statusCode}`);
      done();
    });
  }
});
