import VendorManagementIndex from "~/components/feature/admin/procurement/vendor/management/vendor.index";
import type { Route } from "./+types/vendor.management";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quản lý nhà cung cấp - Admin Panel" },
    {
      name: "description",
      content: "Quản lý thông tin nhà cung cấp và bảng giá sản phẩm",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function VendorManagementRoute() {
  return <VendorManagementIndex />;
}
