import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '#app';

test('GET /health returns 200 and ok status', async () => {
    const app = buildApp();
    const response = await app.inject({
        method: 'GET',
        url: '/health'
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.json(), { status: 'OK' });
});