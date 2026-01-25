import { Users, UserCheck, UserX, Package, ShoppingCart } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { GetVendorStatisticResponse } from "~/services/procurement/vendor/dto/statistic/get-vendor-statistic.response";

interface VendorQuickStatisticProps {
  data: GetVendorStatisticResponse | null | undefined;
  isLoading: boolean;
}

export const VendorQuickStatistic = ({
  data,
  isLoading,
}: VendorQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatisticCard
        icon={Users}
        label="Tổng nhà cung cấp"
        value={data?.totalVendors || 0}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={UserCheck}
        label="Đang hoạt động"
        value={data?.activeVendors || 0}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={UserX}
        label="Ngừng hoạt động"
        value={data?.inactiveVendors || 0}
        iconColor="text-gray-600"
        iconBgColor="bg-gray-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Package}
        label="Sản phẩm cung cấp"
        value={data?.totalProductsSupplied || 0}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={ShoppingCart}
        label="Đơn hàng chờ xử lý"
        value={data?.pendingPurchaseOrders || 0}
        iconColor="text-amber-600"
        iconBgColor="bg-amber-100"
        isLoading={isLoading}
      />
    </div>
  );
};

export default VendorQuickStatistic;
