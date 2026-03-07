import type { Route } from "./+types/profile";
import StaffProfile from "~/components/feature/staff/profile/staff.profile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hồ sơ cá nhân | Staff Portal" },
    { name: "description", content: "Thông tin hồ sơ nhân viên" },
  ];
}

export default function StaffProfileRoute() {
  return <StaffProfile />;
}
