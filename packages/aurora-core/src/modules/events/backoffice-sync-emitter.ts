import { EventEmitter } from 'node:events';

export class BackofficeSyncEmitter extends EventEmitter {
  emit(eventName: string | symbol, ...args: any[]): boolean {
    super.emit('*', eventName, ...args);
    return super.emit(eventName, ...args);
  }
}
