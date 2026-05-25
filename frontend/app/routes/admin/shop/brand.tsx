import BrandIndex from "~/components/feature/admin/shop/brand/management/brand.index";
import type { Route } from "./+types/brand";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Brand Management - Admin Panel" },
    {
      name: "description",
      content: "Manage all brands within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function BrandManagementRoute() {
  return <BrandIndex />;
}
