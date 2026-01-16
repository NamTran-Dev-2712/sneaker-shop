import UpdateSneakerForm from "~/components/feature/admin/shop/sneaker/update/update-sneaker.form";
import type { Route } from "./+types/sneaker.update";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sneaker Update - Admin Panel" },
    {
      name: "description",
      content: "Update an existing sneaker within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function SneakerUpdateRoute() {
  return <UpdateSneakerForm />;
}
