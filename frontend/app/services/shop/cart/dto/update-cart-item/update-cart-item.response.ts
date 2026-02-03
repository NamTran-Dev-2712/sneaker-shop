export interface UpdateCartItemResponse {
  cartItemId: number;
  sellableItemId: number;
  inventoryId: number;
  oldQuantity: number;
  newQuantity: number;
  totalCartItems: number;
  totalAvailableInventory: number;
  message: string;
}
