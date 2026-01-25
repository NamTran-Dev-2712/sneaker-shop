import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Eye, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import { EmptyList } from "~/components/common/shared/empty-list";
import { PurchaseOrderStatusBadge } from "./purchase-order.status-badge";
import {
  PurchaseOrderCardMobile,
  PurchaseOrderCardMobileSkeleton,
} from "~/components/common/card/admin/purchase-order.card-mobile";
import type { PurchaseOrderItem } from "~/services/procurement/purchase-order/dto/get-purchase-order/get-purchase-order.response";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import { PurchaseStatus } from "~/types/entities/purchase-order.type";

interface PurchaseOrderListItemProps {
  items: PurchaseOrderItem[] | undefined;
  isLoading: boolean;
  onView: (item: PurchaseOrderItem) => void;
  onEdit: (item: PurchaseOrderItem) => void;
  onDelete: (item: PurchaseOrderItem) => void;
  onAdd: () => void;
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
};

export const PurchaseOrderListItem = ({
  items,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onAdd,
}: PurchaseOrderListItemProps) => {
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Mã đơn</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>Cửa hàng</TableHead>
                <TableHead className="text-center">Số mặt hàng</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-[120px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile skeleton */}
        <PurchaseOrderCardMobileSkeleton count={4} />
      </>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyList
        icon={ShoppingCart}
        title="Không có đơn đặt hàng"
        description="Chưa có đơn đặt hàng nào được tạo hoặc không tìm thấy kết quả phù hợp với bộ lọc."
        actionLabel="Tạo đơn đặt hàng"
        onAction={onAdd}
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
              <TableHead className="w-[80px]">Mã đơn</TableHead>
              <TableHead>Nhà cung cấp</TableHead>
              <TableHead>Cửa hàng</TableHead>
              <TableHead className="text-center">Số mặt hàng</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const canEdit =
                item.status === PurchaseStatus.CREATED ||
                item.status === PurchaseStatus.ORDERED;
              const canDelete = item.status === PurchaseStatus.CREATED;

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="font-mono text-sm font-medium">
                      #{item.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{item.vendorName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{item.storeName}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{item.itemCount}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">
                      {formatCurrency(item.totalCost)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <PurchaseOrderStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onView(item)}
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(item)}
                          title="Xóa"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
          <PurchaseOrderCardMobile
            key={item.id}
            item={item}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default PurchaseOrderListItem;
