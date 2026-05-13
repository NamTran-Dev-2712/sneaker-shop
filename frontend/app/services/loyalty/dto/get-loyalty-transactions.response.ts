export interface GetLoyaltyTransactionsResponse {
  id: number;
  txnType: string;
  points: number;
  reason?: string;
  orderId?: number;
  createdAt: string;
}
