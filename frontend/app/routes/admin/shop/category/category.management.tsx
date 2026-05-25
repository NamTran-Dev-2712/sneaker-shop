import { CategoryIndex } from "~/components/feature/admin/shop/category/management/category.index";
import type { Route } from "./+types/category.management";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quản lý danh mục phụ kiện - Admin Panel" },
    {
      name: "description",
      content: "Manage accessory categories within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function CategoryManagementPage() {
  return <CategoryIndex />;
}
