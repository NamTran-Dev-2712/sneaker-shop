export interface UpdatePurchaseOrderResponse {
  id: number;
  vendorId: number;
  vendorName: string;
  storeId: number;
  storeName: string;
  status: string;
  expectedAt?: string; // ISO date string
  note?: string;
  totalCost: number;
  itemCount: number;
  updatedAt: string; // ISO date string
}
