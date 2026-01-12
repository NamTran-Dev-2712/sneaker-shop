import {
  Edit,
  MoreHorizontal,
  Trash2,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { StoreCardMobile } from "~/components/common/card/admin/store.card-mobile";
import { EmptyList } from "~/components/common/shared/empty-list";
import type { GetStoreItem } from "~/services/shop/store/dto/get-store/get-store.response";
import { cn } from "~/lib/utils";
import { Store } from "lucide-react";

interface StoreListItemProps {
  stores: GetStoreItem[] | undefined;
  isLoading: boolean;
  onEdit: (store: GetStoreItem) => void;
  onDelete: (store: GetStoreItem) => void;
  onAdd: () => void;
}

export const StoreListItem = ({
  stores,
  isLoading,
  onEdit,
  onDelete,
  onAdd,
}: StoreListItemProps) => {
  // Skeleton loading
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã</TableHead>
                <TableHead>Tên cửa hàng</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead className="w-[120px]">SĐT</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
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
            <div key={idx} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // Empty state
  if (!stores || stores.length === 0) {
    return (
      <EmptyList
        icon={Store}
        title="Chưa có cửa hàng nào"
        description="Bạn chưa tạo cửa hàng nào hoặc không tìm thấy kết quả phù hợp với bộ lọc."
        actionLabel="Thêm cửa hàng mới"
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
              <TableHead className="w-[100px]">Mã</TableHead>
              <TableHead>Tên cửa hàng</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead className="w-[120px]">SĐT</TableHead>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id} className="group">
                <TableCell>
                  <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
                    {store.code}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-[200px]">
                  {store.address ? (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{store.address}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {store.phone ? (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      <span>{store.phone}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{store.staffCount}</span>
                  </div>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {stores.map((store) => (
          <StoreCardMobile
            key={store.id}
            store={store}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default StoreListItem;
