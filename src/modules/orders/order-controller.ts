import { Controller, Response } from '@tsoa/runtime';
import { FeatureEnabled } from '../server-settings';
import { Body, Delete, Get, Post, Route, Security, Tags } from 'tsoa';
import { SecurityNames } from '../../helpers/security';
import { securityGroups } from '../../helpers/security-groups';
import OrderStore from './order-store';
import OrderManager from './order-manager';

interface OrderRequest {
  orderNumber: number;
  timeoutSeconds?: number;
}

@Tags('Orders')
@Route('/orders')
@FeatureEnabled('Orders')
export class OrderController extends Controller {
  @Security(SecurityNames.LOCAL, securityGroups.orders.base)
  @Get('')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public async getAllOrders() {
    return OrderManager.getInstance().getOrders();
  }

  @Security(SecurityNames.LOCAL, securityGroups.orders.privileged)
  @Post('')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public async addOrder(@Body() orderRequest: OrderRequest) {
    const manager = OrderManager.getInstance();
    await manager.addOrder(orderRequest.orderNumber, orderRequest.timeoutSeconds);
    return manager.getOrders();
  }

  @Security(SecurityNames.LOCAL, securityGroups.orders.privileged)
  @Delete('{orderNumber}')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public async removeOrder(orderNumber: number) {
    const manager = OrderManager.getInstance();
    await manager.removeOrder(orderNumber);
    return manager.getOrders();
  }
}
