import { type Static, Type } from "@sinclair/typebox";

export const TaskSchema = Type.Object({
    id: Type.Required(Type.String()),
    title: Type.Required(Type.String()),
    description: Type.Optional(Type.String()),
    remindAt: Type.Required(Type.String()),
    completed: Type.Required(Type.Boolean()),
});

export const CreateTaskInputSchema = Type.Pick(TaskSchema, Type.Union([
    Type.Literal('title'),
    Type.Literal('description'),
    Type.Literal('remindAt'),
]));

export type Task = Static<typeof TaskSchema>;
export type CreateTaskInput = Static<typeof CreateTaskInputSchema>;