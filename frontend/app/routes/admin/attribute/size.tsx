import SizeIndex from "~/components/feature/admin/attribute/size/size.index";
import type { Route } from "./+types/size";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Size Management - Admin Panel" },
    { name: "description", content: "Manage all sizes within the admin panel" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function SizeManagementRoute() {
  return <SizeIndex />;
}
