import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Eye, Pencil, Trash2, Package, Users } from "lucide-react";
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
  VendorCardMobile,
  VendorCardMobileSkeleton,
} from "~/components/common/card/admin/vendor.card-mobile";
import type { VendorItem } from "~/services/procurement/vendor/dto/get-vendor/get-vendor.response";

interface VendorListItemProps {
  items: VendorItem[] | undefined;
  isLoading: boolean;
  onView: (item: VendorItem) => void;
  onEdit: (item: VendorItem) => void;
  onDelete: (item: VendorItem) => void;
  onAdd: () => void;
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
};

export const VendorListItem = ({
  items,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onAdd,
}: VendorListItemProps) => {
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Tên nhà cung cấp</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead className="text-center">Số sản phẩm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-[120px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
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
        <VendorCardMobileSkeleton count={4} />
      </>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyList
        icon={Users}
        title="Không có nhà cung cấp"
        description="Chưa có nhà cung cấp nào được tạo hoặc không tìm thấy kết quả phù hợp với bộ lọc."
        actionLabel="Thêm nhà cung cấp"
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
              <TableHead className="w-[200px]">Tên nhà cung cấp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead className="text-center">Số sản phẩm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    {item.address && (
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {item.address}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{item.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{item.phone}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{item.productCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? "success" : "secondary"}>
                    {item.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                  </Badge>
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

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {items.map((item) => (
          <VendorCardMobile
            key={item.id}
            item={item}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default VendorListItem;
