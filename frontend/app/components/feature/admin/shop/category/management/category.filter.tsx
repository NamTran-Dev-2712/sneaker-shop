import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
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
import { cn } from "~/lib/utils";
import { SortBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

interface CategoryFilterProps {
  search: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSearchChange: (search: string) => void;
  onSortByChange: (sortBy: SortBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onReset: () => void;
}

const SORT_BY_OPTIONS = [
  { value: SortBy.CREATED_AT, label: "Ngày tạo" },
  { value: SortBy.NAME, label: "Tên danh mục" },
];

const SORT_ORDER_OPTIONS = [
  { value: SortOrder.DESC, label: "Giảm dần" },
  { value: SortOrder.ASC, label: "Tăng dần" },
];

export const CategoryFilter = ({
  search,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
}: CategoryFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Đếm số filter đang active
  const activeFilterCount = [
    sortBy !== SortBy.CREATED_AT,
    sortOrder !== SortOrder.DESC,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0 || search.trim() !== "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên danh mục..."
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

        {/* Filter Popover */}
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
                    className="h-8 text-xs"
                  >
                    Đặt lại
                  </Button>
                )}
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sắp xếp theo</label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => onSortByChange(value as SortBy)}
                >
                  <SelectTrigger>
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
                <Select
                  value={sortOrder}
                  onValueChange={(value) =>
                    onSortOrderChange(value as SortOrder)
                  }
                >
                  <SelectTrigger>
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
            sortOrder === SortOrder.ASC && "bg-accent",
          )}
          onClick={() =>
            onSortOrderChange(
              sortOrder === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC,
            )
          }
          title={
            sortOrder === SortOrder.DESC ? "Đang giảm dần" : "Đang tăng dần"
          }
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
          {sortBy !== SortBy.CREATED_AT && (
            <Badge variant="secondary" className="gap-1">
              {SORT_BY_OPTIONS.find((o) => o.value === sortBy)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSortByChange(SortBy.CREATED_AT)}
              />
            </Badge>
          )}
          {sortOrder !== SortOrder.DESC && (
            <Badge variant="secondary" className="gap-1">
              Tăng dần
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSortOrderChange(SortOrder.DESC)}
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

export default CategoryFilter;
