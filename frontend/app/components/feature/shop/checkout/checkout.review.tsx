import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "~/hooks/redux";
import useCheckout from "~/store/checkout/checkout.hook";
import useAuth from "~/store/auth/auth.hook";
import { setCurrentStep } from "~/store/checkout/checkout.slice";
import {
  useCreateOrder,
  useCreateVnPayPaymentUrl,
} from "~/hooks/react-query/use-order.query";
import type { CreateOrderRequest } from "~/services/order/dto/create-order/create-order.request";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import { FulfillmentType, PaymentMethod } from "~/types/entities/order.type";
import type { CheckoutItem } from "~/types/entities/checkout.type";
import { showErrorToast } from "~/components/common/toast";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  CheckCircle,
  Loader2,
  Store,
  Info,
} from "lucide-react";

/** Group checkout items by storeId */
function groupItemsByStore(items: CheckoutItem[]) {
  const grouped = new Map<
    number,
    {
      storeId: number;
      storeName: string;
      items: CheckoutItem[];
      subtotal: number;
    }
  >();

  for (const item of items) {
    const existing = grouped.get(item.storeId);
    if (existing) {
      existing.items.push(item);
      existing.subtotal += item.lineTotal;
    } else {
      grouped.set(item.storeId, {
        storeId: item.storeId,
        storeName: item.storeName,
        items: [item],
        subtotal: item.lineTotal,
      });
    }
  }

  return Array.from(grouped.values());
}

