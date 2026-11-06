import { type FastifyInstance } from "fastify";

import {
  CreateTaskInputSchema,
  TaskSchema,
  TasksCollectionSchema,
  type CreateTaskInput,
  type Task,
  type TasksCollection,
} from "./task.ts";
import { type TasksStore } from "./tasks.store.ts";
import { ErrorResponseSchema } from "#http/error-response";
import { type Static, Type } from "@sinclair/typebox";
import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

// Route schemas

const tasksGetSchema = {
  schema: {
    response: {
      200: TasksCollectionSchema,
      404: ErrorResponseSchema,
    },
  },
};

const tasksIdGetSchema = {
  schema: {
    params: Type.Object({
      taskId: Type.String({ minLength: 1 }),
    }),
    response: {
      200: TaskSchema,
      404: ErrorResponseSchema,
    },
  },
};

type TaskIdGetParams = Static<typeof tasksIdGetSchema.schema.params>;

const tasksPostOptions = {
  schema: {
    body: CreateTaskInputSchema,
    response: {
      201: TaskSchema,
      400: ErrorResponseSchema,
    },
  },
};

type TasksRoutesOptions = {
  store: TasksStore
};

// TODO Consider following Problem Details (RFC 9457) but it seems a bit too verbose for me as of now
// TODO What about doubled validation (schema and check in route handler)?
// TODO Move error codes to separate resource (collection) where error definitions will be stored with associated metadata
export const tasksRoutes: FastifyPluginAsyncTypebox<TasksRoutesOptions> = async (fastify, { store }) => {
  // TODO The GET /tasks route

  fastify.get('/tasks', tasksGetSchema, (req, res) => {

    res.status(200).send(store.getAllTasks());

  });

  // The GET /tasks/:taskId route

  fastify.get("/tasks/:taskId", tasksIdGetSchema, (req, res) => {
    const { taskId } = req.params;
    const task = store.getTaskById(taskId);
    if (task && task.id === taskId) {
      res.status(200).send({
        ...task,
      });
    } else {
      res.status(404).send({
        requestId: req.id,
        status: 404,
        errors: [
          {
            code: "TASK_NOT_FOUND",
          },
        ],
      });
    }
  });

  // The POST /tasks route
  fastify.post<{ Body: CreateTaskInput }>(
    "/tasks",
    tasksPostOptions,
    (req, res) => {
      const title = req.body.title.trim();

      if (!title) {
        res.status(400).send({
          requestId: req.id,
          status: 400,
          title: "Invalid task input",
          errors: [
            {
              field: "title",
              code: "FIELD_REQUIRED",
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
              code: "FIELD_INVALID_TYPE",
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
              code: "FIELD_INVALID_TYPE",
              message: "Choose a future reminder time.",
            },
          ],
        });
        return;
      }

      const task: Task = store.storeTask(req.body);
      res.status(201).send(task);
    },
  );
};
