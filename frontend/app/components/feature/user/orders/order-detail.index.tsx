import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  Truck,
  MapPin,
  FileText,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import { formatDate } from "~/common/helpers/format-date.helper";
import {
  useConfirmOrderReceived,
  useOrderDetail,
} from "~/hooks/react-query/use-order.query";

// ========================
// Status config (reuse from order-card pattern)
// ========================
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PLACED: {
    label: "Đã đặt",
    className: "border-blue-500 text-blue-700 bg-blue-50",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "border-indigo-500 text-indigo-700 bg-indigo-50",
  },
  PAID: {
    label: "Đã thanh toán",
    className: "border-emerald-500 text-emerald-700 bg-emerald-50",
  },
  PACKED: {
    label: "Đã đóng gói",
    className: "border-purple-500 text-purple-700 bg-purple-50",
  },
  SHIPPED: {
    label: "Đang giao",
    className: "border-orange-500 text-orange-700 bg-orange-50",
  },
  DELIVERED: {
    label: "Đã giao",
    className: "border-green-500 text-green-700 bg-green-50",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "border-red-500 text-red-700 bg-red-50",
  },
  RETURN_REQUESTED: {
    label: "Yêu cầu trả",
    className: "border-yellow-500 text-yellow-700 bg-yellow-50",
  },
  RETURNED: {
    label: "Đã trả",
    className: "border-gray-500 text-gray-700 bg-gray-50",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    className: "border-teal-500 text-teal-700 bg-teal-50",
  },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Tiền mặt",
  CARD: "Thẻ",
  BANK_TRANSFER: "Chuyển khoản",
  COD: "Thanh toán khi nhận hàng",
  EWALLET: "Ví điện tử",
  VNPAY: "VNPay",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thất bại",
  REFUNDED: "Đã hoàn tiền",
  PARTIALLY_REFUNDED: "Hoàn tiền một phần",
};

// ========================
// Skeleton
// ========================
const DetailSkeleton = () => (
  <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
    <Skeleton className="h-8 w-48" />
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  </div>
);

// ========================
// Component
// ========================
const OrderDetailPage = () => {
  const { id } = useParams();
  const orderId = Number(id);
  const { data: order, isLoading, isError, error } = useOrderDetail(orderId);
  const confirmReceivedMutation = useConfirmOrderReceived(orderId);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !order) {
    const is403 =
      error?.message?.includes("403") || error?.message?.includes("quyền");
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold">
            {is403 ? "Không có quyền truy cập" : "Không tìm thấy đơn hàng"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {is403
              ? "Bạn không có quyền xem đơn hàng này."
              : "Đơn hàng không tồn tại hoặc đã bị xóa."}
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đơn hàng
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] ?? {
    label: order.status,
    className: "border-gray-400 text-gray-600 bg-gray-50",
  };

  const canConfirmReceived =
    order.status === "SHIPPED" && order.fulfillmentType === "DELIVERY";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Back button */}
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
        <Link to="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại đơn hàng
        </Link>
      </Button>

      {/* Order Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Đơn hàng #{order.orderId}
          </h1>
          {order.placedAt && (
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Đặt lúc{" "}
              {formatDate(order.placedAt, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <Badge
            variant="outline"
            className={`text-sm px-3 py-1 w-fit ${statusConfig.className}`}
          >
            {statusConfig.label}
          </Badge>

          {canConfirmReceived && (
            <Button
              onClick={() => confirmReceivedMutation.mutate()}
              disabled={confirmReceivedMutation.isPending}
            >
              {confirmReceivedMutation.isPending
                ? "Đang xác nhận..."
                : "Xác nhận đã nhận hàng"}
            </Button>
          )}
        </div>
      </div>

      {canConfirmReceived && (
        <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
          Đơn hàng đã được bàn giao cho đơn vị vận chuyển. Vui lòng xác nhận khi
          bạn đã nhận hàng thành công.
        </div>
      )}

      {/* Main content — responsive grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column — Items + Fulfillment */}
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingBag className="h-5 w-5" />
                Sản phẩm ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 sm:p-6">
                    {/* Image */}
                    <div className="h-16 w-16 shrink-0 rounded-lg bg-muted overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">
                        {item.productName}
                      </p>
                      <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span>SKU: {item.sku}</span>
                        {item.variantName && (
                          <span>Phân loại: {item.variantName}</span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatCurrency(item.unitPrice)} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fulfillment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {order.fulfillmentType === "PICKUP" ? (
                  <MapPin className="h-5 w-5" />
                ) : (
                  <Truck className="h-5 w-5" />
                )}
                {order.fulfillmentType === "PICKUP"
                  ? "Nhận tại cửa hàng"
                  : "Thông tin giao hàng"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {order.recipientName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người nhận</span>
                  <span className="font-medium">{order.recipientName}</span>
                </div>
              )}
              {order.recipientPhone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số điện thoại</span>
                  <span className="font-medium">{order.recipientPhone}</span>
                </div>
              )}
              {order.address && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">
                    Địa chỉ
                  </span>
                  <span className="font-medium text-right">
                    {order.address}
                  </span>
                </div>
              )}
              {order.pickupStoreName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cửa hàng</span>
                  <span className="font-medium">{order.pickupStoreName}</span>
                </div>
              )}
              {order.carrier && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Đơn vị vận chuyển
                  </span>
                  <span className="font-medium">{order.carrier}</span>
                </div>
              )}
              {order.trackingCode && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã vận đơn</span>
                  <span className="font-medium font-mono">
                    {order.trackingCode}
                  </span>
                </div>
              )}
              {order.note && (
                <>
                  <Separator />
                  <div className="flex gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{order.note}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — Summary */}
        <div className="space-y-6">
          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5" />
                Thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phương thức</span>
                  <span className="font-medium">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod] ??
                      order.paymentMethod}
                  </span>
                </div>
              )}
              {order.paymentStatus && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <span className="font-medium">
                    {PAYMENT_STATUS_LABELS[order.paymentStatus] ??
                      order.paymentStatus}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tổng cộng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span>
                  {order.shippingFee > 0
                    ? formatCurrency(order.shippingFee)
                    : "Miễn phí"}
                </span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatCurrency(order.discountTotal)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Tổng thanh toán</span>
                <span className="text-primary">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
