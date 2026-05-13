import { useState } from "react";
import { Link } from "react-router";
import { Package, Search, ShoppingBag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Pagination } from "~/components/common/shared/pagination";
import { useMyOrders } from "~/hooks/react-query/use-order.query";
import OrderCard from "./order-card";

// ========================
// Status filter options
// ========================
const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "PLACED", label: "Đã đặt" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "PACKED", label: "Đã đóng gói" },
  { value: "SHIPPED", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã hủy" },
];

// ========================
// Skeleton loader
// ========================
const OrderSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-lg border p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Skeleton className="hidden sm:block h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
    ))}
  </div>
);

// ========================
// Component
// ========================
const OrderListPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("ALL");

  const { data, isLoading, isError } = useMyOrders({
    pageNumber,
    pageSize,
    status: status === "ALL" ? undefined : status,
  });

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPageNumber(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageNumber(1);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Đơn hàng của tôi
          </h1>
          <p className="mt-1 text-muted-foreground">
            Theo dõi và quản lý đơn hàng của bạn
          </p>
        </div>

        {/* Status Filter */}
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <OrderSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-4">
            <Search className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold">Không thể tải đơn hàng</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Đã xảy ra lỗi khi tải danh sách đơn hàng. Vui lòng thử lại sau.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">
            {status !== "ALL"
              ? "Không có đơn hàng nào"
              : "Bạn chưa có đơn hàng nào"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {status !== "ALL"
              ? "Không tìm thấy đơn hàng nào với trạng thái đã chọn."
              : "Hãy khám phá các sản phẩm và đặt đơn hàng đầu tiên!"}
          </p>
          {status !== "ALL" ? (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => handleStatusChange("ALL")}
            >
              Xem tất cả đơn hàng
            </Button>
          ) : (
            <Button className="mt-4" asChild>
              <Link to="/sneakers">
                <Package className="mr-2 h-4 w-4" />
                Mua sắm ngay
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Order List */}
          <div className="space-y-4">
            {data.items.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <Pagination
              currentPage={pageNumber}
              totalPages={data.totalPages}
              totalItems={data.totalItems}
              pageSize={pageSize}
              hasPreviousPage={data.hasPreviousPage}
              hasNextPage={data.hasNextPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              className="mt-6"
            />
          )}
        </>
      )}
    </div>
  );
};

export default OrderListPage;
