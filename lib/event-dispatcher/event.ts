import { EventType } from "./event-dispatcher";

export interface UnpackType {
  value: EventType;
  payload?: any;
}

export abstract class Event {
  constructor(protected value: EventType, protected payload?: any) {}
  unpack(): UnpackType {
    return { value: this.value, payload: this.payload };
  }
}

export class NoBlockingEvent extends Event {
  static of(value: EventType, payload?: any): NoBlockingEvent {
    return new NoBlockingEvent(value, payload);
  }
}

export class BlockingEvent<R> extends Event {
  static of<R>(value: EventType, payload?: any): BlockingEvent<R> {
    return new BlockingEvent(value, payload);
  }

  private promise: Promise<R>;

  constructor(protected value: EventType, protected payload?: any) {
    super(value, payload);
    this.promise = new Promise((resolve) => {
      this.finish = resolve;
    });
  }

  public finish: (data: R) => void = () => {};

  public async waitFinish(): Promise<R> {
    return await this.promise;
  }
}
