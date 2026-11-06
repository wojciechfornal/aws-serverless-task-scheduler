import Fastify, { type FastifyServerOptions } from 'fastify';

import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { errorHandler } from './http/error-handler.ts';
import { routes } from './routes.ts';
import { tasksRoutes } from './tasks/task-routes.ts';
import { type TasksStore } from './tasks/tasks.store.ts';

export type AppOptions = FastifyServerOptions & { store: TasksStore };

export function buildApp({ store, ...options }: AppOptions) {

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
    app.register(tasksRoutes, { store });

    return app;

}