import { UpdateAccessoryForm } from "~/components/feature/admin/shop/accessory/update/update-accessory.form";
import type { Route } from "./+types/accessory.update";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chỉnh sửa phụ kiện - Admin Panel" },
    {
      name: "description",
      content: "Update an accessory within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function AccessoryUpdatePage() {
  return <UpdateAccessoryForm />;
}
