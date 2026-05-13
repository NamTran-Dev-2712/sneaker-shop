import { Package } from "lucide-react";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import type { GetStaffOrderDetailResponse } from "~/services/order/dto/get-staff-order-detail/get-staff-order-detail.response";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type OrderDetailMainInfoProps = {
  order: GetStaffOrderDetailResponse;
};

const OrderDetailMainInfo = ({ order }: OrderDetailMainInfoProps) => {
  return (
    <div className="space-y-6 lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Khách hàng</span>
            <span>{order.customerName || "Khách lẻ"}</span>
            <span className="text-muted-foreground">Số điện thoại</span>
            <span>{order.customerPhone || "-"}</span>
            <span className="text-muted-foreground">Chi nhánh xử lý</span>
            <span>{order.storeName || "-"}</span>
            <span className="text-muted-foreground">Hình thức nhận</span>
            <span>{order.fulfillmentType || "-"}</span>
            <span className="text-muted-foreground">Thanh toán</span>
            <span>
              {order.paymentMethod || "-"} / {order.paymentStatus || "-"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Sản phẩm ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item) => (
            <div
              key={`${item.sellableItemId}-${item.sku}`}
              className="flex items-center justify-between rounded border p-3"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-xs text-muted-foreground">{item.sku}</p>
                {item.variantName && (
                  <p className="text-xs text-muted-foreground">
                    {item.variantName}
                  </p>
                )}
              </div>
              <div className="text-right text-sm">
                <p>x{item.quantity}</p>
                <p className="font-semibold">
                  {formatCurrency(item.lineTotal)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giao / Nhận hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Người nhận: </span>
            {order.recipientName || "-"}
          </p>
          <p>
            <span className="text-muted-foreground">SĐT nhận: </span>
            {order.recipientPhone || "-"}
          </p>
          <p>
            <span className="text-muted-foreground">Địa chỉ: </span>
            {order.address || "-"}
          </p>
          <p>
            <span className="text-muted-foreground">ĐVVC: </span>
            {order.carrier || "-"}
          </p>
          <p>
            <span className="text-muted-foreground">Mã vận đơn: </span>
            {order.trackingCode || "-"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailMainInfo;
