import { Layers, CheckCircle, Package } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { GetBrandResponse } from "~/services/shop/brand/dto/get-brand/get-brand.response";

interface BrandQuickStatisticProps {
  data: GetBrandResponse | null | undefined;
  isLoading: boolean;
}

export const BrandQuickStatistic = ({
  data,
  isLoading,
}: BrandQuickStatisticProps) => {
  // Tính toán thống kê
  const totalBrands = data?.totalItems || 0;
  const activeBrands = data?.items?.filter((b) => b.isActive).length || 0;
  const totalSeries =
    data?.items?.reduce((sum, b) => sum + (b.seriesCount || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatisticCard
        icon={Package}
        label="Tổng số hãng"
        value={totalBrands}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={CheckCircle}
        label="Đang hoạt động"
        value={activeBrands}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Layers}
        label="Tổng dòng sản phẩm"
        value={totalSeries}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default BrandQuickStatistic;
