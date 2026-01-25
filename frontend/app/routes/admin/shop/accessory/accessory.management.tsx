import { AccessoryIndex } from "~/components/feature/admin/shop/accessory/management/accessory.index";
import type { Route } from "./+types/accessory.management";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quản lý phụ kiện - Admin Panel" },
    {
      name: "description",
      content: "Manage accessories within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function AccessoryManagementPage() {
  return <AccessoryIndex />;
}
