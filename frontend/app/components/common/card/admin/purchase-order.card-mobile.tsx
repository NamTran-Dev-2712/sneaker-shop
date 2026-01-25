import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Eye,
  Trash2,
  MoreHorizontal,
  Store,
  Package,
  Calendar,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { PurchaseOrderStatusBadge } from "~/components/feature/admin/procurement/purchase-order/management/purchase-order.status-badge";
import type { PurchaseOrderItem } from "~/services/procurement/purchase-order/dto/get-purchase-order/get-purchase-order.response";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import { PurchaseStatus } from "~/types/entities/purchase-order.type";

interface PurchaseOrderCardMobileProps {
  item: PurchaseOrderItem;
  onView: (item: PurchaseOrderItem) => void;
  onDelete: (item: PurchaseOrderItem) => void;
}

interface PurchaseOrderCardMobileSkeletonProps {
  count?: number;
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
};

export const PurchaseOrderCardMobile = ({
  item,
  onView,
  onDelete,
}: PurchaseOrderCardMobileProps) => {
  const canDelete = item.status === PurchaseStatus.CREATED;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold">#{item.id}</span>
              <PurchaseOrderStatusBadge status={item.status} />
            </div>
            <p className="font-medium truncate">{item.vendorName}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(item)}>
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(item)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <Store className="h-3.5 w-3.5" />
            {item.storeName}
          </span>
          <span className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" />
            {item.itemCount} mặt hàng
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(item.totalCost)}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PurchaseOrderCardMobileSkeleton = ({
  count = 4,
}: PurchaseOrderCardMobileSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {[...Array(count)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PurchaseOrderCardMobile;
