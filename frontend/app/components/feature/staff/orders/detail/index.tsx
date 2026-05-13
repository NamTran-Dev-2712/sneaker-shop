import { useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  useCancelStoreOrder,
  useConfirmStoreOrder,
  useDeliverStoreOrder,
  usePackStoreOrder,
  useShipStoreOrder,
  useStoreOrderDetail,
} from "~/hooks/react-query/use-staff-order.query";
import type { StaffOrderAction } from "./constants";
import OrderDetailActionsPanel from "./order-detail-actions-panel";
import OrderDetailHeader from "./order-detail-header";
import OrderDetailMainInfo from "./order-detail-main-info";
import OrderDetailSkeleton from "./order-detail-skeleton";

const StaffOrderDetailPage = () => {
  const { id } = useParams();
  const orderId = Number(id);

  const { data: order, isLoading, isError } = useStoreOrderDetail(orderId);

  const confirmMutation = useConfirmStoreOrder(orderId);
  const packMutation = usePackStoreOrder(orderId);
  const shipMutation = useShipStoreOrder(orderId);
  const deliverMutation = useDeliverStoreOrder(orderId);
  const cancelMutation = useCancelStoreOrder(orderId);

  const [carrier, setCarrier] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const isMutating =
    confirmMutation.isPending ||
    packMutation.isPending ||
    shipMutation.isPending ||
    deliverMutation.isPending ||
    cancelMutation.isPending;

  const actions = useMemo(() => {
    if (!order) return [] as StaffOrderAction[];

    const isPickup = order.fulfillmentType === "PICKUP";
    const result: StaffOrderAction[] = [];

    if (order.status === "PLACED") {
      result.push({
        key: "confirm",
        label: "Xác nhận đơn",
        onClick: () => confirmMutation.mutate(),
      });
      result.push({
        key: "cancel",
        label: "Hủy đơn",
        variant: "destructive",
        onClick: () => cancelMutation.mutate({ reason: cancelReason }),
      });
    }

    if (order.status === "CONFIRMED" || order.status === "PAID") {
      result.push({
        key: "pack",
        label: "Đóng gói",
        onClick: () => packMutation.mutate(),
      });

      if (order.status === "CONFIRMED") {
        result.push({
          key: "cancel",
          label: "Hủy đơn",
          variant: "destructive",
          onClick: () => cancelMutation.mutate({ reason: cancelReason }),
        });
      }
    }

    if (order.status === "PACKED" && !isPickup) {
      result.push({
        key: "ship",
        label: "Bàn giao vận chuyển",
        onClick: () =>
          shipMutation.mutate({
            carrier: carrier || undefined,
            trackingCode: trackingCode || undefined,
          }),
      });
    }

    if (order.status === "PACKED" && isPickup) {
      result.push({
        key: "deliver",
        label: "Hoàn tất đơn",
        onClick: () => deliverMutation.mutate(),
      });
    }

    return result;
  }, [
    cancelMutation,
    cancelReason,
    carrier,
    confirmMutation,
    deliverMutation,
    order,
    packMutation,
    shipMutation,
    trackingCode,
  ]);

  if (isLoading) return <OrderDetailSkeleton />;

  if (isError || !order) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-card p-10 text-center text-red-500">
          Không thể tải chi tiết đơn hàng.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <OrderDetailHeader order={order} />

      <div className="grid gap-6 lg:grid-cols-3">
        <OrderDetailMainInfo order={order} />
        <OrderDetailActionsPanel
          order={order}
          actions={actions}
          isMutating={isMutating}
          carrier={carrier}
          trackingCode={trackingCode}
          cancelReason={cancelReason}
          onCarrierChange={setCarrier}
          onTrackingCodeChange={setTrackingCode}
          onCancelReasonChange={setCancelReason}
        />
      </div>
    </div>
  );
};

export default StaffOrderDetailPage;
