export const OrderSettingsName = 'ORDERS';

export interface OrderSettings {
  Orders: boolean;
  'Orders.DefaultTimeoutSeconds': number;
  'Orders.WebhookPublicKeyURL': string;
  'Orders.WebhookPublicKeyExpirySeconds': number;
}

export const OrderSettingsDefault: OrderSettings = {
  Orders: true,
  'Orders.DefaultTimeoutSeconds': 120,
  'Orders.WebhookPublicKeyURL': '',
  'Orders.WebhookPublicKeyExpirySeconds': 60 * 60,
};
