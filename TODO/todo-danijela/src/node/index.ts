import * as fastify from 'fastify';
import mongoose from 'mongoose';
import routes from './routes';
import {config} from './config/app';

const env = process.env.NODE_ENV;

const app = fastify.default({logger: true});
routes.forEach(route => {
    app.register((app, options, done) => {
        app.route(route);
        done();
    });
});
const start = async (): Promise<void> => {
    try {
        await app.ready();
        await app.listen({port: config.app.port});
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();

export default app;

// Configure DB
if (env !== 'test') {
    mongoose
        .connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {})
        .catch(err => app.log.error(err));
}
