import { Palette, Package, CheckCircle } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { ColorStatisticResponse } from "~/services/attribute/color/dto/statistic/color-statistic.response";

interface ColorQuickStatisticProps {
  data: ColorStatisticResponse | null | undefined;
  isLoading: boolean;
}

export const ColorQuickStatistic = ({
  data,
  isLoading,
}: ColorQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatisticCard
        icon={Palette}
        label="Tổng số màu"
        value={data?.totalColors || 0}
        iconColor="text-pink-600"
        iconBgColor="bg-pink-100 dark:bg-pink-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={CheckCircle}
        label="Màu đang sử dụng"
        value={data?.colorsInUse || 0}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Package}
        label="Sản phẩm sử dụng"
        value={data?.totalProductsUsingColors || 0}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ColorQuickStatistic;
