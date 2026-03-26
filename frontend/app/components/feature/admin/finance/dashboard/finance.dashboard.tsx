import { useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  TrendingUp,
  ReceiptText,
  PlusCircle,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { StatisticCard } from "~/components/common/card/admin/statistic.card";
import { EmptyList } from "~/components/common/shared/empty-list";
import { Pagination } from "~/components/common/shared/pagination";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import { formatDateShort } from "~/common/helpers/format-date.helper";
import {
  useCreateManualFinanceEntry,
  useFinanceLedger,
  useFinanceSummary,
  useFinanceTrend,
} from "~/hooks/react-query/use-finance.query";
import { useAllStores } from "~/hooks/react-query/use-store.query";
import {
  FinanceEntrySourceType,
  FinanceEntryStatus,
} from "~/types/entities/finance.type";

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toDateTimeLocalValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const sourceLabelMap: Record<FinanceEntrySourceType, string> = {
  [FinanceEntrySourceType.ORDER_PAYMENT]: "Thanh toán đơn hàng",
  [FinanceEntrySourceType.PURCHASE_ORDER]: "Nhập hàng",
  [FinanceEntrySourceType.MANUAL]: "Thủ công",
};

const FinanceDashboard = () => {
  const now = new Date();
  const firstDateOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [storeId, setStoreId] = useState<number | undefined>(undefined);
  const [fromDate, setFromDate] = useState(toDateInputValue(firstDateOfMonth));
  const [toDate, setToDate] = useState(toDateInputValue(now));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FinanceEntryStatus | "ALL">(
    "ALL",
  );
  const [sourceFilter, setSourceFilter] = useState<
    FinanceEntrySourceType | "ALL"
  >("ALL");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [manualStatus, setManualStatus] = useState<FinanceEntryStatus>(
    FinanceEntryStatus.INCOME,
  );
  const [manualAmount, setManualAmount] = useState<string>("");
  const [manualCategory, setManualCategory] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualStoreId, setManualStoreId] = useState<number | undefined>(
    undefined,
  );
  const [manualOccurredAt, setManualOccurredAt] = useState(
    toDateTimeLocalValue(new Date()),
  );

  const summaryQuery = useMemo(
    () => ({
      storeId,
      fromDate,
      toDate,
    }),
    [storeId, fromDate, toDate],
  );

  const ledgerQuery = useMemo(
    () => ({
      pageNumber,
      pageSize,
      search,
      storeId,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      sourceType: sourceFilter === "ALL" ? undefined : sourceFilter,
      fromDate,
      toDate,
      sortBy: "occurredAt" as const,
      isSortDescending: true,
    }),
    [
      pageNumber,
      pageSize,
      search,
      storeId,
      statusFilter,
      sourceFilter,
      fromDate,
      toDate,
    ],
  );

  const { data: storesData } = useAllStores();
  const { data: summaryData, isLoading: summaryLoading } =
    useFinanceSummary(summaryQuery);
  const { data: trendData, isLoading: trendLoading } =
    useFinanceTrend(summaryQuery);
  const {
    data: ledgerData,
    isLoading: ledgerLoading,
    error: ledgerError,
  } = useFinanceLedger(ledgerQuery);

  const createManualEntryMutation = useCreateManualFinanceEntry();

  const maxTrendValue = useMemo(() => {
    if (!trendData || trendData.length === 0) {
      return 1;
    }

    const maxValue = Math.max(
      ...trendData.flatMap((item) => [item.income, item.expense]),
    );
    return maxValue > 0 ? maxValue : 1;
  }, [trendData]);

  const handleCreateManualEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createManualEntryMutation.mutate(
      {
        status: manualStatus,
        amount: Number(manualAmount),
        category: manualCategory,
        description: manualDescription || undefined,
        storeId: manualStoreId,
        occurredAt: manualOccurredAt
          ? new Date(manualOccurredAt).toISOString()
          : undefined,
      },
      {
        onSuccess: () => {
          setManualAmount("");
          setManualCategory("");
          setManualDescription("");
          setManualOccurredAt(toDateTimeLocalValue(new Date()));
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard tài chính
        </h1>
        <p className="text-muted-foreground">
          Theo dõi doanh thu, chi tiêu và lợi nhuận theo cửa hàng hoặc toàn hệ
          thống.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc thống kê</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Cửa hàng</Label>
            <Select
              value={storeId?.toString() || "all"}
              onValueChange={(value) => {
                setStoreId(value === "all" ? undefined : Number(value));
                setPageNumber(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn cửa hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cửa hàng</SelectItem>
                {storesData?.items?.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Từ ngày</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPageNumber(1);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Đến ngày</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPageNumber(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatisticCard
          icon={ArrowUpCircle}
          label="Tổng thu"
          value={
            summaryLoading
              ? "..."
              : formatCurrency(summaryData?.totalIncome || 0)
          }
          iconColor="text-green-600"
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          isLoading={summaryLoading}
        />
        <StatisticCard
          icon={ArrowDownCircle}
          label="Tổng chi"
          value={
            summaryLoading
              ? "..."
              : formatCurrency(summaryData?.totalExpense || 0)
          }
          iconColor="text-red-600"
          iconBgColor="bg-red-100 dark:bg-red-900/30"
          isLoading={summaryLoading}
        />
        <StatisticCard
          icon={Wallet}
          label="Lợi nhuận"
          value={
            summaryLoading ? "..." : formatCurrency(summaryData?.profit || 0)
          }
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          isLoading={summaryLoading}
        />
        <StatisticCard
          icon={ReceiptText}
          label="Số giao dịch"
          value={summaryLoading ? "..." : summaryData?.totalTransactions || 0}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          isLoading={summaryLoading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Xu hướng thu / chi theo ngày
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendLoading && (
              <div className="space-y-3">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            )}

            {!trendLoading && (!trendData || trendData.length === 0) && (
              <EmptyList
                icon={TrendingUp}
                title="Chưa có dữ liệu xu hướng"
                description="Không có giao dịch nào trong khoảng thời gian đã chọn."
                className="py-10"
              />
            )}

            {!trendLoading && trendData && trendData.length > 0 && (
              <div className="space-y-3">
                {trendData.map((item) => (
                  <div key={item.date} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {formatDateShort(item.date)}
                      </span>
                      <span
                        className={
                          item.profit >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        LN: {formatCurrency(item.profit)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-xs text-muted-foreground">
                          Thu
                        </span>
                        <div className="h-2 flex-1 rounded bg-muted overflow-hidden">
                          <div
                            className="h-2 bg-green-500"
                            style={{
                              width: `${(item.income / maxTrendValue) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground min-w-24 text-right">
                          {formatCurrency(item.income)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-xs text-muted-foreground">
                          Chi
                        </span>
                        <div className="h-2 flex-1 rounded bg-muted overflow-hidden">
                          <div
                            className="h-2 bg-red-500"
                            style={{
                              width: `${(item.expense / maxTrendValue) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground min-w-24 text-right">
                          {formatCurrency(item.expense)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Thêm giao dịch thủ công
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleCreateManualEntry}>
              <div className="space-y-2">
                <Label>Loại giao dịch</Label>
                <Select
                  value={manualStatus}
                  onValueChange={(value) =>
                    setManualStatus(value as FinanceEntryStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FinanceEntryStatus.INCOME}>
                      Thu
                    </SelectItem>
                    <SelectItem value={FinanceEntryStatus.EXPENSE}>
                      Chi
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Số tiền</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="Nhập số tiền"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Input
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  placeholder="Ví dụ: VẬN HÀNH"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Cửa hàng</Label>
                <Select
                  value={manualStoreId?.toString() || "all"}
                  onValueChange={(value) =>
                    setManualStoreId(
                      value === "all" ? undefined : Number(value),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả cửa hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cửa hàng</SelectItem>
                    {storesData?.items?.map((store) => (
                      <SelectItem key={store.id} value={store.id.toString()}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Thời gian phát sinh</Label>
                <Input
                  type="datetime-local"
                  value={manualOccurredAt}
                  onChange={(e) => setManualOccurredAt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  rows={3}
                  placeholder="Ghi chú cho giao dịch"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createManualEntryMutation.isPending}
              >
                {createManualEntryMutation.isPending
                  ? "Đang lưu..."
                  : "Thêm giao dịch"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPageNumber(1);
              }}
              placeholder="Tìm theo danh mục/mô tả"
            />

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as FinanceEntryStatus | "ALL");
                setPageNumber(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả loại</SelectItem>
                <SelectItem value={FinanceEntryStatus.INCOME}>Thu</SelectItem>
                <SelectItem value={FinanceEntryStatus.EXPENSE}>Chi</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sourceFilter}
              onValueChange={(value) => {
                setSourceFilter(value as FinanceEntrySourceType | "ALL");
                setPageNumber(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Nguồn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả nguồn</SelectItem>
                <SelectItem value={FinanceEntrySourceType.ORDER_PAYMENT}>
                  Thanh toán đơn hàng
                </SelectItem>
                <SelectItem value={FinanceEntrySourceType.PURCHASE_ORDER}>
                  Đơn nhập hàng
                </SelectItem>
                <SelectItem value={FinanceEntrySourceType.MANUAL}>
                  Thủ công
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
                setSourceFilter("ALL");
                setPageNumber(1);
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>

          {ledgerError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              <p className="text-sm font-medium">Lỗi khi tải sổ giao dịch</p>
              <p className="text-sm">{ledgerError.message}</p>
            </div>
          )}

          {ledgerLoading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : !ledgerData || ledgerData.items.length === 0 ? (
            <EmptyList
              icon={ReceiptText}
              title="Chưa có giao dịch"
              description="Không tìm thấy giao dịch phù hợp với bộ lọc hiện tại."
              className="py-12"
            />
          ) : (
            <>
              <div className="hidden md:block rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Nguồn</TableHead>
                      <TableHead>Cửa hàng</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead className="text-right">Số tiền</TableHead>
                      <TableHead>Mô tả</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledgerData.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {formatDateShort(item.occurredAt)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.status === FinanceEntryStatus.INCOME
                                ? "text-green-700 border-green-300"
                                : "text-red-700 border-red-300"
                            }
                          >
                            {item.status === FinanceEntryStatus.INCOME
                              ? "Thu"
                              : "Chi"}
                          </Badge>
                        </TableCell>
                        <TableCell>{sourceLabelMap[item.sourceType]}</TableCell>
                        <TableCell>
                          {item.storeName || "Toàn hệ thống"}
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell
                          className={`text-right font-semibold ${
                            item.status === FinanceEntryStatus.INCOME
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="max-w-65 truncate">
                          {item.description || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-1 gap-3 md:hidden">
                {ledgerData.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {formatDateShort(item.occurredAt)}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            item.status === FinanceEntryStatus.INCOME
                              ? "text-green-700 border-green-300"
                              : "text-red-700 border-red-300"
                          }
                        >
                          {item.status === FinanceEntryStatus.INCOME
                            ? "Thu"
                            : "Chi"}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium">{item.category}</div>
                      <div className="text-xs text-muted-foreground">
                        {sourceLabelMap[item.sourceType]} •{" "}
                        {item.storeName || "Toàn hệ thống"}
                      </div>
                      <div
                        className={`text-base font-semibold ${
                          item.status === FinanceEntryStatus.INCOME
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(item.amount)}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Pagination
                currentPage={pageNumber}
                totalPages={ledgerData.totalPages}
                totalItems={ledgerData.totalItems}
                pageSize={pageSize}
                hasPreviousPage={ledgerData.hasPreviousPage}
                hasNextPage={ledgerData.hasNextPage}
                onPageChange={setPageNumber}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPageNumber(1);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceDashboard;
