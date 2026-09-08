import { BaseEventEmitter } from './base-event-emitter';

export class OrderEmitter extends BaseEventEmitter {
  showOrders<T>(showOrdersEvent: T): boolean {
    return super.emit('orders', showOrdersEvent);
  }
}
