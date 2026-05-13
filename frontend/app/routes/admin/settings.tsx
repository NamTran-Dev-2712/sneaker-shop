import type { Route } from "./+types/settings";
import AdminSettingsPage from "~/components/feature/admin/settings/settings.page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cài đặt | Sneaker Shop Admin" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function AdminSettingsRoute() {
  return <AdminSettingsPage />;
}
