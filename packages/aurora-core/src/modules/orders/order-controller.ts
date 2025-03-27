import { Controller, Header, Response, TsoaResponse } from '@tsoa/runtime';
import { createVerify } from 'crypto';
import { ServerSettingsStore } from '@gewis/aurora-core-server-settings'
import { Body, Delete, Get, Post, Res, Route, Security, Tags } from 'tsoa';
import { SecurityNames } from '@gewis/aurora-core-util';
import { securityGroups } from '@gewis/aurora-core-util';
import OrderManager from './order-manager';
import { OrderSettings } from './order-settings';
import {Order} from "./entities";

interface OrderRequest {
  orderNumber: number;
  timeoutSeconds?: number;
}

@Tags('Orders')
@Route('/orders')
export class OrderController extends Controller {
  private static webhookPublicKey: string;

  private static webhookKeyLastUpdate = new Date();

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

  @Post('webhook')
  public async addOrderWebhook(
    @Body() orderRequest: OrderRequest,
    @Header('X-Signature') signature: string,
    @Res() invalidSignatureResponse: TsoaResponse<400, { message: string }>,
  ) {
    const settingsStore = ServerSettingsStore.getInstance();
    const expiryTimeSeconds = settingsStore.getSetting<OrderSettings>(
      'orders',
      'Orders.DefaultTimeoutSeconds',
    ) as OrderSettings['Orders.DefaultTimeoutSeconds'];

    if (
      !OrderController.webhookPublicKey ||
      new Date().getTime() - OrderController.webhookKeyLastUpdate.getTime() >
        1000 * expiryTimeSeconds
    ) {
      const webhookKeyUrl = settingsStore.getSetting<OrderSettings>(
        'orders',
        'Orders.WebhookPublicKeyURL',
      ) as OrderSettings['Orders.WebhookPublicKeyURL'];

      const response = await fetch(webhookKeyUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch public key: ${response.statusText}`);
      }
      OrderController.webhookPublicKey = await response.text();
      OrderController.webhookKeyLastUpdate = new Date();
    }

    // Create a verifier
    const verifier = createVerify('RSA-SHA256');
    verifier.update(JSON.stringify(orderRequest));
    verifier.end();

    // Decode the Base64 signature
    const decodedSignature = Buffer.from(signature, 'base64');

    // Verify the signature
    const isValid = verifier.verify(OrderController.webhookPublicKey, decodedSignature);
    if (!isValid) {
      return invalidSignatureResponse(400, { message: 'Signature invalid' });
    }

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
