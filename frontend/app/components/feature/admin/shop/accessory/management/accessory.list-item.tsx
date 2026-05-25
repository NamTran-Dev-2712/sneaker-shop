import {
  Eye,
  Edit,
  MoreHorizontal,
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  Image,
  FolderOpen,
  Tag,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent } from "~/components/ui/card";
import { EmptyList } from "~/components/common/shared/empty-list";
import type { GetAccessoryItemResponse } from "~/services/shop/accessory/dto/get-accessory/get-accessory.response";
import {
  AccessoryCardMobile,
  AccessoryCardMobileSkeleton,
} from "~/components/common/card/admin/accessory.card-mobile";

interface AccessoryListItemProps {
  accessories: GetAccessoryItemResponse[] | undefined;
  isLoading: boolean;
  onEdit: (accessory: GetAccessoryItemResponse) => void;
  onDelete: (accessory: GetAccessoryItemResponse) => void;
  onView: (accessory: GetAccessoryItemResponse) => void;
  onAdd: () => void;
}

export const AccessoryListItem = ({
  accessories,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onAdd,
}: AccessoryListItemProps) => {
  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Skeleton loading
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Ảnh</TableHead>
                <TableHead>Phụ kiện</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Hãng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {Array.from({ length: 4 }).map((_, idx) => (
            <AccessoryCardMobileSkeleton key={idx} />
          ))}
        </div>
      </>
    );
  }

  // Empty state
  if (!accessories || accessories.length === 0) {
    return (
      <EmptyList
        icon={Package}
        title="Chưa có phụ kiện nào"
        description="Bạn chưa tạo phụ kiện nào hoặc không tìm thấy kết quả phù hợp với bộ lọc."
        actionLabel="Thêm phụ kiện"
        onAction={onAdd}
      />
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">Ảnh</TableHead>
              <TableHead>Phụ kiện</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Hãng</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessories.map((accessory) => (
              <TableRow key={accessory.id} className="group">
                <TableCell>
                  <img
                    src={accessory.mainImage}
                    alt={accessory.name}
                    className="h-12 w-12 rounded-lg object-cover border"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-product.png";
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="max-w-[250px]">
                    <p className="font-medium truncate">{accessory.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {accessory.slug}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Image className="h-3 w-3" />
                        {accessory.imageCount}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{accessory.category.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>{accessory.brand.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-primary">
                    {formatPrice(accessory.basePrice)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={accessory.isActive ? "success" : "secondary"}
                    className="gap-1"
                  >
                    {accessory.isActive ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Hoạt động
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        Tạm ngưng
                      </>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(accessory)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(accessory)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(accessory)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {accessories.map((accessory) => (
          <AccessoryCardMobile
            key={accessory.id}
            accessory={accessory}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default AccessoryListItem;
