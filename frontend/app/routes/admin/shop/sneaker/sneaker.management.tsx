import SneakerIndex from "~/components/feature/admin/shop/sneaker/management/sneaker.index";
import type { Route } from "./+types/sneaker.management";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sneaker Management - Admin Panel" },
    {
      name: "description",
      content: "Manage all sneakers within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function SneakerManagementRoute() {
  return <SneakerIndex />;
}
