import StaffIndex from "~/components/feature/admin/user/staff/management/staff.index";
import type { Route } from "./+types/staff";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Staff Management - Admin Panel" },
    {
      name: "description",
      content: "Manage all staff members within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function StaffManagementRoute() {
  return <StaffIndex />;
}
