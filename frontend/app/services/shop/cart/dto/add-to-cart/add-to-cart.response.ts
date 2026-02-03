export interface AddToCartResponse {
  cartId: number;
  cartItemId: number;
  sellableItemId: number;
  inventoryId: number;
  quantity: number;
  totalCartItems: number;
  isNewCart: boolean;
  isMerged: boolean;
  message: string;
}
