import { formatCurrency } from "~/common/helpers/format-currency.helper";
import type { GetStaffOrderDetailResponse } from "~/services/order/dto/get-staff-order-detail/get-staff-order-detail.response";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import type { StaffOrderAction } from "./constants";

type OrderDetailActionsPanelProps = {
  order: GetStaffOrderDetailResponse;
  actions: StaffOrderAction[];
  isMutating: boolean;
  carrier: string;
  trackingCode: string;
  cancelReason: string;
  onCarrierChange: (value: string) => void;
  onTrackingCodeChange: (value: string) => void;
  onCancelReasonChange: (value: string) => void;
};

const OrderDetailActionsPanel = ({
  order,
  actions,
  isMutating,
  carrier,
  trackingCode,
  cancelReason,
  onCarrierChange,
  onTrackingCodeChange,
  onCancelReasonChange,
}: OrderDetailActionsPanelProps) => {
  const isWaitingCustomerConfirm =
    order.fulfillmentType === "DELIVERY" && order.status === "SHIPPED";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tổng tiền</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Giảm giá</span>
            <span>{formatCurrency(order.discountTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phí ship</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Tổng cộng</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </CardContent>
      </Card>

      {order.status === "PACKED" && order.fulfillmentType === "DELIVERY" && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin bàn giao</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Đơn vị vận chuyển"
              value={carrier}
              onChange={(e) => onCarrierChange(e.target.value)}
            />
            <Input
              placeholder="Mã vận đơn"
              value={trackingCode}
              onChange={(e) => onTrackingCodeChange(e.target.value)}
            />
          </CardContent>
        </Card>
      )}

      {(order.status === "PLACED" || order.status === "CONFIRMED") && (
        <Card>
          <CardHeader>
            <CardTitle>Lý do hủy (nếu có)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={cancelReason}
              onChange={(e) => onCancelReasonChange(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng"
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Thao tác</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {actions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isWaitingCustomerConfirm
                ? "Đơn đã bàn giao cho đơn vị vận chuyển. Chờ khách hàng xác nhận đã nhận hàng."
                : "Không có thao tác hợp lệ cho trạng thái hiện tại."}
            </p>
          ) : (
            actions.map((action) => (
              <Button
                key={action.key}
                className="w-full"
                variant={action.variant ?? "default"}
                disabled={isMutating}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailActionsPanel;
