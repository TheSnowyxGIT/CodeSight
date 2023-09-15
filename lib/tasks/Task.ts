import { EventEmitter } from "events";

export interface TaskOptions {
  timeAfterEnd: number;
  onlyManualStop: boolean;
}
export type ResolveSignal = () => void;

export type TaskOption<T extends Task> = Omit<T["options"], keyof TaskOptions>;
export type MergeTaskOption<P extends object, T extends Task> = TaskOption<T> &
  P;

export type PrepareData<T extends Task> = T["prepare"] extends (
  data: infer T
) => any
  ? T
  : never;
export type MergePrepareData<
  P extends object,
  T extends Task
> = PrepareData<T> & P;

export abstract class Task<OPTION extends object = {}> extends EventEmitter {
  constructor() {
    super();
    this.resetOptions();
  }

  // options
  public options: TaskOptions & OPTION;
  private defaultTaskOption(): TaskOptions {
    return {
      timeAfterEnd: 0,
      onlyManualStop: false,
    };
  }
  protected abstract defaultOptions(): OPTION;
  public resetOptions(): void {
    this.options = Object.assign(
      this.defaultOptions(),
      this.defaultTaskOption()
    );
  }
  public setOptions(options: Partial<OPTION & TaskOptions>): void {
    this.resetOptions();
    this.options = Object.assign(this.options, options);
  }

  // prepare
  public prepare(data: object): Task<OPTION> {
    this.finished = false;
    this.isDone = false;
    delete this.doneTime;
    this.signalPromise = new Promise((resolve) => {
      this.resolveSignal = resolve as ResolveSignal;
    });
    return this;
  }

  protected skip: boolean = false;
  public run(): void {
    if (
      this.isDone &&
      this.doneTime + this.options.timeAfterEnd <= Date.now()
    ) {
      this.finish();
    }
    this.skip = false;
    this.onRun();
  }
  protected abstract onRun(): void;

  private isDone: boolean = false;
  private doneTime: number;
  protected done(): void {
    if (!this.isDone) {
      this.isDone = true;
      this.doneTime = Date.now();
    }
  }

  private finished: boolean = false;
  private resolveSignal: ResolveSignal;
  private signalPromise: Promise<unknown>;
  private finish(): void {
    if (this.options.onlyManualStop) {
      return;
    }
    this.stop();
  }
  public isFinished(): boolean {
    return this.finished;
  }
  public stop(): void {
    this.finished = true;
    this.resolveSignal();
  }

  public async waitUntilFinished(): Promise<void> {
    await this.signalPromise;
  }
}
