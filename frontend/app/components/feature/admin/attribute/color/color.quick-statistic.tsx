import { Palette, Package } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { GetColorResponse } from "~/services/attribute/color/dto/get-color/get-color.response";

interface ColorQuickStatisticProps {
  data: GetColorResponse | null | undefined;
  isLoading: boolean;
}

export const ColorQuickStatistic = ({
  data,
  isLoading,
}: ColorQuickStatisticProps) => {
  // Tính toán thống kê
  const totalColors = data?.totalItems || 0;
  const totalProducts =
    data?.items?.reduce((sum, c) => sum + (c.productCount || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatisticCard
        icon={Palette}
        label="Tổng số màu"
        value={totalColors}
        iconColor="text-pink-600"
        iconBgColor="bg-pink-100 dark:bg-pink-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Package}
        label="Sản phẩm sử dụng"
        value={totalProducts}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ColorQuickStatistic;
