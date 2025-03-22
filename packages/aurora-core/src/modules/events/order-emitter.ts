import { EventEmitter } from 'node:events';
import { Order } from '../orders/entities';
import { ShowOrdersEvent } from './order-emitter-events';

export class OrderEmitter extends EventEmitter {
  showOrders(showOrdersEvent: ShowOrdersEvent): boolean {
    return super.emit('orders', showOrdersEvent);
  }
}
