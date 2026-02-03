export interface RemoveItemResponse {
  removedCartItemId: number;
  sellableItemId: number;
  removedQuantity: number;
  remainingCartItems: number;
  totalCartItems: number;
  message: string;
}
