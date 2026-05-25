export interface GetStoreOrdersResponse {
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: StoreOrderListItem[];
}

export interface StoreOrderListItem {
  orderId: number;
  orderCode: string;
  placedAt: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  fulfillmentType: string;
  customerName: string | null;
  customerPhone: string | null;
  total: number;
  itemCount: number;
  firstItemName: string | null;
  firstItemImage: string | null;
}
