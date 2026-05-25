export interface GetInventoryStatisticResponse {
  totalItems: number;
  totalOnHand: number;
  totalReserved: number;
  totalAvailable: number;
  lowStockCount: number;
  outOfStockCount: number;
  sneakerCount: number;
  accessoryCount: number;
  storesWithInventory: number;
}
