Example error (`ValidationError`):

```json
{
    message: 'Error: body/remindAt must match format "date-time"...',
    statusCode: 400,
    code: 'FST_ERR_VALIDATION',
    validation: [
        {
            instancePath: '/remindAt',
            schemaPath: '#/properties/remindAt/format',
            keyword: 'format',
            params: [Object],
            message: 'must match format "date-time"'
        }
    ],
    validationContext: 'body'
}

```