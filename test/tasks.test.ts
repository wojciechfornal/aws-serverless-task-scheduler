import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildApp } from '#app';
import { type CreateTaskInput, type Task } from '#/tasks/task';

const USE_LOGGER = false;

describe('tasks API', () => {

    test('A valid request returns 201, a generated ID, and completed: false', async (t) => {
        const app = buildApp({ logger: USE_LOGGER });
        t.after(() => app.close());
        const now = Date.now();
        const then = now + 1000 * 60 * 60 * 24 * 2;
        const remindAt = new Date(then).toISOString();
        const task: CreateTaskInput = {
            title: 'New task title',
            remindAt
        }
        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            body: task
        });

        assert.equal(response.statusCode, 201);
        assert.equal(response.json().id.length, 36);
        assert.equal(response.json().completed, false);

    });

    test('A title containing only whitespace returns 400.', async (t) => {

        const app = buildApp({ logger: USE_LOGGER });
        t.after(() => app.close());
        const now = Date.now();
        const then = now + 1000 * 60 * 60 * 24 * 2;
        const remindAt = new Date(then).toISOString();
        const task: CreateTaskInput = {
            title: ' ',
            remindAt
        }
        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            body: task
        });

        assert.equal(response.statusCode, 400);

    });

    test('An invalid remindAt returns 400.', async (t) => {

        const app = buildApp({ logger: USE_LOGGER });
        t.after(() => app.close());
        const remindAt = '05/11/2026, 20:55:23';
        const task: CreateTaskInput = {
            title: 'Some title',
            remindAt
        }
        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            body: task
        });

        assert.equal(response.statusCode, 400);

    });

    test('A valid timestamp in the past returns 400.', async (t) => {

        const app = buildApp({ logger: USE_LOGGER });
        t.after(() => app.close());
        const remindAt = '1979-01-01T00:00:00.000Z';
        const task: CreateTaskInput = {
            title: 'Some title',
            remindAt
        }
        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            body: task
        });

        assert.equal(response.statusCode, 400);
        assert.equal(response.json().errors[0].code, 'FIELD_INVALID_TYPE');

    });

    test('A request containing id returns 400, valid field and coe.', async (t) => {

        const app = buildApp({ logger: USE_LOGGER });
        t.after(() => app.close());
        const now = Date.now();
        const then = now + 1000 * 60 * 60 * 24 * 2;
        const remindAt = new Date(then).toISOString();
        const task = {
            id: 'f502449b-9416-4108-953d-92b9e9947f91',
            title: 'Some title',
            remindAt
        }
        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            body: task
        });

        assert.equal(response.statusCode, 400);
        assert.equal(response.json().errors[0].field, 'id');
        assert.equal(response.json().errors[0].code, 'FIELD_NOT_ALLOWED');

    });

    test('A request containing completed returns 400, valid field and code.', async (t) => {

        const app = buildApp({ logger: USE_LOGGER });
        t.after(() => app.close());
        const now = Date.now();
        const then = now + 1000 * 60 * 60 * 24 * 2;
        const remindAt = new Date(then).toISOString();
        const task = {
            title: 'Some title',
            remindAt,
            completed: true,
        }
        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            body: task
        });

        assert.equal(response.statusCode, 400);
        assert.equal(response.json().errors[0].field, 'completed');
        assert.equal(response.json().errors[0].code, 'FIELD_NOT_ALLOWED');

    });

    test('A timestamp with an offset is returned in UTC.', async (t) => {
        const app = buildApp({ logger: USE_LOGGER });
        t.after(() => app.close());
        const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
        const remindAt = future.toISOString().replace('Z', '+02:00');
        const task: CreateTaskInput = {
            title: 'Some title',
            remindAt
        };
        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            body: task
        });

        assert.equal(response.statusCode, 201);
        assert.equal(response.json().remindAt, new Date(remindAt).toISOString());
    });

    test('Schema failure response body contains valid field and code', async (t) => {

        const app = buildApp({ logger: USE_LOGGER });
        t.after(() => app.close());
        const task = {
            title: 'Some title'
        }
        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            body: task
        });
        
        assert.equal(response.statusCode, 400);
        assert.equal(response.json().errors[0].code, 'FIELD_REQUIRED');
        
    });

    test('Route validation failure response body contains valid field and code', async (t) => {

        const app = buildApp({ logger: USE_LOGGER });
        t.after(() => app.close());
        const now = Date.now();
        const then = now + 1000 * 60 * 60 * 24 * 2;
        const remindAt = new Date(then).toISOString();
        const task = {
            title: ' ',
            remindAt
        }
        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            body: task
        });

        assert.equal(response.statusCode, 400);
        assert.equal(response.json().errors[0].field, 'title');
        assert.equal(response.json().errors[0].code, 'FIELD_REQUIRED');
        
    });

});
