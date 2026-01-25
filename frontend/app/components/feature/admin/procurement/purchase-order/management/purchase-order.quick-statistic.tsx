import {
  ShoppingCart,
  PackageCheck,
  Truck,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import type { GetPurchaseOrderStatisticResponse } from "~/services/procurement/purchase-order/dto/statistic/get-purchase-order-statistic.response";

interface PurchaseOrderQuickStatisticProps {
  statistics: GetPurchaseOrderStatisticResponse | undefined;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  variant = "default",
}: StatCardProps) => {
  const variantStyles = {
    default: "text-primary",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
    info: "text-blue-600",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={variantStyles[variant]}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-5" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32 mt-2" />
    </CardContent>
  </Card>
);

export const PurchaseOrderQuickStatistic = ({
  statistics,
  isLoading,
}: PurchaseOrderQuickStatisticProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <StatCard
        title="Tổng đơn hàng"
        value={statistics.totalOrders}
        icon={<ShoppingCart className="h-5 w-5" />}
        description="Tất cả đơn đặt hàng"
        variant="default"
      />
      <StatCard
        title="Chờ xử lý"
        value={statistics.totalCreated}
        icon={<Clock className="h-5 w-5" />}
        description="Đơn mới tạo"
        variant="warning"
      />
      <StatCard
        title="Đã đặt"
        value={statistics.totalOrdered}
        icon={<Truck className="h-5 w-5" />}
        description="Đang chờ giao"
        variant="info"
      />
      <StatCard
        title="Đã nhận"
        value={statistics.totalReceived}
        icon={<PackageCheck className="h-5 w-5" />}
        description="Đã nhập kho"
        variant="success"
      />
      <StatCard
        title="Đã hủy"
        value={statistics.totalCancelled}
        icon={<XCircle className="h-5 w-5" />}
        description="Đơn bị hủy"
        variant="danger"
      />
      <StatCard
        title="Tổng chi phí"
        value={formatCurrency(statistics.totalReceivedCost)}
        icon={<DollarSign className="h-5 w-5" />}
        description="Đơn đã nhận"
        variant="success"
      />
    </div>
  );
};

export default PurchaseOrderQuickStatistic;
