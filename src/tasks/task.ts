import crypto from 'node:crypto';

import { type Static, Type } from "@sinclair/typebox";

export const TaskSchema = Type.Object({
    id: Type.Required(Type.String({minLength: 1})),
    title: Type.Required(Type.String({minLength: 1})),
    description: Type.Optional(Type.String()),
    remindAt: Type.Required(Type.String({format: 'date-time'})),
    completed: Type.Required(Type.Boolean()),
}, {
    additionalProperties: false
});

export const CreateTaskInputSchema = Type.Pick(TaskSchema, Type.Union([
    Type.Literal('title'),
    Type.Literal('description'),
    Type.Literal('remindAt'),
]));

export const TasksCollectionSchema = Type.Array(TaskSchema);

export type Task = Static<typeof TaskSchema>;
export type TasksCollection = Static<typeof TasksCollectionSchema>;
export type CreateTaskInput = Static<typeof CreateTaskInputSchema>;

/**
 * Create new task.
 * @param task Task to be stored
 * @returns New task object, with new ID, normalized reminder time and completed flag
 */
export function createTask(task: CreateTaskInput): Task {
    const description = task.description?.trim();
    const newTask: Task = {
        id: crypto.randomUUID(),
        title: task.title.trim(),
        remindAt: task.remindAt,
        completed: false,
        ...(description ? { description } : {})
    }
    return newTask;
}