import type { Route } from "./+types/dashboard";
import FinanceDashboard from "~/components/feature/admin/finance/dashboard/finance.dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard tài chính - Admin Panel" },
    {
      name: "description",
      content: "Thống kê doanh thu, chi tiêu và lợi nhuận theo cửa hàng",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function Dashboard() {
  return <FinanceDashboard />;
}
