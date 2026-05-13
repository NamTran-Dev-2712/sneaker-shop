import { useState } from "react";
import {
  useMyAvailableVouchers,
  useMyRedeemedVouchers,
} from "~/hooks/react-query/use-customer-voucher.query";
import { formatDate } from "~/common/helpers/format-date.helper";
import { formatCurrency } from "~/common/helpers/format-currency.helper";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Ticket,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import { showSuccessToast } from "~/components/common/toast/toast.success";

const PAGE_SIZE = 10;

const DiscountBadge = ({
  discountType,
  discountValue,
  maxDiscount,
}: {
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
}) => {
  if (discountType === "PERCENT") {
    return (
      <span className="text-primary font-bold text-lg">
        -{discountValue}%
        {maxDiscount && (
          <span className="text-xs font-normal text-muted-foreground ml-1">
            (tối đa {formatCurrency(maxDiscount)})
          </span>
        )}
      </span>
    );
  }
  return (
    <span className="text-primary font-bold text-lg">
      -{formatCurrency(discountValue)}
    </span>
  );
};

const CopyCodeButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    showSuccessToast("Đã sao chép mã voucher");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 font-mono font-semibold bg-muted px-2 py-1 rounded text-sm hover:bg-muted/70 transition-colors"
    >
      <span>{code}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </button>
  );
};

const VoucherPage = () => {
  const [redeemedPage, setRedeemedPage] = useState(1);

  const { data: available, isLoading: availableLoading } =
    useMyAvailableVouchers();
  const { data: redeemed, isLoading: redeemedLoading } = useMyRedeemedVouchers({
    pageNumber: redeemedPage,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <div className="flex items-center gap-3">
        <Ticket className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Voucher của tôi</h1>
      </div>

      <Tabs defaultValue="available">
        <TabsList className="w-full">
          <TabsTrigger value="available" className="flex-1">
            Có thể dùng
          </TabsTrigger>
          <TabsTrigger value="redeemed" className="flex-1">
            Đã sử dụng
          </TabsTrigger>
        </TabsList>

        {/* Available Vouchers */}
        <TabsContent value="available" className="mt-4">
          {availableLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg" />
              ))}
            </div>
          ) : !available || available.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                Bạn chưa có voucher nào có thể sử dụng.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {available.map((v) => (
                <Card
                  key={v.code}
                  className="border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CopyCodeButton code={v.code} />
                          <Badge variant="secondary" className="text-xs">
                            {v.scope === "ONLINE" ? "Online" : "Toàn hệ thống"}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <DiscountBadge
                            discountType={v.discountType}
                            discountValue={v.discountValue}
                            maxDiscount={v.maxDiscount}
                          />
                        </div>
                        {v.minOrderTotal && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Đơn tối thiểu {formatCurrency(v.minOrderTotal)}
                          </p>
                        )}
                        {v.endsAt && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            HSD:{" "}
                            {formatDate(v.endsAt, {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Redeemed Vouchers */}
        <TabsContent value="redeemed" className="mt-4">
          {redeemedLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : !redeemed || redeemed.items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                Bạn chưa sử dụng voucher nào.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-0">
                {redeemed.items.map((r, idx) => (
                  <div key={`${r.code}-${r.orderId}`}>
                    {idx > 0 && <Separator />}
                    <div className="py-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-sm bg-muted px-2 py-0.5 rounded">
                          {r.code}
                        </span>
                        <span className="text-green-700 font-semibold text-sm">
                          -{formatCurrency(r.discountAmount)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Đơn hàng: {r.orderRef}
                      </p>
                      {r.redeemedAt && (
                        <p className="text-xs text-muted-foreground">
                          {formatDate(r.redeemedAt, {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {redeemed.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRedeemedPage((p) => p - 1)}
                    disabled={!redeemed.hasPreviousPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {redeemedPage} / {redeemed.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRedeemedPage((p) => p + 1)}
                    disabled={!redeemed.hasNextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoucherPage;
