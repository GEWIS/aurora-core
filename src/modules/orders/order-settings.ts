export interface OrderSettings {
  Orders: boolean;
  'Orders.DefaultTimeoutSeconds': number;
}

export const OrderSettingsDefault: OrderSettings = {
  Orders: true,
  'Orders.DefaultTimeoutSeconds': 120,
};
