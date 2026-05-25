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
import type { GetColorItem } from "~/services/attribute/color/dto/get-color/get-color.response";
import { Palette } from "lucide-react";

interface ColorListItemProps {
  colors: GetColorItem[] | undefined;
  isLoading: boolean;
  onEdit: (color: GetColorItem) => void;
  onDelete: (color: GetColorItem) => void;
  onAdd: () => void;
}

export const ColorListItem = ({
  colors,
  isLoading,
  onEdit,
  onDelete,
  onAdd,
}: ColorListItemProps) => {
  // Skeleton loading
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Màu</TableHead>
                <TableHead>Tên màu</TableHead>
                <TableHead>Mã HEX</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-[80px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
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
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  // Empty state
  if (!colors || colors.length === 0) {
    return (
      <EmptyList
        icon={Palette}
        title="Chưa có màu nào"
        description="Bạn chưa tạo màu nào hoặc không tìm thấy kết quả phù hợp với bộ lọc."
        actionLabel="Thêm màu mới"
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
              <TableHead className="w-[60px]">Màu</TableHead>
              <TableHead>Tên màu</TableHead>
              <TableHead>Mã HEX</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colors.map((color) => (
              <TableRow key={color.id} className="group">
                <TableCell>
                  <div
                    className="h-8 w-8 rounded-full border-2 border-border shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                  />
                </TableCell>
                <TableCell>
                  <p className="font-medium">{color.name}</p>
                  <p className="text-sm text-muted-foreground">{color.slug}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono">
                    {color.hex}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{color.productCount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(color.createdAt).toLocaleDateString("vi-VN")}
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
                      <DropdownMenuItem onClick={() => onEdit(color)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(color)}
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
        {colors.map((color) => (
          <Card
            key={color.id}
            className="overflow-hidden hover:shadow-md transition-shadow group"
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                {/* Color swatch */}
                <div
                  className="h-12 w-12 rounded-full border-2 border-border shadow-md"
                  style={{ backgroundColor: color.hex }}
                />

                {/* Name */}
                <div>
                  <p className="font-medium text-sm truncate">{color.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {color.hex}
                  </p>
                </div>

                {/* Product count */}
                <Badge variant="secondary" className="text-xs">
                  {color.productCount} sản phẩm
                </Badge>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(color)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(color)}
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

export default ColorListItem;
