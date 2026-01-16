import { Ruler, Package, CheckCircle } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { SizeStatisticResponse } from "~/services/attribute/size/dto/statistic/size-statistic.response";

interface SizeQuickStatisticProps {
  data: SizeStatisticResponse | null | undefined;
  isLoading: boolean;
}

export const SizeQuickStatistic = ({
  data,
  isLoading,
}: SizeQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatisticCard
        icon={Ruler}
        label="Tổng số size"
        value={data?.totalSizes || 0}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={CheckCircle}
        label="Size đang sử dụng"
        value={data?.sizesInUse || 0}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Package}
        label="Sản phẩm sử dụng"
        value={data?.totalProductsUsingSizes || 0}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default SizeQuickStatistic;
