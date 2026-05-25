import { UpdateCategoryForm } from "~/components/feature/admin/shop/category/update/update-category.form";
import type { Route } from "./+types/category.update";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chỉnh sửa danh mục phụ kiện - Admin Panel" },
    {
      name: "description",
      content: "Update an accessory category within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function CategoryUpdatePage() {
  return <UpdateCategoryForm />;
}
