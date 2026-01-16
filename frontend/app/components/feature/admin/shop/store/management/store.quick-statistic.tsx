import { Store, CheckCircle, XCircle, Users } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { StoreStatisticResponse } from "~/services/shop/store/dto/statistic/store-statistic.response";

interface StoreQuickStatisticProps {
  data: StoreStatisticResponse | null | undefined;
  isLoading: boolean;
}

export const StoreQuickStatistic = ({
  data,
  isLoading,
}: StoreQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticCard
        icon={Store}
        label="Tổng cửa hàng"
        value={data?.totalStores || 0}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={CheckCircle}
        label="Đang hoạt động"
        value={data?.activeStores || 0}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={XCircle}
        label="Tạm ngừng"
        value={data?.inactiveStores || 0}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Users}
        label="Tổng nhân viên"
        value={data?.totalStaff || 0}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default StoreQuickStatistic;
