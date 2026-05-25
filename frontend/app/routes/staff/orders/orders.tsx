import type { Route } from "./+types/orders";
import StaffOrderList from "~/components/feature/staff/orders/order-list.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quản lý đơn hàng | Staff Portal" },
    { name: "description", content: "Danh sách đơn hàng theo chi nhánh" },
  ];
}

export default function StaffOrdersRoute() {
  return <StaffOrderList />;
}
