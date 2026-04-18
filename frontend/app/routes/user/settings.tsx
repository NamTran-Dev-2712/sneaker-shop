import type { Route } from "./+types/settings";
import CustomerSettingsPage from "~/components/feature/user/settings/settings.page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cài đặt tài khoản | Sneaker Shop" },
    {
      name: "description",
      content: "Quản lý cài đặt bảo mật và tài khoản của bạn",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function SettingsRoute() {
  return <CustomerSettingsPage />;
}
