import {
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  Palette,
  Layers,
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
import type { GetSneakerItem } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.response";

interface SneakerCardMobileProps {
  sneaker: GetSneakerItem;
  onView: (sneaker: GetSneakerItem) => void;
  onEdit: (sneaker: GetSneakerItem) => void;
  onDelete: (sneaker: GetSneakerItem) => void;
}

export const SneakerCardMobile = ({
  sneaker,
  onView,
  onEdit,
  onDelete,
}: SneakerCardMobileProps) => {
  const formatPrice = (price?: number) => {
    if (!price) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <img
            src={sneaker.mainImage}
            alt={sneaker.name}
            className="h-20 w-20 rounded-lg object-cover border shrink-0"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-product.png";
            }}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{sneaker.name}</p>
            <p className="text-sm text-muted-foreground mb-2">
              {sneaker.brand.name}
              {sneaker.brandSeries && ` - ${sneaker.brandSeries.name}`}
            </p>
            <p className="text-lg font-semibold text-primary">
              {formatPrice(sneaker.basePrice)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              {sneaker.colorCount}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              {sneaker.variantCount}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
        </div>
      </CardContent>
    </Card>
  );
};

export const SneakerCardMobileSkeleton = () => {
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
