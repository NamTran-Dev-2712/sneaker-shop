import { Search, X, Filter, RotateCcw } from "lucide-react";
import { useState, useCallback, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SortSlideBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";
import { cn } from "~/lib/utils";

interface SlideFilterProps {
  search: string;
  sortBy: SortSlideBy;
  sortOrder: SortOrder;
  onSearchChange: (search: string) => void;
  onSortByChange: (sortBy: SortSlideBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onReset: () => void;
  className?: string;
}

export const SlideFilter = ({
  search,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
  className,
}: SlideFilterProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounce search with lodash
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearchChange(value);
      }, 500),
    [onSearchChange],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  // Sync local search with props
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleReset = useCallback(() => {
    setLocalSearch("");
    onReset();
  }, [onReset]);

  const hasActiveFilters =
    search || sortBy !== SortSlideBy.CREATED_AT || sortOrder !== SortOrder.DESC;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search bar và toggle button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề, phụ đề hoặc mô tả..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {localSearch && (
            <button
              onClick={() => handleSearchChange("")}
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
            className="shrink-0 text-muted-foreground hover:text-foreground"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Expanded filter options */}
      {isExpanded && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg border">
          <div className="flex-1 min-w-[150px]">
            <label className="text-sm font-medium mb-1.5 block">
              Sắp xếp theo
            </label>
            <Select
              value={sortBy}
              onValueChange={(value) => onSortByChange(value as SortSlideBy)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SortSlideBy.TITLE}>Tiêu đề</SelectItem>
                <SelectItem value={SortSlideBy.CREATED_AT}>Ngày tạo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="text-sm font-medium mb-1.5 block">Thứ tự</label>
            <Select
              value={sortOrder}
              onValueChange={(value) => onSortOrderChange(value as SortOrder)}
            >
              <SelectTrigger>
                <SelectValue />
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

export default SlideFilter;
