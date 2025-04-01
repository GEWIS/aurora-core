import { Order } from './entities';

export interface ShowOrdersEvent {
  orders: Order[];
}
