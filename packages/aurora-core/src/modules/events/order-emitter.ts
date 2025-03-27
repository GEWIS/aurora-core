import { EventEmitter } from 'node:events';
import { ShowOrdersEvent } from './order-emitter-events';

export class OrderEmitter extends EventEmitter {
  showOrders(showOrdersEvent: ShowOrdersEvent): boolean {
    return super.emit('orders', showOrdersEvent);
  }
}