const CheckoutReview = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const checkout = useCheckout();
  const createOrderMutation = useCreateOrder();
  const createVnPayPaymentUrlMutation = useCreateVnPayPaymentUrl();
  const [isPlacingOrders, setIsPlacingOrders] = useState(false);

  const orderGroups = useMemo(
    () => groupItemsByStore(checkout.items),
    [checkout.items],
  );
  const hasMultipleStores = orderGroups.length > 1;

  const handleBack = () => {
    dispatch(setCurrentStep(2));
    navigate("/checkout/payment");
  };

  const handlePlaceOrder = async () => {
    if (!checkout.idempotencyKey || isPlacingOrders) return;

    if (!user?.isEmailVerified) {
      showErrorToast(
        "Email của bạn chưa được xác minh. Vui lòng xác minh email trước khi đặt hàng.",
      );
      return;
    }

    if (
      checkout.paymentInfo.paymentMethod === PaymentMethod.VNPAY &&
      orderGroups.length > 1
    ) {
      showErrorToast(
        "VNPay hiện chỉ hỗ trợ thanh toán 1 cửa hàng mỗi lần. Vui lòng tách giỏ hàng.",
      );
      return;
    }

    setIsPlacingOrders(true);

    try {
      const createdOrderIds: number[] = [];

      for (const group of orderGroups) {
        // Each store-group gets a unique idempotency key derived from the base key
        const groupKey =
          orderGroups.length === 1
            ? checkout.idempotencyKey
            : `${checkout.idempotencyKey}-s${group.storeId}`;

        const request: CreateOrderRequest = {
          idempotencyKey: groupKey,
          fulfillmentType: checkout.shippingInfo.fulfillmentType,
          recipientName: checkout.shippingInfo.recipientName || undefined,
          recipientPhone: checkout.shippingInfo.recipientPhone || undefined,
          province: checkout.shippingInfo.province || undefined,
          ward: checkout.shippingInfo.ward || undefined,
          addressDetail: checkout.shippingInfo.addressDetail || undefined,
          pickupStoreId: checkout.shippingInfo.pickupStoreId,
          paymentMethod: checkout.paymentInfo.paymentMethod,
          items: group.items.map((item) => ({
            sellableItemId: item.sellableItemId,
            inventoryId: item.inventoryId,
            quantity: item.quantity,
            productName: item.productName,
            sku: item.sku,
            variantName:
              [item.colorName, item.sizeName].filter(Boolean).join(" / ") ||
              undefined,
            unitPrice: item.unitPrice,
            primaryImageUrl: item.mainImage || undefined,
          })),
          note: checkout.shippingInfo.note || undefined,
        };

        // Sequential order creation — await each to guarantee atomicity per order
        const data = await createOrderMutation.mutateAsync(request);
        createdOrderIds.push(data.orderId);

        if (checkout.paymentInfo.paymentMethod === PaymentMethod.VNPAY) {
          const paymentData = await createVnPayPaymentUrlMutation.mutateAsync(
            data.orderId,
          );

          window.location.assign(paymentData.paymentUrl);
          return;
        }
      }

      // All orders placed — navigate to success page
      // Note: resetCheckout is called on the success page to avoid
      // the CheckoutProvider guard redirecting to /cart before navigation
      navigate(`/checkout/success?orderIds=${createdOrderIds.join(",")}`, {
        replace: true,
      });
    } catch {
      // Error toast is handled by useCreateOrder onError
      setIsPlacingOrders(false);
    }
  };

  const fulfillmentLabel =
    checkout.shippingInfo.fulfillmentType === FulfillmentType.DELIVERY
      ? "Giao tận nhà"
      : "Nhận tại cửa hàng";

  return (
    <div className="max-w-2xl mx-auto my-3 space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>1. Thông tin giao hàng</span>
        <span>→</span>
        <span>2. Thanh toán</span>
        <span>→</span>
        <span className="flex items-center gap-1 text-primary font-semibold">
          <CheckCircle className="h-4 w-4" /> 3. Xác nhận đơn hàng
        </span>
      </div>

      {/* Multi-store info banner */}
      {hasMultipleStores && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-800">
          <Info className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">
              Sản phẩm từ {orderGroups.length} cửa hàng khác nhau
            </p>
            <p className="mt-1 text-blue-700">
              Hệ thống sẽ tự động tạo {orderGroups.length} đơn hàng riêng biệt
              (mỗi cửa hàng 1 đơn) để xử lý nhanh nhất cho bạn.
            </p>
          </div>
        </div>
      )}

      {!user?.isEmailVerified && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-800">
          <Info className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Email chưa xác minh</p>
            <p className="mt-1 text-amber-700">
              Bạn cần xác minh email trước khi đặt hàng. Vui lòng kiểm tra hộp
              thư hoặc cập nhật email trong trang hồ sơ.
            </p>
          </div>
        </div>
      )}

      {/* Order Items — grouped by store */}
      {orderGroups.map((group, idx) => (
        <Card key={group.storeId}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="h-4 w-4" />
              {hasMultipleStores ? (
                <>
                  Đơn {idx + 1} — {group.storeName}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {group.items.length} sản phẩm
                  </Badge>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Sản phẩm ({checkout.items.length}) — {group.storeName}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4">
                <img
                  src={item.mainImage}
                  alt={item.productName}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {item.productName}
                  </p>
                  {(item.colorName || item.sizeName) && (
                    <p className="text-xs text-muted-foreground">
                      {[item.colorName, item.sizeName]
                        .filter(Boolean)
                        .join(" / ")}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      x{item.quantity}
                    </span>
                    <span className="text-sm font-medium">
                      {formatCurrency(item.lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {hasMultipleStores && (
              <>
                <Separator />
                <div className="flex justify-between text-sm font-medium">
                  <span>Tạm tính đơn này</span>
                  <span>{formatCurrency(group.subtotal)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Shipping Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Thông tin giao hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hình thức</span>
            <Badge variant="secondary">{fulfillmentLabel}</Badge>
          </div>
          {checkout.shippingInfo.fulfillmentType ===
            FulfillmentType.DELIVERY && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Người nhận</span>
                <span>{checkout.shippingInfo.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số điện thoại</span>
                <span>{checkout.shippingInfo.recipientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Địa chỉ</span>
                <span className="text-right max-w-[60%]">
                  {checkout.shippingInfo.addressDetail},{" "}
                  {checkout.shippingInfo.ward}, {checkout.shippingInfo.province}
                </span>
              </div>
            </>
          )}
          {checkout.shippingInfo.note && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ghi chú</span>
              <span className="text-right max-w-[60%]">
                {checkout.shippingInfo.note}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phương thức</span>
            <span>{checkout.paymentInfo.paymentMethod}</span>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{formatCurrency(checkout.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phí vận chuyển</span>
            <span>
              {checkout.shippingFee === 0
                ? "Miễn phí"
                : formatCurrency(checkout.shippingFee)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span className="text-primary">
              {formatCurrency(checkout.total)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={handleBack}
          disabled={isPlacingOrders}
        >
          ← Quay lại
        </Button>
        <Button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrders || !user?.isEmailVerified}
          size="lg"
        >
          {isPlacingOrders ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              Đặt hàng ngay
              {hasMultipleStores && ` (${orderGroups.length} đơn)`}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutReview;
