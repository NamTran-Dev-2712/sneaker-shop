import type { Route } from "./+types/order-detail";
import StaffOrderDetail from "~/components/feature/staff/orders/order-detail.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chi tiết đơn hàng | Staff Portal" },
    { name: "description", content: "Chi tiết đơn hàng để nhân viên xử lý" },
  ];
}

export default function StaffOrderDetailRoute() {
  return <StaffOrderDetail />;
}
