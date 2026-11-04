import { type Static, Type } from "@sinclair/typebox";

export const ErrorResponseSchema = Type.Object({
    requestId: Type.Required(Type.String({ minLength: 1})),
    status: Type.Required(Type.Integer({ minimum: 400, maximum: 599 })),
    title: Type.Optional(Type.String({ minLength: 1 })),
    errors: Type.Optional(Type.Array(Type.Object({
        field: Type.Optional(Type.String()),
        code: Type.String(),
        message: Type.Optional(Type.String())
    }), { minItems: 1 }))
}, {additionalProperties: false});

export type ErrorResponse = Static<typeof ErrorResponseSchema>;

export type Error = NonNullable<ErrorResponse['errors']>[number];