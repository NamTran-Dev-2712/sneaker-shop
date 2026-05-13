import type { Route } from "./+types/profile";
import ProfilePage from "~/components/feature/user/profile/profile.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tài khoản của tôi | Sneaker Shop" },
    {
      name: "description",
      content: "Quản lý thông tin tài khoản cá nhân",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function ProfileRoute() {
  return <ProfilePage />;
}
