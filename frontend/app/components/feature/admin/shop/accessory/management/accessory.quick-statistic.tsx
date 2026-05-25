import { Package, CheckCircle, XCircle, Image } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { GetAccessoryStatisticResponse } from "~/services/shop/accessory/dto/statistic/get-accessory-statistic.response";

interface AccessoryQuickStatisticProps {
  data: GetAccessoryStatisticResponse | undefined;
  isLoading: boolean;
}

export const AccessoryQuickStatistic = ({
  data,
  isLoading,
}: AccessoryQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticCard
        icon={Package}
        label="Tổng phụ kiện"
        value={data?.totalAccessories || 0}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={CheckCircle}
        label="Đang hoạt động"
        value={data?.activeAccessories || 0}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={XCircle}
        label="Tạm ngưng"
        value={data?.inactiveAccessories || 0}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Image}
        label="Tổng hình ảnh"
        value={data?.totalImages || 0}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default AccessoryQuickStatistic;
