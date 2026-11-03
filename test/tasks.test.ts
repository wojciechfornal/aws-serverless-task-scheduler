import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildApp } from '#app';
import { type CreateTaskInput, type Task } from '#/tasks/task';

describe('tasks API', () => {

    test('A valid request returns 201, a generated ID, and completed: false', async () => {
        const app = buildApp({ logger: false });
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

    test('A title containing only whitespace returns 400.', async () => {

        const app = buildApp({ logger: false });
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

    test('An invalid remindAt returns 400.', async () => {

        const app = buildApp({ logger: false });
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

    test('An past remindAt returns 400.', async () => {

        const app = buildApp({ logger: false });
        const remindAt = '01/01/1979, 00:00:00';
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

    test('A request containing id returns 400.', async () => {

        const app = buildApp({ logger: false });
        const remindAt = '01/01/1979, 00:00:00';
        const task: CreateTaskInput = {
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

    });

    test('A request containing completed returns 400.', async () => {

        const app = buildApp({ logger: false });
        const remindAt = '01/01/1979, 00:00:00';
        const task: CreateTaskInput = {
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

    });

    test('A timestamp with an offset is returned in UTC.', async () => {
        const app = buildApp({ logger: false });
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



});
