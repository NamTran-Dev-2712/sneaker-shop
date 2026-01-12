import { Store, CheckCircle, Users } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { GetStoreResponse } from "~/services/shop/store/dto/get-store/get-store.response";

interface StoreQuickStatisticProps {
  data: GetStoreResponse | null | undefined;
  isLoading: boolean;
}

export const StoreQuickStatistic = ({
  data,
  isLoading,
}: StoreQuickStatisticProps) => {
  // Tính toán thống kê
  const totalStores = data?.totalItems || 0;
  const activeStores = data?.items?.filter((s) => s.isActive).length || 0;
  const totalStaff =
    data?.items?.reduce((sum, s) => sum + (s.staffCount || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatisticCard
        icon={Store}
        label="Tổng cửa hàng"
        value={totalStores}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={CheckCircle}
        label="Đang hoạt động"
        value={activeStores}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Users}
        label="Tổng nhân viên"
        value={totalStaff}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default StoreQuickStatistic;
