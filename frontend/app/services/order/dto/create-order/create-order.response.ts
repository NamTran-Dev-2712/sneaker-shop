export interface CreateOrderResponse {
  orderId: number;
  status: string;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  total: number;
  voucherCode?: string;
  paymentMethod: string;
  fulfillmentType: string;
  placedAt: string;
  message: string;
}
