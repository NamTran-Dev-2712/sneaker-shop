import StoreIndex from "~/components/feature/admin/shop/store/management/store.index";
import type { Route } from "./+types/store";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Store Management - Admin Panel" },
    {
      name: "description",
      content: "Manage all stores within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function StoreManagementRoute() {
  return <StoreIndex />;
}
