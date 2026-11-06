import { buildApp } from '#app';

import { createStore, type TasksStore } from '#/tasks/tasks.store';

export const start = async () => {

    const tasksStore = createStore();

    const app = buildApp({ store: tasksStore });

    try {
        await app.listen({ port: 3000 });
    } catch (err) {
        app.log.error(err);
        process.exitCode = 1;
    }
}