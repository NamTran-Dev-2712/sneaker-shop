import {
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  Palette,
  Layers,
  CheckCircle,
  XCircle,
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
import type { GetSneakerItem } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.response";
import { Package } from "lucide-react";
import { useNavigate } from "react-router";
import {
  SneakerCardMobile,
  SneakerCardMobileSkeleton,
} from "~/components/common/card/admin/sneaker.card-mobile";

interface SneakerListItemProps {
  sneakers: GetSneakerItem[] | undefined;
  isLoading: boolean;
  onEdit: (sneaker: GetSneakerItem) => void;
  onDelete: (sneaker: GetSneakerItem) => void;
  onView: (sneaker: GetSneakerItem) => void;
  onAdd: () => void;
}

export const SneakerListItem = ({
  sneakers,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onAdd,
}: SneakerListItemProps) => {
  const navigate = useNavigate();

  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Hãng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Màu/Biến thể</TableHead>
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
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
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
            <SneakerCardMobileSkeleton key={idx} />
          ))}
        </div>
      </>
    );
  }

  // Empty state
  if (!sneakers || sneakers.length === 0) {
    return (
      <EmptyList
        icon={Package}
        title="Chưa có sản phẩm nào"
        description="Bạn chưa tạo sản phẩm nào hoặc không tìm thấy kết quả phù hợp với bộ lọc."
        actionLabel="Thêm sản phẩm"
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
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Hãng</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Màu/Biến thể</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sneakers.map((sneaker) => (
              <TableRow key={sneaker.id} className="group">
                <TableCell>
                  <img
                    src={sneaker.mainImage}
                    alt={sneaker.name}
                    className="h-12 w-12 rounded-lg object-cover border"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-product.png";
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="max-w-[250px]">
                    <p className="font-medium truncate">{sneaker.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {sneaker.slug}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{sneaker.brand.name}</p>
                    {sneaker.brandSeries && (
                      <p className="text-sm text-muted-foreground">
                        {sneaker.brandSeries.name}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {formatPrice(sneaker.basePrice)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span>{sneaker.colorCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span>{sneaker.variantCount}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={sneaker.isActive ? "success" : "secondary"}
                    className="gap-1"
                  >
                    {sneaker.isActive ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Đang bán
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        Tạm ẩn
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
                      <DropdownMenuItem onClick={() => onView(sneaker)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(sneaker)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(sneaker)}
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
        {sneakers.map((sneaker) => (
          <SneakerCardMobile
            key={sneaker.id}
            sneaker={sneaker}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default SneakerListItem;
