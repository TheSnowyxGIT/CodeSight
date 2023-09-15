import { BlockingEvent, Event, NoBlockingEvent } from "./event";

type onCallback = (
  type: "blocking" | "noBlocking",
  value: EventType,
  payload: any
) => Promise<unknown>;

export type EventType = any;

export default abstract class EventDispatcher {
  private queue: Event[] = [];
  private isRunning = false;
  private subscribers: Set<onCallback> = new Set();

  public emit(event: EventType, payload?: any) {
    this.queue.push(NoBlockingEvent.of(event, payload));
    setTimeout(() => this.run(), 0); //ensure that run is called asynchronously
  }

  public async emitBlocking<R>(
    event: EventType,
    defaultValue: R,
    payload?: any
  ): Promise<R> {
    if (this.subscribers.size === 0) {
      return defaultValue;
    }
    const blockingEvent = BlockingEvent.of<R>(event, payload);
    this.queue.push(blockingEvent);
    setTimeout(() => this.run(), 0); //ensure that run is called asynchronously
    const data = await blockingEvent.waitFinish();
    if (data === undefined) {
      return defaultValue;
    }
    return data;
  }

  private async run() {
    if (this.isRunning) {
      return;
    }

    if (this.queue.length === 0) {
      return;
    }

    let element = this.queue.shift()!;

    this.isRunning = true;
    const subscribers = [...this.subscribers];
    const { value, payload } = element.unpack();
    if (element instanceof BlockingEvent) {
      const blockingEvent = element;
      const results = await Promise.all(
        subscribers.map((sub) => sub("blocking", value, payload))
      );
      const data = results.find((result) => result !== undefined);
      blockingEvent.finish(data);
    } else {
      await Promise.all(
        subscribers.map((sub) => sub("noBlocking", value, payload))
      );
    }
    this.isRunning = false;

    this.run();
  }

  public addSubscriber(onCallback: onCallback) {
    this.subscribers.add(onCallback);
  }

  public removeSubscriber(onCallback: onCallback) {
    this.subscribers.delete(onCallback);
  }
}
