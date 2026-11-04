import crypto from 'node:crypto';
import { createTask, type CreateTaskInput, type Task } from './task.ts';

const TasksStore = new Map<String, Task>();

export function storeTask(task: CreateTaskInput): Task {

    const remindAt = new Date(task.remindAt).toISOString();

    const newTask = createTask({
        title: task.title,
        remindAt,
        ...(task.description ? { description: task.description } : {} )
    });

    TasksStore.set(newTask.id, newTask);

    return newTask;

}

export function getTaskById(taskId: string): Task | undefined {
    return TasksStore.get(taskId);
}
