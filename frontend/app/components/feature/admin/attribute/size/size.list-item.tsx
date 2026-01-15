import { Edit, MoreHorizontal, Trash2, Package } from "lucide-react";
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
import { Card, CardContent } from "~/components/ui/card";
import { EmptyList } from "~/components/common/shared/empty-list";
import type { GetSizeItem } from "~/services/attribute/size/dto/get-size/get-size.response";
import { Ruler } from "lucide-react";
import { cn } from "~/lib/utils";

interface SizeListItemProps {
  sizes: GetSizeItem[] | undefined;
  isLoading: boolean;
  onEdit: (size: GetSizeItem) => void;
  onDelete: (size: GetSizeItem) => void;
  onAdd: () => void;
}

// Màu cho từng hệ thống size
const SYSTEM_COLORS: Record<string, string> = {
  US: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  UK: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  EU: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CM: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export const SizeListItem = ({
  sizes,
  isLoading,
  onEdit,
  onDelete,
  onAdd,
}: SizeListItemProps) => {
  // Skeleton loading
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hệ thống</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-[80px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-6 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:hidden">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-12 mx-auto" />
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  // Empty state
  if (!sizes || sizes.length === 0) {
    return (
      <EmptyList
        icon={Ruler}
        title="Chưa có size nào"
        description="Bạn chưa tạo size nào hoặc không tìm thấy kết quả phù hợp với bộ lọc."
        actionLabel="Thêm size mới"
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
              <TableHead>Hệ thống</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.map((size) => (
              <TableRow key={size.id} className="group">
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn("font-medium", SYSTEM_COLORS[size.system])}
                  >
                    {size.system}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-lg font-semibold">{size.value}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{size.productCount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(size.createdAt).toLocaleDateString("vi-VN")}
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
                      <DropdownMenuItem onClick={() => onEdit(size)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(size)}
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:hidden">
        {sizes.map((size) => (
          <Card
            key={size.id}
            className="overflow-hidden hover:shadow-md transition-shadow group"
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                {/* System badge */}
                <Badge
                  variant="secondary"
                  className={cn("font-medium", SYSTEM_COLORS[size.system])}
                >
                  {size.system}
                </Badge>

                {/* Value */}
                <span className="text-2xl font-bold">{size.value}</span>

                {/* Product count */}
                <Badge variant="outline" className="text-xs">
                  {size.productCount} sản phẩm
                </Badge>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(size)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(size)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default SizeListItem;
