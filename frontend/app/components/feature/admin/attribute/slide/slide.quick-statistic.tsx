import { Images, Eye } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";

interface SlideQuickStatisticProps {
  totalSlides: number;
  isLoading: boolean;
}

export const SlideQuickStatistic = ({
  totalSlides,
  isLoading,
}: SlideQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatisticCard
        icon={Images}
        label="Tổng số slide"
        value={totalSlides}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Eye}
        label="Hiển thị trên trang chủ"
        value={totalSlides}
        iconColor="text-green-600"
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isLoading}
      />
    </div>
  );
};

export default SlideQuickStatistic;
