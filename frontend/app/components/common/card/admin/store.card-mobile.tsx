import {
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
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
import type { GetStoreItem } from "~/services/shop/store/dto/get-store/get-store.response";
import { cn } from "~/lib/utils";

interface StoreCardMobileProps {
  store: GetStoreItem;
  onEdit: (store: GetStoreItem) => void;
  onDelete: (store: GetStoreItem) => void;
}

export const StoreCardMobile = ({
  store,
  onEdit,
  onDelete,
}: StoreCardMobileProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                {store.code}
              </span>
            </div>
            <h3 className="font-semibold truncate">{store.name}</h3>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(store)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(store)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-2">
        {store.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{store.address}</span>
          </div>
        )}
        {store.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{store.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{store.staffCount} nhân viên</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Badge
          variant={store.isActive ? "default" : "secondary"}
          className={cn(
            store.isActive
              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
          )}
        >
          {store.isActive ? "Hoạt động" : "Tạm đóng"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {new Date(store.createdAt).toLocaleDateString("vi-VN")}
        </span>
      </CardFooter>
    </Card>
  );
};

export default StoreCardMobile;
