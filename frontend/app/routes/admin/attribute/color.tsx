import ColorIndex from "~/components/feature/admin/attribute/color/color.index";
import type { Route } from "./+types/color";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Color Management - Admin Panel" },
    {
      name: "description",
      content: "Manage all colors within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function ColorManagementRoute() {
  return <ColorIndex />;
}
