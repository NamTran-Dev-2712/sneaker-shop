import InventoryManagementIndex from "~/components/feature/admin/inventory/inventory.index";
import type { Route } from "./+types/inventory";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quản lý tồn kho - Admin Panel" },
    {
      name: "description",
      content: "Quản lý tồn kho sản phẩm theo từng cửa hàng",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function InventoryManagementRoute() {
  return <InventoryManagementIndex />;
}
