import { type FastifyInstance } from "fastify";

import {
  CreateTaskInputSchema,
  TaskSchema,
  type CreateTaskInput,
  type Task,
} from "./task.ts";
import { storeTask } from "./tasks.store.ts";
import { ErrorResponseSchema } from "#http/error-response";

const taskPostOpts = {
  schema: {
    body: CreateTaskInputSchema,
    response: {
      201: TaskSchema,
      400: ErrorResponseSchema,
    },
  },
};

// TODO Consider following Problem Details (RFC 9457) but it seems a bit too verbose for me as of now
// TODO What about doubled validation (schema and check in route handler)?
// TODO Move error codes to separate resource (collection) where error definitions will be stored with associated metadata
export async function tasksRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateTaskInput }>("/tasks", taskPostOpts, (req, res) => {
    const title = req.body.title.trim();

    if (!title) {
      res.status(400).send({
        requestId: req.id,
        status: 400,
        title: "Invalid task input",
        errors: [
          {
            field: "title",
            code: "TASK_TITLE_REQUIRED",
            message: "Enter a task title.",
          },
        ],
      });
      return;
    }

    const reminderTime = Date.parse(req.body.remindAt);

    if (!Number.isFinite(reminderTime)) {
      res.status(400).send({
        requestId: req.id,
        status: 400,
        title: "Invalid task input",
        errors: [
          {
            field: "remindAt",
            code: "TASK_REMINDER_MUST_BE_VALID_DATE_TIME_STRING",
            message: "Task reminder must be valid date-time string.",
          },
        ],
      });
      return;
    }

    if (reminderTime <= Date.now()) {
      res.status(400).send({
        requestId: req.id,
        status: 400,
        title: "Invalid task input",
        errors: [
          {
            field: "remindAt",
            code: "TASK_REMINDER_MUST_BE_FUTURE",
            message: "Choose a future reminder time.",
          },
        ],
      });
      return;
    }

    const task: Task = storeTask(req.body);
    res.status(201).send(task);

  });
}
