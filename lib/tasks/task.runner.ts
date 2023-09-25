import { PrepareData, Task } from "./Task";

export class TaskRunner {
  private taskQueue: Task<any>[] = [];
  private currentTask: Task<any> = null;
  public running = false;

  public run() {
    if (this.currentTask === null && this.taskQueue.length > 0) {
      this.currentTask = this.taskQueue.shift();
    }
    if (this.currentTask !== null) {
      if (this.currentTask.isFinished()) {
        this.currentTask = null;
      } else {
        this.currentTask.run();
      }
    }
  }

  public async startTask<T extends Task>(task: T, data: PrepareData<T>) {
    this.taskQueue.push(task.prepare(data as object));
    this.running = true;
    await task.waitUntilFinished();
    this.running = false;
  }

  clear() {
    this.taskQueue = [];
    this.currentTask = null;
    this.running = false;
  }
}
