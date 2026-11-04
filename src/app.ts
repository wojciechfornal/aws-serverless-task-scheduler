import Fastify from 'fastify';

import { routes } from './routes.ts';
import { tasksRoutes } from './tasks/task-routes.ts';

export function buildApp(options: Fastify.FastifyServerOptions = {}): Fastify.FastifyInstance {

    const app = Fastify({
        ...options,
        ajv: {
            ...options.ajv,
            customOptions: {
                removeAdditional: false
            }
        }
    });

    app.register(routes);
    app.register(tasksRoutes);

    return app;

}