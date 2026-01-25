import {
  Package,
  PackageCheck,
  PackageMinus,
  PackageX,
  AlertTriangle,
  Store,
} from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { GetInventoryStatisticResponse } from "~/services/inventory/dto/statistic/get-inventory-statistic.response";

interface InventoryQuickStatisticProps {
  data: GetInventoryStatisticResponse | null | undefined;
  isLoading: boolean;
}

export const InventoryQuickStatistic = ({
  data,
  isLoading,
}: InventoryQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatisticCard
        icon={Package}
        label="Tổng sản phẩm"
        value={data?.totalItems || 0}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={PackageCheck}
        label="Tổng tồn kho"
        value={data?.totalOnHand || 0}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={PackageMinus}
        label="Đã đặt trước"
        value={data?.totalReserved || 0}
        iconColor="text-amber-600"
        iconBgColor="bg-amber-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={PackageCheck}
        label="Khả dụng"
        value={data?.totalAvailable || 0}
        iconColor="text-emerald-600"
        iconBgColor="bg-emerald-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={AlertTriangle}
        label="Sắp hết hàng"
        value={data?.lowStockCount || 0}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={PackageX}
        label="Hết hàng"
        value={data?.outOfStockCount || 0}
        iconColor="text-red-600"
        iconBgColor="bg-red-100"
        isLoading={isLoading}
      />
    </div>
  );
};

export default InventoryQuickStatistic;
