import { Badge } from "~/components/ui/badge";
import { PurchaseStatus } from "~/types/entities/purchase-order.type";
import { FileText, ShoppingCart, PackageCheck, XCircle } from "lucide-react";
import { cn } from "~/lib/utils";

interface PurchaseOrderStatusBadgeProps {
  status: PurchaseStatus;
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  [PurchaseStatus.CREATED]: {
    label: "Đã tạo",
    variant: "secondary" as const,
    icon: FileText,
    color: "text-gray-600",
  },
  [PurchaseStatus.ORDERED]: {
    label: "Đã đặt hàng",
    variant: "default" as const,
    icon: ShoppingCart,
    color: "text-blue-600",
  },
  [PurchaseStatus.RECEIVED]: {
    label: "Đã nhận hàng",
    variant: "success" as const,
    icon: PackageCheck,
    color: "text-green-600",
  },
  [PurchaseStatus.CANCELLED]: {
    label: "Đã hủy",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-600",
  },
};

export const PurchaseOrderStatusBadge = ({
  status,
  showIcon = true,
  className,
}: PurchaseOrderStatusBadgeProps) => {
  const config = statusConfig[status];

  // Handle undefined config (invalid status)
  if (!config) {
    return (
      <Badge variant="outline" className={cn("gap-1", className)}>
        {status || "Không xác định"}
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={cn("gap-1", className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
};

// Helper function to get status label
export const getPurchaseStatusLabel = (status: PurchaseStatus): string => {
  return statusConfig[status]?.label || status;
};

// Helper function to get all status options for select
export const getPurchaseStatusOptions = () => {
  return Object.entries(statusConfig).map(([value, config]) => ({
    value: value as PurchaseStatus,
    label: config.label,
  }));
};

// Helper function to get valid next statuses
export const getValidNextStatuses = (
  currentStatus: PurchaseStatus,
): PurchaseStatus[] => {
  switch (currentStatus) {
    case PurchaseStatus.CREATED:
      return [PurchaseStatus.ORDERED, PurchaseStatus.CANCELLED];
    case PurchaseStatus.ORDERED:
      return [PurchaseStatus.RECEIVED, PurchaseStatus.CANCELLED];
    case PurchaseStatus.RECEIVED:
      return []; // Final state
    case PurchaseStatus.CANCELLED:
      return []; // Final state
    default:
      return [];
  }
};

export default PurchaseOrderStatusBadge;
