import Fastify from 'fastify';

import { routes } from './routes.ts';

export function buildApp(): Fastify.FastifyInstance {

    const app = Fastify({
        logger: true,
    });

    app.register(routes);

    return app;

}