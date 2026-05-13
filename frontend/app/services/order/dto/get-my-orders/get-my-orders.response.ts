export interface GetMyOrdersResponse {
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: OrderListItem[];
}

export interface OrderListItem {
  orderId: number;
  placedAt: string | null;
  status: string;
  paymentMethod: string;
  fulfillmentType: string;
  subtotal: number;
  shippingFee: number;
  discountTotal: number;
  total: number;
  itemCount: number;
  firstItemName: string | null;
  firstItemImage: string | null;
}
