import { useState } from "react";
import {
  useMyLoyaltyAccount,
  useMyLoyaltyTransactions,
} from "~/hooks/react-query/use-loyalty.query";
import { formatDate } from "~/common/helpers/format-date.helper";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Star, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

const TXN_TYPE_LABEL: Record<string, { label: string; color: string }> = {
  EARN: { label: "Tích điểm", color: "text-green-700" },
  REDEEM: { label: "Đổi điểm", color: "text-red-600" },
  ADJUST: { label: "Điều chỉnh", color: "text-blue-600" },
  EXPIRE: { label: "Hết hạn", color: "text-muted-foreground" },
};

const LoyaltyPage = () => {
  const [page, setPage] = useState(1);

  const { data: account, isLoading: accountLoading } = useMyLoyaltyAccount();
  const { data: txnData, isLoading: txnLoading } = useMyLoyaltyTransactions({
    pageNumber: page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <h1 className="text-2xl font-bold">Điểm thưởng của tôi</h1>

      {/* Balance Card */}
      <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          {accountLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-24" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-primary fill-primary" />
                  <span className="text-3xl font-bold text-primary">
                    {(account?.pointsBalance ?? 0).toLocaleString("vi-VN")}
                  </span>
                  <span className="text-muted-foreground text-sm">điểm</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  1,000₫ = 1 điểm · Tích lũy khi đơn hàng được giao thành công
                </p>
              </div>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 text-sm px-3 py-1"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                {account?.tier ?? "STANDARD"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lịch sử điểm</CardTitle>
        </CardHeader>
        <CardContent>
          {txnLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !txnData || txnData.items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              Chưa có giao dịch điểm nào.
            </p>
          ) : (
            <div className="space-y-0">
              {txnData.items.map((txn, idx) => {
                const typeInfo = TXN_TYPE_LABEL[txn.txnType] ?? {
                  label: txn.txnType,
                  color: "text-foreground",
                };
                const isPositive = txn.points > 0;

                return (
                  <div key={txn.id}>
                    {idx > 0 && <Separator />}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className={`text-sm font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {txn.reason ??
                            (txn.orderId
                              ? `Đơn hàng ORD-${String(txn.orderId).padStart(6, "0")}`
                              : "—")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(txn.createdAt, {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span
                        className={`text-base font-semibold ${isPositive ? "text-green-700" : "text-red-600"}`}
                      >
                        {isPositive ? "+" : ""}
                        {txn.points.toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {txnData.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-xs text-muted-foreground">
                    Trang {page} / {txnData.totalPages} · {txnData.totalItems}{" "}
                    giao dịch
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={!txnData.hasPreviousPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!txnData.hasNextPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyPage;
