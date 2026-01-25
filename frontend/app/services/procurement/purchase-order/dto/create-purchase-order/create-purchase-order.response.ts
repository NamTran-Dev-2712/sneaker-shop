export interface CreatePurchaseOrderResponse {
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
  createdAt: string; // ISO date string
}
