import { BaseEventEmitter } from './base-event-emitter';

export class BackofficeSyncEmitter extends BaseEventEmitter {
  emit(eventName: string | symbol, ...args: any[]): boolean {
    super.emit('*', eventName, ...args);
    return super.emit(eventName, ...args);
  }
}
