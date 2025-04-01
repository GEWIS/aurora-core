import { EventEmitter } from 'node:events';

export const backofficeSyncEmitter = 'backoffice';
export const orderEmitter = 'order';

export default class EmitterStore {
  private static instance: EmitterStore;

  private emitters: Map<string, EventEmitter> = new Map();

  constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new EmitterStore();
    }
    return this.instance;
  }

  public registerEmitter(name: string, emitter: EventEmitter) {
    this.emitters.set(name, emitter);
  }

  public get<T>(name: string): T {
    return this.emitters.get(name) as T;
  }
}
