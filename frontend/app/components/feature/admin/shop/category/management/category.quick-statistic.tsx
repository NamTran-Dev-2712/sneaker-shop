import { FolderOpen, Tag, Package, TrendingUp } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { GetCategoryAccessoryStatisticResponse } from "~/services/shop/category/dto/statistic/get-category-accessory-statistic.response";

interface CategoryQuickStatisticProps {
  data: GetCategoryAccessoryStatisticResponse | undefined;
  isLoading: boolean;
}

export const CategoryQuickStatistic = ({
  data,
  isLoading,
}: CategoryQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticCard
        icon={FolderOpen}
        label="Tổng danh mục"
        value={data?.totalCategories || 0}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={TrendingUp}
        label="Đang hoạt động"
        value={data?.activeCategories || 0}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Tag}
        label="Tổng hãng"
        value={data?.totalBrands || 0}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Package}
        label="Tổng phụ kiện"
        value={data?.totalAccessories || 0}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default CategoryQuickStatistic;
