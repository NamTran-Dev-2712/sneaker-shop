import { Search, X, Filter, RotateCcw } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SortBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";
import { cn } from "~/lib/utils";
import { useBrandList } from "~/hooks/react-query/use-brand.query";

interface SneakerFilterProps {
  search: string;
  brandId: number | undefined;
  isActive: boolean | undefined;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSearchChange: (search: string) => void;
  onBrandChange: (brandId: number | undefined) => void;
  onIsActiveChange: (isActive: boolean | undefined) => void;
  onSortByChange: (sortBy: SortBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onReset: () => void;
  className?: string;
}

export const SneakerFilter = ({
  search,
  brandId,
  isActive,
  sortBy,
  sortOrder,
  onSearchChange,
  onBrandChange,
  onIsActiveChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
  className,
}: SneakerFilterProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [isExpanded, setIsExpanded] = useState(false);

  // Lấy danh sách brands
  const { data: brandsData } = useBrandList({ pageNumber: 1, pageSize: 100 });

  // Debounce search - 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  // Sync local search with props
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleReset = useCallback(() => {
    setLocalSearch("");
    onReset();
  }, [onReset]);

  const hasActiveFilters =
    search ||
    brandId !== undefined ||
    isActive !== undefined ||
    sortBy !== SortBy.CREATED_AT ||
    sortOrder !== SortOrder.DESC;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search bar và toggle button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          variant={isExpanded ? "secondary" : "outline"}
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0"
        >
          <Filter className="h-4 w-4" />
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="shrink-0"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter options - expandable */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg border bg-muted/30 animate-in slide-in-from-top-2 duration-200">
          {/* Brand filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hãng</label>
            <Select
              value={brandId?.toString() || "all"}
              onValueChange={(value) => {
                onBrandChange(value === "all" ? undefined : parseInt(value));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn hãng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {brandsData?.items?.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <Select
              value={
                isActive === undefined
                  ? "all"
                  : isActive
                    ? "active"
                    : "inactive"
              }
              onValueChange={(value) => {
                if (value === "all") {
                  onIsActiveChange(undefined);
                } else {
                  onIsActiveChange(value === "active");
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang bán</SelectItem>
                <SelectItem value="inactive">Tạm ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort by filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sắp xếp theo</label>
            <Select
              value={sortBy}
              onValueChange={(value) => onSortByChange(value as SortBy)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn cột sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SortBy.NAME}>Tên</SelectItem>
                <SelectItem value={SortBy.CREATED_AT}>Ngày tạo</SelectItem>
                <SelectItem value={SortBy.UPDATED_AT}>Ngày cập nhật</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort order filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Thứ tự</label>
            <Select
              value={sortOrder}
              onValueChange={(value) => onSortOrderChange(value as SortOrder)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SortOrder.ASC}>Tăng dần</SelectItem>
                <SelectItem value={SortOrder.DESC}>Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SneakerFilter;
