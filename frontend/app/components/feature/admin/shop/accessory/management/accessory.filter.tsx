import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useCategoryAll } from "~/hooks/react-query/use-category.query";

interface AccessoryFilterProps {
  search: string;
  categoryId: number | undefined;
  isActive: boolean | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  sortBy: string;
  sortOrder: string;
  onSearchChange: (search: string) => void;
  onCategoryChange: (categoryId: number | undefined) => void;
  onIsActiveChange: (isActive: boolean | undefined) => void;
  onMinPriceChange: (minPrice: number | undefined) => void;
  onMaxPriceChange: (maxPrice: number | undefined) => void;
  onSortByChange: (sortBy: string) => void;
  onSortOrderChange: (sortOrder: string) => void;
  onReset: () => void;
}

const SORT_BY_OPTIONS = [
  { value: "createdAt", label: "Ngày tạo" },
  { value: "name", label: "Tên phụ kiện" },
  { value: "basePrice", label: "Giá" },
];

const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Giảm dần" },
  { value: "asc", label: "Tăng dần" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "true", label: "Đang hoạt động" },
  { value: "false", label: "Tạm ngưng" },
];

export const AccessoryFilter = ({
  search,
  categoryId,
  isActive,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
  onSearchChange,
  onCategoryChange,
  onIsActiveChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
}: AccessoryFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch categories for filter
  const { data: categories } = useCategoryAll();

  // Đếm số filter đang active
  const activeFilterCount = [
    categoryId !== undefined,
    isActive !== undefined,
    minPrice !== undefined,
    maxPrice !== undefined,
    sortBy !== "createdAt",
    sortOrder !== "desc",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0 || search.trim() !== "";

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên phụ kiện..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Category Quick Filter - Desktop */}
        <Select
          value={categoryId?.toString() || "all"}
          onValueChange={(value) =>
            onCategoryChange(value === "all" ? undefined : Number(value))
          }
        >
          <SelectTrigger className="w-full sm:w-[180px] h-10">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Quick Filter - Desktop */}
        <Select
          value={isActive === undefined ? "all" : isActive.toString()}
          onValueChange={(value) =>
            onIsActiveChange(value === "all" ? undefined : value === "true")
          }
        >
          <SelectTrigger className="w-full sm:w-[160px] h-10">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filter Popover */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 h-10 shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Bộ lọc</span>
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Bộ lọc nâng cao</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onReset();
                      setIsFilterOpen(false);
                    }}
                    className="h-8 text-xs gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Đặt lại
                  </Button>
                )}
              </div>

              <Separator />

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Khoảng giá (VNĐ)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={minPrice || ""}
                    onChange={(e) =>
                      onMinPriceChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="h-9"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={maxPrice || ""}
                    onChange={(e) =>
                      onMaxPriceChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="h-9"
                  />
                </div>
              </div>

              <Separator />

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sắp xếp theo</label>
                <Select value={sortBy} onValueChange={onSortByChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn trường sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_BY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Thứ tự</label>
                <Select value={sortOrder} onValueChange={onSortOrderChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn thứ tự" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_ORDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={() => setIsFilterOpen(false)}>
                Áp dụng
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Quick Sort Toggle */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-10 w-10 shrink-0",
            sortOrder === "asc" && "bg-accent",
          )}
          onClick={() =>
            onSortOrderChange(sortOrder === "desc" ? "asc" : "desc")
          }
          title={sortOrder === "desc" ? "Đang giảm dần" : "Đang tăng dần"}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Đang lọc:</span>
          {search && (
            <Badge variant="secondary" className="gap-1">
              Tìm: "{search}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSearchChange("")}
              />
            </Badge>
          )}
          {categoryId && (
            <Badge variant="secondary" className="gap-1">
              {categories?.find((c) => c.id === categoryId)?.name || "Danh mục"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onCategoryChange(undefined)}
              />
            </Badge>
          )}
          {isActive !== undefined && (
            <Badge variant="secondary" className="gap-1">
              {isActive ? "Đang hoạt động" : "Tạm ngưng"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onIsActiveChange(undefined)}
              />
            </Badge>
          )}
          {(minPrice || maxPrice) && (
            <Badge variant="secondary" className="gap-1">
              Giá: {minPrice ? formatPrice(minPrice) : "0"} -{" "}
              {maxPrice ? formatPrice(maxPrice) : "∞"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  onMinPriceChange(undefined);
                  onMaxPriceChange(undefined);
                }}
              />
            </Badge>
          )}
          {sortBy !== "createdAt" && (
            <Badge variant="secondary" className="gap-1">
              {SORT_BY_OPTIONS.find((o) => o.value === sortBy)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSortByChange("createdAt")}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-6 text-xs text-muted-foreground hover:text-foreground"
          >
            Xóa tất cả
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccessoryFilter;
