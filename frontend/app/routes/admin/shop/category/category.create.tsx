import { CreateCategoryForm } from "~/components/feature/admin/shop/category/create/create-category.form";
import type { Route } from "./+types/category.create";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Thêm danh mục phụ kiện - Admin Panel" },
    {
      name: "description",
      content: "Create a new accessory category within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function CategoryCreatePage() {
  return <CreateCategoryForm />;
}
