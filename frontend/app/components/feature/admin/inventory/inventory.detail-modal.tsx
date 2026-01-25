import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import type { GetInventoryDetailResponse } from "~/services/inventory/dto/get-inventory/get-inventory.response";
import { SellableType } from "~/types/entities/sellable.type";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import { cn } from "~/lib/utils";

interface InventoryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: GetInventoryDetailResponse | null | undefined;
  isLoading: boolean;
}

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

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
};

export const InventoryDetailModal = ({
  open,
  onOpenChange,
  data,
  isLoading,
}: InventoryDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết tồn kho</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : data ? (
          <div className="space-y-4">
            {/* Product Info */}
            <div>
              <h3 className="font-semibold text-lg">{data.productName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  {getSellableTypeLabel(data.sellableType)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  SKU: {data.sku}
                </span>
                {data.barcode && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      Barcode: {data.barcode}
                    </span>
                  </>
                )}
              </div>
              {(data.colorName || data.sizeName) && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  {data.colorName && <span>Màu: {data.colorName}</span>}
                  {data.colorName && data.sizeName && <span>•</span>}
                  {data.sizeName && <span>Size: {data.sizeName}</span>}
                </div>
              )}
            </div>

            <Separator />

            {/* Store Info */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Thông tin cửa hàng
              </h4>
              <p className="font-medium">{data.storeName}</p>
              {data.storeAddress && (
                <p className="text-sm text-muted-foreground">
                  {data.storeAddress}
                </p>
              )}
            </div>

            <Separator />

            {/* Stock Info */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Thông tin tồn kho
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{data.onHand}</p>
                  <p className="text-xs text-muted-foreground">Tồn kho</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50">
                  <p className="text-2xl font-bold text-amber-600">
                    {data.reserved}
                  </p>
                  <p className="text-xs text-muted-foreground">Đã đặt</p>
                </div>
                <div
                  className={cn(
                    "text-center p-3 rounded-lg",
                    data.available === 0 && "bg-red-50",
                    data.available > 0 && data.available <= 5 && "bg-amber-50",
                    data.available > 5 && "bg-green-50",
                  )}
                >
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      data.available === 0 && "text-red-600",
                      data.available > 0 &&
                        data.available <= 5 &&
                        "text-amber-600",
                      data.available > 5 && "text-green-600",
                    )}
                  >
                    {data.available}
                  </p>
                  <p className="text-xs text-muted-foreground">Khả dụng</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Giá bán</p>
                <p className="font-medium">
                  {formatCurrency(data.productPrice)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Giá trị tồn kho</p>
                <p className="font-medium">
                  {formatCurrency(data.productPrice * data.onHand)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Ngày tạo</p>
                <p className="font-medium">{formatDate(data.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cập nhật lần cuối</p>
                <p className="font-medium">{formatDate(data.updatedAt)}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Không tìm thấy thông tin
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InventoryDetailModal;
