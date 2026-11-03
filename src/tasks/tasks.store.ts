import crypto from 'node:crypto';
import type { CreateTaskInput, Task } from './task.ts';

const TasksStore = new Map<String, Task>();

export function storeTask(task: CreateTaskInput): Task {
    const newTask = {
        title: task.title.trim(),
        description: task.description?.trim() ?? '',
        remindAt: task.remindAt,
        id: crypto.randomUUIDv7(),
        completed: false,
    }
    TasksStore.set(newTask.id, newTask);
    return newTask;
}

export function getTaskById(taskId: string): Task | undefined {
    if (TasksStore.has(taskId)) {
        return TasksStore.get(taskId);
    }
}