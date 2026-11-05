import Fastify from 'fastify';

import { errorHandler } from './http/error-handler.ts';
import { routes } from './routes.ts';
import { tasksRoutes } from './tasks/task-routes.ts';

import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export function buildApp(options: Fastify.FastifyServerOptions = {}) {

    const app = Fastify({
        ...options,
        ajv: {
            ...options.ajv,
            customOptions: {
                removeAdditional: false
            }
        }
    }).withTypeProvider<TypeBoxTypeProvider>();

    app.setErrorHandler(errorHandler);
    app.register(routes);
    app.register(tasksRoutes);

    return app;

}