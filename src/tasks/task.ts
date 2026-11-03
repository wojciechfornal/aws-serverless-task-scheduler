import { type Static, Type } from "@sinclair/typebox";

export const TaskSchema = Type.Object({
    id: Type.Required(Type.String({minLength: 1})),
    title: Type.Required(Type.String({minLength: 1})),
    description: Type.Optional(Type.String()),
    remindAt: Type.Required(Type.String({format: 'date-time'})),
    completed: Type.Required(Type.Boolean()),
});

export const CreateTaskInputSchema = Type.Pick(TaskSchema, Type.Union([
    Type.Literal('title'),
    Type.Literal('description'),
    Type.Literal('remindAt'),
]));

export type Task = Static<typeof TaskSchema>;
export type CreateTaskInput = Static<typeof CreateTaskInputSchema>;