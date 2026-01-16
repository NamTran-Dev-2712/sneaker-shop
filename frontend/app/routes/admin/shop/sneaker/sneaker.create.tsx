import CreateSneakerForm from "~/components/feature/admin/shop/sneaker/create/create-sneaker.form";
import type { Route } from "./+types/sneaker.create";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Sneaker - Admin Panel" },
    {
      name: "description",
      content: "Create a new sneaker within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function SneakerCreateRoute() {
  return <CreateSneakerForm />;
}
