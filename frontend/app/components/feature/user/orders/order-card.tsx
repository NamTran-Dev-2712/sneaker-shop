import { Link } from "react-router";
import {
  Package,
  Calendar,
  ChevronRight,
  ShoppingBag,
  Truck,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import { formatDate } from "~/common/helpers/format-date.helper";
import type { OrderListItem } from "~/services/order/dto/get-my-orders/get-my-orders.response";

// ========================
// Status config
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

interface OrderCardProps {
  order: OrderListItem;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const statusConfig = STATUS_CONFIG[order.status] ?? {
    label: order.status,
    className: "border-gray-400 text-gray-600 bg-gray-50",
  };

  return (
    <Link to={`/orders/${order.orderId}`} className="group block">
      <Card className="transition-all hover:shadow-md hover:border-primary/30 group-hover:border-primary/30">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Image + Info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Preview image */}
              <div className="hidden sm:block h-16 w-16 shrink-0 rounded-lg bg-muted overflow-hidden">
                {order.firstItemImage ? (
                  <img
                    src={order.firstItemImage}
                    alt={order.firstItemName ?? "Sản phẩm"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Order info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm sm:text-base">
                    Đơn hàng #{order.orderId}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </Badge>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                  {order.placedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(order.placedAt, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {order.itemCount} sản phẩm
                  </span>
                  <span className="flex items-center gap-1">
                    {order.fulfillmentType === "PICKUP" ? (
                      <MapPin className="h-3.5 w-3.5" />
                    ) : (
                      <Truck className="h-3.5 w-3.5" />
                    )}
                    {order.fulfillmentType === "PICKUP"
                      ? "Nhận tại cửa hàng"
                      : "Giao hàng"}
                  </span>
                </div>

                {order.firstItemName && (
                  <p className="mt-1 text-sm text-muted-foreground truncate">
                    {order.firstItemName}
                    {order.itemCount > 1 &&
                      ` và ${order.itemCount - 1} sản phẩm khác`}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Total + Arrow */}
            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2">
              <span className="font-bold text-base sm:text-lg text-primary">
                {formatCurrency(order.total)}
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default OrderCard;
