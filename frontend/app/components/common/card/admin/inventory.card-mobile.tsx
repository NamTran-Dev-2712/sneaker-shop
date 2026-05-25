import {
  Eye,
  Package,
  AlertTriangle,
  XCircle,
  Store,
  Tag,
  Layers,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import type { GetInventoryItem } from "~/services/inventory/dto/get-inventory/get-inventory.response";
import { SellableType } from "~/types/entities/sellable.type";
import { cn } from "~/lib/utils";

interface InventoryCardMobileProps {
  item: GetInventoryItem;
  onViewDetail: (item: GetInventoryItem) => void;
}

interface InventoryCardMobileSkeletonProps {
  count?: number;
}

const getStockStatus = (available: number, onHand: number) => {
  if (available === 0 && onHand === 0) {
    return {
      label: "Hết hàng",
      variant: "destructive" as const,
      icon: XCircle,
      className: "",
    };
  }
  if (available <= 5) {
    return {
      label: "Sắp hết",
      variant: "secondary" as const,
      icon: AlertTriangle,
      className: "bg-amber-100 text-amber-800 border-amber-200",
    };
  }
  return {
    label: "Còn hàng",
    variant: "secondary" as const,
    icon: Package,
    className: "bg-green-100 text-green-800 border-green-200",
  };
};

const getSellableTypeLabel = (type: string) => {
  switch (type) {
    case SellableType.SNEAKER_VARIANT:
      return "Giày Sneaker";
    case SellableType.ACCESSORY:
      return "Phụ kiện";
    default:
      return type;
  }
};

export const InventoryCardMobile = ({
  item,
  onViewDetail,
}: InventoryCardMobileProps) => {
  const stockStatus = getStockStatus(item.available, item.onHand);
  const StatusIcon = stockStatus.icon;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.productName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              SKU: {item.sku}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onViewDetail(item)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs gap-1">
            <Tag className="h-3 w-3" />
            {getSellableTypeLabel(item.sellableType)}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Store className="h-3 w-3" />
            {item.storeName}
          </span>
          {(item.colorName || item.sizeName) && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {[item.colorName, item.sizeName && `Size ${item.sizeName}`]
                .filter(Boolean)
                .join(" • ")}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="grid grid-cols-3 gap-4 text-center flex-1">
            <div>
              <p className="text-xs text-muted-foreground">Tồn kho</p>
              <p className="font-medium">{item.onHand}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Đã đặt</p>
              <p
                className={cn(
                  "font-medium",
                  item.reserved > 0 && "text-amber-600",
                )}
              >
                {item.reserved}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Khả dụng</p>
              <p
                className={cn(
                  "font-bold",
                  item.available === 0 && "text-destructive",
                  item.available > 0 && item.available <= 5 && "text-amber-600",
                  item.available > 5 && "text-green-600",
                )}
              >
                {item.available}
              </p>
            </div>
          </div>
          <Badge
            variant={stockStatus.variant}
            className={cn("gap-1 ml-4", stockStatus.className)}
          >
            <StatusIcon className="h-3 w-3" />
            {stockStatus.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export const InventoryCardMobileSkeleton = ({
  count = 4,
}: InventoryCardMobileSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {[...Array(count)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-between pt-3 border-t">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InventoryCardMobile;
