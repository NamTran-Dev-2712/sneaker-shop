import { CreateAccessoryForm } from "~/components/feature/admin/shop/accessory/create/create-accessory.form";
import type { Route } from "./+types/accessory.create";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Thêm phụ kiện mới - Admin Panel" },
    {
      name: "description",
      content: "Create a new accessory within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function AccessoryCreatePage() {
  return <CreateAccessoryForm />;
}
