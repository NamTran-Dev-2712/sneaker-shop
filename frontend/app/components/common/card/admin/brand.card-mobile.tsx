import { MoreHorizontal, Edit, Trash2, Eye, Layers } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { GetBrandItem } from "~/services/shop/brand/dto/get-brand/get-brand.response";
import { cn } from "~/lib/utils";

interface BrandCardMobileProps {
  brand: GetBrandItem;
  onEdit: (brand: GetBrandItem) => void;
  onDelete: (brand: GetBrandItem) => void;
  onViewDetail?: (brand: GetBrandItem) => void;
}

export const BrandCardMobile = ({
  brand,
  onEdit,
  onDelete,
  onViewDetail,
}: BrandCardMobileProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="h-14 w-14 shrink-0 rounded-lg border bg-muted overflow-hidden">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                Logo
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{brand.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {brand.slug}
            </p>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetail && (
                <DropdownMenuItem onClick={() => onViewDetail(brand)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(brand)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(brand)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="h-4 w-4" />
          <span>{brand.seriesCount} dòng sản phẩm</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Badge
          variant={brand.isActive ? "default" : "secondary"}
          className={cn(
            brand.isActive
              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
          )}
        >
          {brand.isActive ? "Hoạt động" : "Tạm ẩn"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {new Date(brand.createdAt).toLocaleDateString("vi-VN")}
        </span>
      </CardFooter>
    </Card>
  );
};

export default BrandCardMobile;
