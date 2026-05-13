import type { Route } from "./+types/dashboard";
import StaffDashboard from "~/components/feature/staff/dashboard/staff.dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tổng quan | Staff Portal" },
    { name: "description", content: "Trang tổng quan nhân viên" },
  ];
}

export default function StaffDashboardRoute() {
  return <StaffDashboard />;
}
