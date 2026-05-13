import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "~/hooks/redux";
import useCheckout from "~/store/checkout/checkout.hook";
import {
  updatePaymentInfo,
  setCurrentStep,
  applyVoucher,
  removeVoucher,
} from "~/store/checkout/checkout.slice";
import { PaymentMethod } from "~/types/entities/order.type";
import {
  useAvailableVouchers,
  useValidateVoucher,
} from "~/hooks/react-query/use-order.query";
import { formatCurrency } from "~/common/helpers/format-currency.helper";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Badge } from "~/components/ui/badge";
import {
  CreditCard,
  Banknote,
  Wallet,
  ArrowRight,
  Landmark,
  Tag,
  X,
  ChevronDown,
  Check,
  Loader2,
} from "lucide-react";

const paymentMethodOptions = [
  {
    value: PaymentMethod.COD,
    label: "Thanh toán khi nhận hàng (COD)",
    icon: Banknote,
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
  },
  {
    value: PaymentMethod.BANK_TRANSFER,
    label: "Chuyển khoản ngân hàng",
    icon: CreditCard,
    description: "Chuyển khoản qua tài khoản ngân hàng",
  },
  {
    value: PaymentMethod.EWALLET,
    label: "Ví điện tử",
    icon: Wallet,
    description: "Thanh toán qua ví điện tử (MoMo, ZaloPay...)",
  },
  {
    value: PaymentMethod.VNPAY,
    label: "VNPay",
    icon: Landmark,
    description: "Thanh toán online qua cổng VNPay",
  },
];

const CheckoutPayment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkout = useCheckout();
  const validateVoucherMutation = useValidateVoucher();

  const [open, setOpen] = useState(false);

  const { data: availableVouchers = [], isLoading: vouchersLoading } =
    useAvailableVouchers(checkout.subtotal);

  const handleSelectVoucher = async (code: string) => {
    setOpen(false);

    // If clicking the already-applied voucher, remove it
    if (code === checkout.voucherCode) {
      dispatch(removeVoucher());
      return;
    }

    try {
      const result = await validateVoucherMutation.mutateAsync({
        code,
        subtotal: checkout.subtotal,
      });
      dispatch(
        applyVoucher({
          voucherCode: result.voucherCode,
          discountAmount: result.discountAmount,
        }),
      );
    } catch {
      // validateVoucher error is shown via mutation error state — no-op here
    }
  };

  const handleRemoveVoucher = () => {
    dispatch(removeVoucher());
  };

  const handleContinue = () => {
    dispatch(setCurrentStep(3));
    navigate("/checkout/review");
  };

  const handleBack = () => {
    dispatch(setCurrentStep(1));
    navigate("/checkout/shipping");
  };

  const appliedVoucher = availableVouchers.find(
    (v) => v.code === checkout.voucherCode,
  );

  return (
    <div className="max-w-2xl mx-auto my-3 space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>1. Thông tin giao hàng</span>
        <span>→</span>
        <span className="flex items-center gap-1 text-primary font-semibold">
          <CreditCard className="h-4 w-4" /> 2. Thanh toán
        </span>
        <span>→</span>
        <span>3. Xác nhận</span>
      </div>

      {/* Payment method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={checkout.paymentInfo.paymentMethod}
            onValueChange={(value) =>
              dispatch(
                updatePaymentInfo({ paymentMethod: value as PaymentMethod }),
              )
            }
            className="space-y-3"
          >
            {paymentMethodOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="mt-0.5"
                />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Voucher */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Mã giảm giá
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Applied voucher pill */}
          {checkout.voucherCode && (
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-green-800">
                  {checkout.voucherCode}
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Giảm {formatCurrency(checkout.discountAmount)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveVoucher}
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label="Xóa voucher"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Dropdown trigger */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between font-normal"
                disabled={vouchersLoading || validateVoucherMutation.isPending}
              >
                <span className="text-muted-foreground">
                  {vouchersLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Đang tải voucher...
                    </span>
                  ) : availableVouchers.length === 0 ? (
                    "Không có voucher khả dụng"
                  ) : (
                    `Chọn từ ${availableVouchers.length} voucher khả dụng`
                  )}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Tìm mã voucher..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy voucher phù hợp.</CommandEmpty>
                  <CommandGroup>
                    {availableVouchers.map((voucher) => {
                      const isSelected = voucher.code === checkout.voucherCode;
                      const discountLabel =
                        voucher.discountType === "PERCENT"
                          ? `${voucher.discountValue}%${voucher.maxDiscount ? ` (tối đa ${formatCurrency(voucher.maxDiscount)})` : ""}`
                          : formatCurrency(voucher.discountValue);

                      return (
                        <CommandItem
                          key={voucher.code}
                          value={voucher.code}
                          onSelect={() => handleSelectVoucher(voucher.code)}
                          className="flex items-start gap-3 py-3 cursor-pointer"
                        >
                          <Check
                            className={`h-4 w-4 mt-0.5 shrink-0 ${isSelected ? "opacity-100 text-primary" : "opacity-0"}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">
                                {voucher.code}
                              </span>
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0"
                              >
                                -{discountLabel}
                              </Badge>
                            </div>
                            <p className="text-xs text-green-700 font-medium mt-0.5">
                              Tiết kiệm {formatCurrency(voucher.discountAmount)}
                            </p>
                            {voucher.minOrderTotal && (
                              <p className="text-xs text-muted-foreground">
                                Đơn tối thiểu{" "}
                                {formatCurrency(voucher.minOrderTotal)}
                              </p>
                            )}
                            {voucher.endsAt && (
                              <p className="text-xs text-muted-foreground">
                                HSD:{" "}
                                {new Date(voucher.endsAt).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </p>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {validateVoucherMutation.isError && (
            <p className="text-xs text-destructive">
              {validateVoucherMutation.error instanceof Error
                ? validateVoucherMutation.error.message
                : "Không thể áp dụng voucher."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={handleBack}>
          ← Quay lại
        </Button>
        <Button onClick={handleContinue}>
          Tiếp tục <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPayment;
