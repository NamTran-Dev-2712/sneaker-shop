import type {
  CheckoutStep,
  CheckoutItem,
  ShippingInfo,
  PaymentInfo,
} from "~/types/entities/checkout.type";
import { FulfillmentType, PaymentMethod } from "~/types/entities/order.type";

export interface CheckoutState {
  /** Current wizard step */
  currentStep: CheckoutStep;

  /** Items selected for checkout (snapshot from cart) */
  items: CheckoutItem[];

  /** Shipping / delivery form data */
  shippingInfo: ShippingInfo;

  /** Payment form data */
  paymentInfo: PaymentInfo;

  /** Applied voucher */
  voucherCode: string | null;
  discountAmount: number;

  /** Computed totals */
  subtotal: number;
  shippingFee: number;
  total: number;

  /** Idempotency key to prevent duplicate orders */
  idempotencyKey: string | null;
}

export const initialShippingInfo: ShippingInfo = {
  fulfillmentType: FulfillmentType.DELIVERY,
  recipientName: "",
  recipientPhone: "",
  province: "",
  ward: "",
  addressDetail: "",
  note: "",
  pickupStoreId: null,
};

export const initialPaymentInfo: PaymentInfo = {
  paymentMethod: PaymentMethod.COD,
};

export const initialState: CheckoutState = {
  currentStep: 1,
  items: [],
  shippingInfo: initialShippingInfo,
  paymentInfo: initialPaymentInfo,
  voucherCode: null,
  discountAmount: 0,
  subtotal: 0,
  shippingFee: 0,
  total: 0,
  idempotencyKey: null,
};
