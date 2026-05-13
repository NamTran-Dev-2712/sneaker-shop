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
import { SortOrder } from "~/types/global/filter/sort-order.filter";
import { cn } from "~/lib/utils";
import { useAllStores } from "~/hooks/react-query/use-store.query";
import type { SortStaffBy } from "~/services/user/staff/dto/get-staff/get-staff.request";

interface StaffFilterProps {
  search: string;
  storeId: number | undefined;
  isActive: boolean | undefined;
  sortBy: SortStaffBy;
  sortOrder: SortOrder;
  onSearchChange: (search: string) => void;
  onStoreIdChange: (storeId: number | undefined) => void;
  onIsActiveChange: (isActive: boolean | undefined) => void;
  onSortByChange: (sortBy: SortStaffBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onReset: () => void;
  className?: string;
}

export const StaffFilter = ({
  search,
  storeId,
  isActive,
  sortBy,
  sortOrder,
  onSearchChange,
  onStoreIdChange,
  onIsActiveChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
  className,
}: StaffFilterProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: storesData } = useAllStores();

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearchChange(value);
      }, 500),
    [onSearchChange],
  );

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

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleReset = useCallback(() => {
    setLocalSearch("");
    onReset();
  }, [onReset]);

  const hasActiveFilters =
    search ||
    storeId !== undefined ||
    isActive !== undefined ||
    sortBy !== "name" ||
    sortOrder !== SortOrder.ASC;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, email, SĐT, cửa hàng..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {localSearch && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg border bg-muted/30 animate-in slide-in-from-top-2 duration-200">
          {/* Store filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cửa hàng</label>
            <Select
              value={storeId?.toString() || "all"}
              onValueChange={(value) => {
                onStoreIdChange(value === "all" ? undefined : parseInt(value));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn cửa hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {storesData?.items?.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
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
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Đã vô hiệu hóa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort by filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sắp xếp theo</label>
            <Select
              value={sortBy}
              onValueChange={(value) => onSortByChange(value as SortStaffBy)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn cột sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Họ và tên</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="store">Cửa hàng</SelectItem>
                <SelectItem value="createdAt">Ngày tạo</SelectItem>
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

export default StaffFilter;
