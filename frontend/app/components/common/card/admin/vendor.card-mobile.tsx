import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Eye,
  Pencil,
  Trash2,
  Package,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { VendorItem } from "~/services/procurement/vendor/dto/get-vendor/get-vendor.response";

interface VendorCardMobileProps {
  item: VendorItem;
  onView: (item: VendorItem) => void;
  onEdit: (item: VendorItem) => void;
  onDelete: (item: VendorItem) => void;
}

interface VendorCardMobileSkeletonProps {
  count?: number;
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
};

export const VendorCardMobile = ({
  item,
  onView,
  onEdit,
  onDelete,
}: VendorCardMobileProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium">{item.name}</p>
            <Badge
              variant={item.isActive ? "success" : "secondary"}
              className="mt-1 text-xs"
            >
              {item.isActive ? "Hoạt động" : "Ngừng hoạt động"}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(item)}>
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{item.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{item.phone}</span>
          </div>
          {item.address && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{item.address}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span className="font-medium">{item.productCount}</span>
            <span>sản phẩm</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const VendorCardMobileSkeleton = ({
  count = 4,
}: VendorCardMobileSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {[...Array(count)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VendorCardMobile;
