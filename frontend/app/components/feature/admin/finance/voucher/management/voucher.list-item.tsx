import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Pencil, Trash2, ToggleLeft, ToggleRight, Ticket } from "lucide-react";
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
import type { VoucherItem } from "~/services/finance/voucher/dto/get-voucher/get-voucher.response";
import { VoucherComputedStatus } from "~/types/entities/voucher.type";

interface VoucherListItemProps {
  items: VoucherItem[] | undefined;
  isLoading: boolean;
  isTogglePending: boolean;
  onEdit: (item: VoucherItem) => void;
  onDelete: (item: VoucherItem) => void;
  onToggle: (item: VoucherItem) => void;
  onAdd: () => void;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "—";
  return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const getStatusBadge = (status: string) => {
  switch (status) {
    case VoucherComputedStatus.ACTIVE:
      return <Badge variant="success">Hoạt động</Badge>;
    case VoucherComputedStatus.SCHEDULED:
      return <Badge variant="default">Chờ hiệu lực</Badge>;
    case VoucherComputedStatus.EXPIRED:
      return <Badge variant="destructive">Hết hạn</Badge>;
    case VoucherComputedStatus.EXHAUSTED:
      return <Badge variant="outline">Hết lượt</Badge>;
    case VoucherComputedStatus.INACTIVE:
    default:
      return <Badge variant="secondary">Vô hiệu</Badge>;
  }
};

const formatDiscountValue = (
  discountType: string,
  discountValue: number,
  maxDiscount?: number,
) => {
  if (discountType === "PERCENT") {
    const max = maxDiscount ? ` (tối đa ${formatCurrency(maxDiscount)})` : "";
    return `${discountValue}%${max}`;
  }
  return formatCurrency(discountValue);
};

const getScopeLabel = (scope: string) => {
  switch (scope) {
    case "ONLINE":
      return "Online";
    case "POS":
      return "POS";
    default:
      return "Tất cả";
  }
};

export const VoucherListItem = ({
  items,
  isLoading,
  isTogglePending,
  onEdit,
  onDelete,
  onToggle,
  onAdd,
}: VoucherListItemProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã voucher</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead>Phạm vi</TableHead>
              <TableHead className="text-center">Đã dùng</TableHead>
              <TableHead>Hiệu lực</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-25"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(7)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyList
        icon={Ticket}
        title="Không có voucher"
        description="Chưa có voucher nào được tạo hoặc không tìm thấy kết quả phù hợp với bộ lọc."
        actionLabel="Thêm voucher"
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã voucher</TableHead>
            <TableHead>Giảm giá</TableHead>
            <TableHead>Phạm vi</TableHead>
            <TableHead className="text-center">Đã dùng</TableHead>
            <TableHead>Hiệu lực</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-25"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <span className="font-mono font-semibold text-sm">
                  {item.code}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {formatDiscountValue(
                    item.discountType,
                    item.discountValue,
                    item.maxDiscount,
                  )}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{getScopeLabel(item.scope)}</span>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-sm">
                  {item.usageCount}
                  {item.usageLimit ? ` / ${item.usageLimit}` : ""}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col text-xs text-muted-foreground">
                  {item.startsAt && (
                    <span>Từ: {formatDate(item.startsAt)}</span>
                  )}
                  {item.endsAt && <span>Đến: {formatDate(item.endsAt)}</span>}
                  {!item.startsAt && !item.endsAt && (
                    <span>Không giới hạn</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(item.computedStatus)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(item)}
                    title="Chỉnh sửa"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onToggle(item)}
                    disabled={isTogglePending}
                    title={item.isActive ? "Vô hiệu hoá" : "Kích hoạt"}
                    className={
                      item.isActive
                        ? "text-amber-600 hover:text-amber-700"
                        : "text-green-600 hover:text-green-700"
                    }
                  >
                    {item.isActive ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(item)}
                    title="Xóa"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VoucherListItem;
