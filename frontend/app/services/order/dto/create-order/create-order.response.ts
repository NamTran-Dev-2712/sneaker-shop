export interface CreateOrderResponse {
  orderId: number;
  status: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  fulfillmentType: string;
  placedAt: string;
  message: string;
}
