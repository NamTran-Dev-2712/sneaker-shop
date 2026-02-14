import { useNavigate } from "react-router";
import { useAppDispatch } from "~/hooks/redux";
import useCheckout from "~/store/checkout/checkout.hook";
import {
  updatePaymentInfo,
  setCurrentStep,
} from "~/store/checkout/checkout.slice";
import { PaymentMethod } from "~/types/entities/order.type";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CreditCard, Banknote, Wallet, ArrowRight } from "lucide-react";

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
    description: "Thanh toán qua MoMo, ZaloPay, VNPay...",
  },
];

const CheckoutPayment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkout = useCheckout();

  const handleContinue = () => {
    dispatch(setCurrentStep(3));
    navigate("/checkout/review");
  };

  const handleBack = () => {
    dispatch(setCurrentStep(1));
    navigate("/checkout/shipping");
  };

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
