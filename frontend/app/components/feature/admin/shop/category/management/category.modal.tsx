import { FolderOpen, Tag, Package, Calendar, Clock } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { ModalLayout } from "~/components/common/modal/modal.layout";
import type { GetCategoryAccessoryDetailResponse } from "~/services/shop/category/dto/get-category-accessory/get-category-accessory.response";

interface CategoryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: GetCategoryAccessoryDetailResponse | undefined;
  isLoading: boolean;
  onEdit: () => void;
}

export const CategoryDetailModal = ({
  open,
  onOpenChange,
  category,
  isLoading,
  onEdit,
}: CategoryDetailModalProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Separator />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>
    </div>
  );

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Chi tiết danh mục phụ kiện"
      description="Xem thông tin chi tiết của danh mục"
      className="sm:max-w-[550px]"
      footer={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={onEdit}>Chỉnh sửa</Button>
        </div>
      }
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : category ? (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <FolderOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <h3 className="text-xl font-semibold truncate">
                {category.name}
              </h3>
              <Badge variant="outline" className="font-mono text-xs">
                {category.slug}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Tag className="h-4 w-4" />
                <span className="text-sm">Số hãng</span>
              </div>
              <p className="text-2xl font-bold">
                {category.brands?.length || 0}
              </p>
            </div>
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Package className="h-4 w-4" />
                <span className="text-sm">Số phụ kiện</span>
              </div>
              <p className="text-2xl font-bold">{category.accessoryCount}</p>
            </div>
          </div>

          {/* Brands List */}
          {category.brands && category.brands.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Danh sách hãng ({category.brands.length})
              </h4>
              <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                {category.brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex items-center gap-3 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <img
                      src={brand.thumbnailUrl}
                      alt={brand.name}
                      className="h-10 w-10 rounded-lg object-cover border"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-brand.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{brand.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {brand.accessoryCount} phụ kiện
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {brand.slug}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Ngày tạo: {formatDate(category.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Cập nhật: {formatDate(category.updatedAt)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          Không tìm thấy thông tin danh mục
        </div>
      )}
    </ModalLayout>
  );
};

export default CategoryDetailModal;
