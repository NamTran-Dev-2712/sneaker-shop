import type { FulfillmentType, PaymentMethod } from "./order.type";

/** Checkout wizard step: 1 = shipping info, 2 = payment, 3 = review */
export type CheckoutStep = 1 | 2 | 3;

/** An item selected for checkout, carrying snapshot data from cart */
export interface CheckoutItem {
  cartItemId: number;
  sellableItemId: number;
  inventoryId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;

  // Store info — used to group items into per-store orders
  storeId: number;
  storeName: string;

  // Snapshot fields (captured at checkout time)
  productName: string;
  sku: string;
  mainImage: string;

  // Optional variant info
  colorName?: string;
  colorHex?: string;
  sizeName?: string;
  brandName?: string;
}

/** Shipping / delivery info collected in step 1 */
export interface ShippingInfo {
  fulfillmentType: FulfillmentType;
  recipientName: string;
  recipientPhone: string;
  province: string;
  ward: string;
  addressDetail: string;
  note: string;
  pickupStoreId: number | null;
}

/** Payment info collected in step 2 */
export interface PaymentInfo {
  paymentMethod: PaymentMethod;
}

/** Complete checkout form data persisted in Redux */
export interface CheckoutFormData {
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
}
