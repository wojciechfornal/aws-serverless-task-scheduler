import Fastify, { type FastifySchemaValidationError }  from 'fastify';

import { type Error, type ErrorResponse } from './error-response.ts';

export type ValidationError = {
    /** The formatted message produced by schemaErrorFormatter */
    message: string;
    /** The raw validation result, as returned by the validator */
    validation: FastifySchemaValidationError[];
    /** The part of the request that failed validation */
    validationContext: string;
    /** Default code */
    code: 'FST_ERR_VALIDATION';
    /** Default status code */
    statusCode: 400;
};

const validationKeywordsToCodes: Record<string, string> = {
    required: "FIELD_REQUIRED",
    additionalProperties: "FIELD_NOT_ALLOWED",
    type: "FIELD_INVALID_TYPE",
    minLength: "FIELD_TOO_SHORT",
    format: "FIELD_INVALID_FORMAT",
};

export function mapValidationsToErrors(validations: FastifySchemaValidationError[]): Error[] {
    return validations.map((validation) => {
        let field = '';
        switch (validation.keyword) {
            case 'required':
                field = String(validation.params.missingProperty);
                break;
            case 'additionalProperties':
                field = String(validation.params.additionalProperty);
                break;
            default:
                field = validation.instancePath.slice(1);
                break;
        }
        return {
            ...(field ? { field } : {}),
            code: validationKeywordsToCodes[validation.keyword] ?? 'FIELD_INVALID',
            message: validation.message ?? 'Invalid value.',
        }
    })
}

/**
 * Custom error handler to map Fastify validator results to stable error codes.
 * Raw validator results are a bit too verbose for front-end client needs.
 * 
 * Function maps array of these:
 * - keyword: string;
 * - instancePath: string;
 * - schemaPath: string;
 * - params: Record<string, unknown>;
 * - message?: string;
 * 
 * Into array of these:
 * - field?: string;
 * - code: string;
 * - message?: string;
 * 
 * @param error 
 * @param request 
 * @param reply 
 */
export function errorHandler(this: Fastify.FastifyInstance , error: ValidationError, request: Fastify.FastifyRequest, reply: Fastify.FastifyReply ) {

    this.log.error(error);

    if (!error.validation) {
        return reply.send(error);
    }

    const response: ErrorResponse = {
        requestId: request.id,
        status: 400,
        title: 'Invalid request input',
        errors: mapValidationsToErrors(error.validation)
    }

    return reply.status(400).send(response);

}