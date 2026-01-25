import {
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  FolderOpen,
  Tag,
  Package,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import type { GetCategoryAccessoryItem } from "~/services/shop/category/dto/get-category-accessory/get-category-accessory.response";

interface CategoryCardMobileProps {
  category: GetCategoryAccessoryItem;
  onView: (category: GetCategoryAccessoryItem) => void;
  onEdit: (category: GetCategoryAccessoryItem) => void;
  onDelete: (category: GetCategoryAccessoryItem) => void;
}

export const CategoryCardMobile = ({
  category,
  onView,
  onEdit,
  onDelete,
}: CategoryCardMobileProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{category.name}</p>
                <Badge variant="outline" className="font-mono text-xs mt-1">
                  {category.slug}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(category)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(category)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(category)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>{category.brandCount} hãng</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{category.accessoryCount} phụ kiện</span>
            </div>
          </div>

          {/* Brands preview */}
          {category.brands && category.brands.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {category.brands.slice(0, 3).map((brand) => (
                <Badge key={brand.id} variant="secondary" className="text-xs">
                  {brand.name}
                </Badge>
              ))}
              {category.brands.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{category.brands.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Date */}
          <p className="text-xs text-muted-foreground">
            Tạo ngày: {formatDate(category.createdAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const CategoryCardMobileSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
