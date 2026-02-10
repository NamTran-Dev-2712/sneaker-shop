import {
  Edit,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Images,
} from "lucide-react";
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
import type { GetSlideItem } from "~/services/attribute/slide/dto/get-slide/get-slide.response";

interface SlideListItemProps {
  slides: GetSlideItem[] | undefined;
  isLoading: boolean;
  onEdit: (slide: GetSlideItem) => void;
  onDelete: (slide: GetSlideItem) => void;
  onAdd: () => void;
}

export const SlideListItem = ({
  slides,
  isLoading,
  onEdit,
  onDelete,
  onAdd,
}: SlideListItemProps) => {
  // Skeleton loading
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Ảnh</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Phụ đề</TableHead>
                <TableHead>Nút</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-[80px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-16 w-28 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-32 w-full rounded" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  // Empty state
  if (!slides || slides.length === 0) {
    return (
      <EmptyList
        icon={Images}
        title="Chưa có slide nào"
        description="Bạn chưa tạo slide nào. Thêm slide để hiển thị trên trang chủ."
        actionLabel="Thêm slide mới"
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
              <TableHead className="w-[120px]">Ảnh</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Phụ đề</TableHead>
              <TableHead>Nút</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.map((slide) => (
              <TableRow key={slide.id} className="group">
                <TableCell>
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="h-16 w-28 object-cover rounded border"
                  />
                </TableCell>
                <TableCell>
                  <p className="font-medium line-clamp-1">{slide.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {slide.description}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm line-clamp-1">{slide.subtitle}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{slide.buttonText}</span>
                    <a
                      href={slide.buttonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(slide.createdAt).toLocaleDateString("vi-VN")}
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
                      <DropdownMenuItem onClick={() => onEdit(slide)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(slide)}
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
        {slides.map((slide) => (
          <Card
            key={slide.id}
            className="overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="relative">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="h-32 w-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(slide)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(slide)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium line-clamp-1">{slide.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {slide.subtitle}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(slide.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {slide.buttonText}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default SlideListItem;
