import {
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  FolderOpen,
  Tag,
  CheckCircle,
  XCircle,
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
import type { GetAccessoryItemResponse } from "~/services/shop/accessory/dto/get-accessory/get-accessory.response";

interface AccessoryCardMobileProps {
  accessory: GetAccessoryItemResponse;
  onView: (accessory: GetAccessoryItemResponse) => void;
  onEdit: (accessory: GetAccessoryItemResponse) => void;
  onDelete: (accessory: GetAccessoryItemResponse) => void;
}

export const AccessoryCardMobile = ({
  accessory,
  onView,
  onEdit,
  onDelete,
}: AccessoryCardMobileProps) => {
  const formatPrice = (price?: number) => {
    if (!price) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Image */}
          <img
            src={accessory.mainImage}
            alt={accessory.name}
            className="h-24 w-24 rounded-lg object-cover border shrink-0"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-product.png";
            }}
          />

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium truncate">{accessory.name}</p>
                <Badge variant="outline" className="font-mono text-xs mt-1">
                  {accessory.slug}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
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
            </div>

            {/* Category & Brand */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FolderOpen className="h-3 w-3" />
                {accessory.category.name}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {accessory.brand.name}
              </span>
            </div>

            {/* Price & Status */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">
                {formatPrice(accessory.basePrice)}
              </span>
              <Badge
                variant={accessory.isActive ? "success" : "secondary"}
                className="gap-1 text-xs"
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AccessoryCardMobileSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
