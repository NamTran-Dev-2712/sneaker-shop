export interface UpdateCartItemRequest {
  customerId: number;
  cartItemId: number;
  quantity: number;
  inventoryId?: number;
}
