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
import { SortBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";
import {
  DiscountType,
  VoucherComputedStatus,
  VoucherScope,
} from "~/types/entities/voucher.type";
import { cn } from "~/lib/utils";

interface VoucherFilterProps {
  search: string;
  status: VoucherComputedStatus | undefined;
  scope: VoucherScope | undefined;
  discountType: DiscountType | undefined;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: VoucherComputedStatus | undefined) => void;
  onScopeChange: (scope: VoucherScope | undefined) => void;
  onDiscountTypeChange: (discountType: DiscountType | undefined) => void;
  onSortByChange: (sortBy: SortBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onReset: () => void;
  className?: string;
}

export const VoucherFilter = ({
  search,
  status,
  scope,
  discountType,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onScopeChange,
  onDiscountTypeChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
  className,
}: VoucherFilterProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [isExpanded, setIsExpanded] = useState(false);

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
    status !== undefined ||
    scope !== undefined ||
    discountType !== undefined ||
    sortBy !== SortBy.CREATED_AT ||
    sortOrder !== SortOrder.DESC;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã voucher..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-lg border bg-muted/30 animate-in slide-in-from-top-2 duration-200">
          {/* Status filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <Select
              value={status || "all"}
              onValueChange={(value) =>
                onStatusChange(
                  value === "all"
                    ? undefined
                    : (value as VoucherComputedStatus),
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value={VoucherComputedStatus.ACTIVE}>
                  Đang hoạt động
                </SelectItem>
                <SelectItem value={VoucherComputedStatus.SCHEDULED}>
                  Chờ hiệu lực
                </SelectItem>
                <SelectItem value={VoucherComputedStatus.EXPIRED}>
                  Hết hạn
                </SelectItem>
                <SelectItem value={VoucherComputedStatus.EXHAUSTED}>
                  Hết lượt
                </SelectItem>
                <SelectItem value={VoucherComputedStatus.INACTIVE}>
                  Vô hiệu
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scope filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Phạm vi áp dụng</label>
            <Select
              value={scope || "all"}
              onValueChange={(value) =>
                onScopeChange(
                  value === "all" ? undefined : (value as VoucherScope),
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn phạm vi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value={VoucherScope.ALL}>Tất cả kênh</SelectItem>
                <SelectItem value={VoucherScope.ONLINE}>Online</SelectItem>
                <SelectItem value={VoucherScope.POS}>POS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount type filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Loại giảm giá</label>
            <Select
              value={discountType || "all"}
              onValueChange={(value) =>
                onDiscountTypeChange(
                  value === "all" ? undefined : (value as DiscountType),
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value={DiscountType.PERCENT}>Phần trăm</SelectItem>
                <SelectItem value={DiscountType.FIXED}>
                  Số tiền cố định
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort by */}
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
                <SelectItem value={SortBy.CODE}>Mã voucher</SelectItem>
                <SelectItem value={SortBy.CREATED_AT}>Ngày tạo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort order */}
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

export default VoucherFilter;
