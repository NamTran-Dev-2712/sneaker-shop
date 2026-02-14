import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CheckCircle, ShoppingBag, FileText, Store } from "lucide-react";
import { useAppDispatch } from "~/hooks/redux";
import { resetCheckout } from "~/store/checkout/checkout.slice";
import { showSuccessToast } from "~/components/common/toast";

const CheckoutSuccess = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const orderIdsParam = searchParams.get("orderIds");
  const orderIds = orderIdsParam ? orderIdsParam.split(",") : [];
  const isMultiOrder = orderIds.length > 1;
  const hasCleanedUp = useRef(false);

  // Clear checkout state and show success toast on mount
  useEffect(() => {
    if (hasCleanedUp.current) return;
    hasCleanedUp.current = true;

    dispatch(resetCheckout());

    if (isMultiOrder) {
      showSuccessToast(
        `Đặt hàng thành công! Đã tạo ${orderIds.length} đơn hàng.`,
      );
    } else {
      showSuccessToast("Đặt hàng thành công!");
    }
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center space-y-6 py-12">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Đặt hàng thành công!</h1>
        <p className="text-muted-foreground">
          Cảm ơn bạn đã đặt hàng.{" "}
          {isMultiOrder
            ? "Các đơn hàng của bạn đang được xử lý."
            : "Đơn hàng của bạn đang được xử lý."}
        </p>
      </div>

      {orderIds.length > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            {isMultiOrder && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pb-2">
                <Store className="h-4 w-4" />
                <span>
                  Đã tạo <strong>{orderIds.length} đơn hàng</strong> (mỗi cửa
                  hàng 1 đơn)
                </span>
              </div>
            )}
            {orderIds.map((orderId, index) => (
              <div
                key={orderId}
                className="flex items-center justify-center gap-2 text-sm"
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {isMultiOrder ? `Đơn ${index + 1}:` : "Mã đơn hàng:"}
                </span>
                <span className="font-semibold text-primary">#{orderId}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link to="/sneakers">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Tiếp tục mua sắm
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
