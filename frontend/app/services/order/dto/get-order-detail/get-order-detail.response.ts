export interface GetOrderDetailResponse {
  orderId: number;
  status: string;
  channel: string;
  note: string | null;
  placedAt: string | null;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string | null;
  paymentStatus: string | null;
  fulfillmentType: string | null;
  recipientName: string | null;
  recipientPhone: string | null;
  address: string | null;
  pickupStoreId: number | null;
  pickupStoreName: string | null;
  carrier: string | null;
  trackingCode: string | null;
  items: OrderDetailItem[];
}

export interface OrderDetailItem {
  productName: string;
  sku: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
  imageUrl: string | null;
}
