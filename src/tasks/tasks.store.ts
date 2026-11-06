import crypto from "node:crypto";
import { createTask, type CreateTaskInput, type Task } from "./task.ts";
import type { Static } from "@sinclair/typebox";

export class TasksStore {
  #id: string;
  #store: Map<String, Task>;

  constructor() {
    this.#store = new Map<String, Task>();
    this.#id = crypto.randomUUID();
  }

  get id(): string {
    return this.#id;
  }

  storeTask(task: CreateTaskInput): Task {
    const remindAt = new Date(task.remindAt).toISOString();

    const newTask = createTask({
      title: task.title,
      remindAt,
      ...(task.description ? { description: task.description } : {}),
    });

    this.#store.set(newTask.id, newTask);

    return newTask;

  }

  getAllTasks(): Task[] {
    return Array.from(this.#store.values());
  }

  getTaskById(taskId: string): Task | undefined {
    return this.#store.get(taskId);
  }

}

const tasksStores = new Map<String, TasksStore>();

export function createStore(): TasksStore {
    const newTasksStore = new TasksStore();
    tasksStores.set(newTasksStore.id, newTasksStore);
    return new TasksStore();
}