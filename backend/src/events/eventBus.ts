import { EventEmitter } from "events";
import type { AppEvents } from "./event.types.js";

class TypedEventBus extends EventEmitter {
  emit<K extends keyof AppEvents>(
    eventName: K,
    payload: AppEvents[K],
  ): boolean {
    return super.emit(eventName, payload);
  }

  on<K extends keyof AppEvents>(
    eventName: K,
    listener: (payload: AppEvents[K]) => void | Promise<void>,
  ): this {
    return super.on(eventName, listener);
  }
}

export const eventBus = new TypedEventBus();
