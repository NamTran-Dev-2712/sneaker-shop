import { Eye, Package, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { EmptyList } from "~/components/common/shared/empty-list";
import {
  InventoryCardMobile,
  InventoryCardMobileSkeleton,
} from "~/components/common/card/admin/inventory.card-mobile";
import type { GetInventoryItem } from "~/services/inventory/dto/get-inventory/get-inventory.response";
import { SellableType } from "~/types/entities/sellable.type";
import { cn } from "~/lib/utils";

interface InventoryListItemProps {
  items: GetInventoryItem[] | undefined;
  isLoading: boolean;
  onViewDetail: (item: GetInventoryItem) => void;
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

export const InventoryListItem = ({
  items,
  isLoading,
  onViewDetail,
}: InventoryListItemProps) => {
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Sản phẩm</TableHead>
                <TableHead>Cửa hàng</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className="text-right">Tồn kho</TableHead>
                <TableHead className="text-right">Đã đặt</TableHead>
                <TableHead className="text-right">Khả dụng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile skeleton */}
        <InventoryCardMobileSkeleton count={4} />
      </>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyList
        icon={Package}
        title="Không có dữ liệu tồn kho"
        description="Chưa có sản phẩm nào trong kho hoặc không tìm thấy kết quả phù hợp với bộ lọc."
      />
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Sản phẩm</TableHead>
              <TableHead>Cửa hàng</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead className="text-right">Tồn kho</TableHead>
              <TableHead className="text-right">Đã đặt</TableHead>
              <TableHead className="text-right">Khả dụng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const stockStatus = getStockStatus(item.available, item.onHand);
              const StatusIcon = stockStatus.icon;

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[230px]">
                        {item.productName}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>SKU: {item.sku}</span>
                        {item.colorName && (
                          <>
                            <span>•</span>
                            <span>{item.colorName}</span>
                          </>
                        )}
                        {item.sizeName && (
                          <>
                            <span>•</span>
                            <span>Size {item.sizeName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{item.storeName}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getSellableTypeLabel(item.sellableType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.onHand}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        item.reserved > 0 && "text-amber-600 font-medium",
                      )}
                    >
                      {item.reserved}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "font-bold",
                        item.available === 0 && "text-destructive",
                        item.available > 0 &&
                          item.available <= 5 &&
                          "text-amber-600",
                        item.available > 5 && "text-green-600",
                      )}
                    >
                      {item.available}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={stockStatus.variant}
                      className={cn("gap-1", stockStatus.className)}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {stockStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onViewDetail(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {items.map((item) => (
          <InventoryCardMobile
            key={item.id}
            item={item}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>
    </>
  );
};

export default InventoryListItem;
