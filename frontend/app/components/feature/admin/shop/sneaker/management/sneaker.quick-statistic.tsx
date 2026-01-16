import { Package, CheckCircle, XCircle, Layers } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { SneakerStatisticResponse } from "~/services/shop/sneaker/dto/statistic/sneaker-statistic.response";

interface SneakerQuickStatisticProps {
  data: SneakerStatisticResponse | null | undefined;
  isLoading: boolean;
}

export const SneakerQuickStatistic = ({
  data,
  isLoading,
}: SneakerQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticCard
        icon={Package}
        label="Tổng sản phẩm"
        value={data?.totalSneakers || 0}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={CheckCircle}
        label="Đang bán"
        value={data?.activeSneakers || 0}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={XCircle}
        label="Tạm ẩn"
        value={data?.inactiveSneakers || 0}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Layers}
        label="Biến thể"
        value={data?.totalSellableItems || 0}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default SneakerQuickStatistic;
