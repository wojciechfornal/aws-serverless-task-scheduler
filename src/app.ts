import Fastify from 'fastify';

import { routes } from './routes.ts';
import { tasksRoutes } from './tasks/task-routes.ts';

export function buildApp(): Fastify.FastifyInstance {

    const app = Fastify({
        logger: true,
    });

    app.register(routes);
    app.register(tasksRoutes);

    return app;

}