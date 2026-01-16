import { Package, CheckCircle, XCircle, Layers } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { BrandStatisticResponse } from "~/services/shop/brand/dto/statistic/brand-statistic.response";

interface BrandQuickStatisticProps {
  data: BrandStatisticResponse | null | undefined;
  isLoading: boolean;
}

export const BrandQuickStatistic = ({
  data,
  isLoading,
}: BrandQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticCard
        icon={Package}
        label="Tổng số hãng"
        value={data?.totalBrands || 0}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={CheckCircle}
        label="Đang hoạt động"
        value={data?.activeBrands || 0}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={XCircle}
        label="Tạm ngừng"
        value={data?.inactiveBrands || 0}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Layers}
        label="Tổng dòng sản phẩm"
        value={data?.totalBrandSeries || 0}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default BrandQuickStatistic;
