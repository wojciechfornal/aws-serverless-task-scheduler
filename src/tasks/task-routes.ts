import { type FastifyInstance } from 'fastify';

import { CreateTaskInputSchema, TaskSchema, type CreateTaskInput, type Task } from './task.ts';
import { storeTask } from './tasks.store.ts';

const taskPostOpts = {
    schema: {
        body: CreateTaskInputSchema,
        response: {
            201: TaskSchema
        }
    }
}

export async function tasksRoutes(fastify: FastifyInstance) {

    fastify.post<{ Body: CreateTaskInput }>('/task', taskPostOpts, (req, res) => {
        const task: Task = storeTask(req.body);
        res.status(201).send(task);
    });

}
