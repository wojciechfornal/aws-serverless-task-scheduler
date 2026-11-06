import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "#app";
import { createStore } from '#/tasks/tasks.store';

describe("health API", () => {
  test("GET /health returns 200 and ok status", async (t) => {
    const store = createStore();
    const app = buildApp({ logger: false, store });
    t.after(() => app.close());
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.json(), { status: "OK" });
  });
});