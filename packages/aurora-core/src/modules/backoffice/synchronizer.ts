import { Namespace } from 'socket.io';
import EmitterStore from '../events/emitter-store';
import { EventEmitter } from 'node:events';

export class BackofficeSynchronizer {
  private static instance: BackofficeSynchronizer;

  private emitters: Map<string, string> = new Map();

  constructor() {
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new BackofficeSynchronizer();
    }
    return this.instance;
  }

  public registerEmitter(name: string, eventName: string) {
    this.emitters.set(name, eventName);
  }

  public init(socket: Namespace) {
    const emitterStore = EmitterStore.getInstance()
    for (const [name, eventName] of this.emitters) {
      if (eventName == '*') {
        // In case of a wildcard, we need to listen to all events
        emitterStore.get<EventEmitter>(name).on('*', (eventName: string, ...args: any[]) => {
          socket.emit(eventName, ...args);
        })
      } else {
        // Otherwise, just emit the given event
        emitterStore.get<EventEmitter>(name).on(eventName, (event) => {
          socket.emit(eventName, event);
        })
      }
    }
  }
}

