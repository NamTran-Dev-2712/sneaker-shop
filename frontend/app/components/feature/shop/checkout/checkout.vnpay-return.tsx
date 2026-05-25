import { useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Loader2, CheckCircle, XCircle, FileText } from "lucide-react";
import { useHandleVnPayReturn } from "~/hooks/react-query/use-order.query";
import { useAppDispatch } from "~/hooks/redux";
import { resetCheckout } from "~/store/checkout/checkout.slice";

const CheckoutVnPayReturn = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const queryParams = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  const { data, isLoading, isError, error } = useHandleVnPayReturn(queryParams);

  useEffect(() => {
    dispatch(resetCheckout());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
        <h1 className="text-xl font-semibold">
          Đang xác thực thanh toán VNPay...
        </h1>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Không thể xác thực thanh toán</h1>
          <p className="text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Đã xảy ra lỗi khi xử lý kết quả từ VNPay."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/orders">Xem đơn hàng</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/cart">Quay lại giỏ hàng</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isSuccess = data.status === "SUCCESS";

  return (
    <div className="max-w-lg mx-auto text-center space-y-6 py-12">
      <div className="flex justify-center">
        <div
          className={`h-20 w-20 rounded-full flex items-center justify-center ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="h-10 w-10 text-green-600" />
          ) : (
            <XCircle className="h-10 w-10 text-red-600" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          {isSuccess ? "Thanh toán thành công" : "Thanh toán chưa thành công"}
        </h1>
        <p className="text-muted-foreground">{data.message}</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Mã tham chiếu VNPay:</span>
            <span className="font-semibold">{data.vnPayTxnRef || "-"}</span>
          </div>

          {data.orderId && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Mã đơn hàng:</span>
              <span className="font-semibold text-primary">
                #{data.orderId}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {data.orderId ? (
          <Button asChild>
            <Link to={`/orders/${data.orderId}`}>Xem chi tiết đơn hàng</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/orders">Xem đơn hàng</Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link to="/sneakers">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    </div>
  );
};

export default CheckoutVnPayReturn;
