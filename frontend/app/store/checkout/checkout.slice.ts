import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  initialState,
  initialShippingInfo,
  initialPaymentInfo,
} from "./checkout.state";
import type {
  CheckoutItem,
  CheckoutStep,
  ShippingInfo,
  PaymentInfo,
} from "~/types/entities/checkout.type";

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

function calculateTotals(items: CheckoutItem[], discountAmount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal - discountAmount) + shippingFee;
  return { subtotal, shippingFee, total };
}

export const CheckoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    /** Initialize checkout with selected cart items; generates idempotency key */
    setCheckoutItems: (state, action: PayloadAction<CheckoutItem[]>) => {
      state.items = action.payload;
      const totals = calculateTotals(action.payload);
      state.subtotal = totals.subtotal;
      state.shippingFee = totals.shippingFee;
      state.total = totals.total;
      state.currentStep = 1;
      state.shippingInfo = initialShippingInfo;
      state.paymentInfo = initialPaymentInfo;
      state.voucherCode = null;
      state.discountAmount = 0;
      state.idempotencyKey = crypto.randomUUID();
    },

    setCurrentStep: (state, action: PayloadAction<CheckoutStep>) => {
      state.currentStep = action.payload;
    },

    updateShippingInfo: (
      state,
      action: PayloadAction<Partial<ShippingInfo>>,
    ) => {
      state.shippingInfo = { ...state.shippingInfo, ...action.payload };
    },

    updatePaymentInfo: (state, action: PayloadAction<Partial<PaymentInfo>>) => {
      state.paymentInfo = { ...state.paymentInfo, ...action.payload };
    },

    /** Apply a validated voucher and recalculate total */
    applyVoucher: (
      state,
      action: PayloadAction<{ voucherCode: string; discountAmount: number }>,
    ) => {
      state.voucherCode = action.payload.voucherCode;
      state.discountAmount = action.payload.discountAmount;
      const totals = calculateTotals(
        state.items,
        action.payload.discountAmount,
      );
      state.subtotal = totals.subtotal;
      state.shippingFee = totals.shippingFee;
      state.total = totals.total;
    },

    /** Remove the applied voucher and recalculate total */
    removeVoucher: (state) => {
      state.voucherCode = null;
      state.discountAmount = 0;
      const totals = calculateTotals(state.items, 0);
      state.subtotal = totals.subtotal;
      state.shippingFee = totals.shippingFee;
      state.total = totals.total;
    },

    /** Reset checkout state completely (after order placed or user navigates away) */
    resetCheckout: () => initialState,
  },
});

export const {
  setCheckoutItems,
  setCurrentStep,
  updateShippingInfo,
  updatePaymentInfo,
  applyVoucher,
  removeVoucher,
  resetCheckout,
} = CheckoutSlice.actions;

export default CheckoutSlice.reducer;
