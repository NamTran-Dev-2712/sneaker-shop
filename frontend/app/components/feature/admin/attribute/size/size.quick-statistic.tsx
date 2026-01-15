import { Ruler, Package } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { GetSizeResponse } from "~/services/attribute/size/dto/get-size/get-size.response";

interface SizeQuickStatisticProps {
  data: GetSizeResponse | null | undefined;
  isLoading: boolean;
}

export const SizeQuickStatistic = ({
  data,
  isLoading,
}: SizeQuickStatisticProps) => {
  // Tính toán thống kê
  const totalSizes = data?.totalItems || 0;
  const totalProducts =
    data?.items?.reduce((sum, s) => sum + (s.productCount || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatisticCard
        icon={Ruler}
        label="Tổng số size"
        value={totalSizes}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
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

export default SizeQuickStatistic;
