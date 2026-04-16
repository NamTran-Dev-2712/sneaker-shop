import { Ticket, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";

interface VoucherQuickStatisticProps {
  totalItems: number | undefined;
  activeCount: number | undefined;
  scheduledCount: number | undefined;
  expiredCount: number | undefined;
  inactiveCount: number | undefined;
  isLoading: boolean;
}

export const VoucherQuickStatistic = ({
  totalItems,
  activeCount,
  scheduledCount,
  expiredCount,
  inactiveCount,
  isLoading,
}: VoucherQuickStatisticProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatisticCard
        icon={Ticket}
        label="Tổng voucher"
        value={totalItems || 0}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={CheckCircle}
        label="Đang hoạt động"
        value={activeCount || 0}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={Clock}
        label="Chờ hiệu lực"
        value={scheduledCount || 0}
        iconColor="text-amber-600"
        iconBgColor="bg-amber-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={XCircle}
        label="Đã hết hạn"
        value={expiredCount || 0}
        iconColor="text-red-600"
        iconBgColor="bg-red-100"
        isLoading={isLoading}
      />
      <StatisticCard
        icon={AlertCircle}
        label="Vô hiệu hoá"
        value={inactiveCount || 0}
        iconColor="text-gray-600"
        iconBgColor="bg-gray-100"
        isLoading={isLoading}
      />
    </div>
  );
};

export default VoucherQuickStatistic;
