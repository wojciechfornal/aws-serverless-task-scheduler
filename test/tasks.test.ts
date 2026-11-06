import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildApp } from "#app";
import { type CreateTaskInput, type Task } from "#/tasks/task";
import { createStore } from '#/tasks/tasks.store';

const USE_LOGGER = false;

describe("tasks API", () => {
  test("A valid request returns 201, a generated ID, and completed: false", async (t) => {

    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());
    const task: CreateTaskInput = {
      title: "New task title",
      remindAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 201);
    assert.equal(response.json().id.length, 36);
    assert.equal(response.json().completed, false);
  });

  test("A title containing only whitespace returns 400.", async (t) => {
    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());
    const task: CreateTaskInput = {
      title: " ",
      remindAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 400);
  });

  test("An invalid remindAt returns 400.", async (t) => {
    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());
    const remindAt = "05/11/2026, 20:55:23";
    const task: CreateTaskInput = {
      title: "Some title",
      remindAt,
    };
    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 400);
  });

  test("A valid timestamp in the past returns 400.", async (t) => {
    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());
    const remindAt = "1979-01-01T00:00:00.000Z";
    const task: CreateTaskInput = {
      title: "Some title",
      remindAt,
    };
    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().errors[0].code, "FIELD_INVALID_TYPE");
  });

  test("A request containing id returns 400, valid field and coe.", async (t) => {
    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());
    const task = {
      id: "f502449b-9416-4108-953d-92b9e9947f91",
      title: "Some title",
      remindAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().errors[0].field, "id");
    assert.equal(response.json().errors[0].code, "FIELD_NOT_ALLOWED");
  });

  test("A request containing completed returns 400, valid field and code.", async (t) => {
    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());
    const task = {
      title: "Some title",
      remindAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      completed: true,
    };
    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().errors[0].field, "completed");
    assert.equal(response.json().errors[0].code, "FIELD_NOT_ALLOWED");
  });

  test("A timestamp with an offset is returned in UTC.", async (t) => {
    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
    const remindAt = future.toISOString().replace("Z", "+02:00");
    const task: CreateTaskInput = {
      title: "Some title",
      remindAt,
    };
    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 201);
    assert.equal(response.json().remindAt, new Date(remindAt).toISOString());
  });

  test("Schema failure response body contains valid field and code", async (t) => {
    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());
    const task = {
      title: "Some title",
    };
    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().errors[0].code, "FIELD_REQUIRED");
  });

  test("Route validation failure response body contains valid field and code", async (t) => {
    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());
    const task = {
      title: " ",
      remindAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().errors[0].field, "title");
    assert.equal(response.json().errors[0].code, "FIELD_REQUIRED");
  });

  test("Malformed JSON returns 400 and a subsequent valid request succeeds", async (t) => {
    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());

    let response = await app.inject({
      method: "POST",
      url: "/tasks",
      headers: {
        "content-type": "application/json",
      },
      payload: '{"title": "Broken request"',
    });

    assert.equal(response.statusCode, 400);

    const task = {
      title: "Task after malformed JSON",
      remindAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 201);

    const createdTask = response.json<Task>();

    assert.equal(createdTask.title, task.title);
    assert.equal(createdTask.remindAt, task.remindAt);
    assert.equal(createdTask.completed, false);
    assert.equal(typeof createdTask.id, "string");
    assert.ok(createdTask.id.length > 0);
  });

  test('Added task can be retrieved by id', async (t) => {

    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());

    const task: CreateTaskInput = {
      title: "New task title",
      remindAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      body: task,
    });

    assert.equal(response.statusCode, 201);
    assert.equal(response.json().id.length, 36);
    assert.equal(response.json().completed, false);

    const taskId = response.json().id;

    const retrieveTaskResponse = await app.inject({
      method: 'GET',
      url: `/tasks/${taskId}`,
    });

    assert.equal(retrieveTaskResponse.statusCode, 200);
    assert.equal(retrieveTaskResponse.json().id, taskId);

  });

  test('Retrieval of non-existing task returns 404 and TASK_NOT_FOUND code', async (t) => {

    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());

    const response = await app.inject({
      method: 'GET',
      url: `/tasks/no-such-id`,
    });

    assert.equal(response.statusCode, 404);
    assert.equal(response.json().errors[0].code, 'TASK_NOT_FOUND');

  });

  test('Empty store should return 200 and an empty array', async (t) => {

    const store = createStore();
    const app = buildApp({ logger: USE_LOGGER, store });
    t.after(() => app.close());

    const response = await app.inject({
      method: 'GET',
      url: '/tasks'
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(Array.isArray(response.json()), true);

  });

});
