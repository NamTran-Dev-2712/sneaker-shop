import { Package, CheckCircle, XCircle, Layers } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import type { GetSneakerResponse } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.response";

interface SneakerQuickStatisticProps {
  data: GetSneakerResponse | null | undefined;
  isLoading: boolean;
}

export const SneakerQuickStatistic = ({
  data,
  isLoading,
}: SneakerQuickStatisticProps) => {
  // Tính toán thống kê
  const totalSneakers = data?.totalItems || 0;
  const activeSneakers = data?.items?.filter((s) => s.isActive).length || 0;
  const inactiveSneakers = data?.items?.filter((s) => !s.isActive).length || 0;
  const totalVariants =
    data?.items?.reduce((sum, s) => sum + (s.variantCount || 0), 0) || 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticCard
        icon={Package}
        label="Tổng sản phẩm"
        value={totalSneakers}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={CheckCircle}
        label="Đang bán"
        value={activeSneakers}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={XCircle}
        label="Tạm ẩn"
        value={inactiveSneakers}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Layers}
        label="Biến thể"
        value={totalVariants}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default SneakerQuickStatistic;
