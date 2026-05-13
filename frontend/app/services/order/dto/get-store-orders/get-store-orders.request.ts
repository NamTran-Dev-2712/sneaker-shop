export interface GetStoreOrdersRequest {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  fulfillmentType?: string;
  fromDate?: string;
  toDate?: string;
}
