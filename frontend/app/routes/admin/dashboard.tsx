import type { Route } from "./+types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Admin Panel" },
    { name: "description", content: "Admin dashboard overview" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function Dashboard() {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "₫45,231,000",
      change: "+20.1%",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Khách hàng",
      value: "2,350",
      change: "+18.2%",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Đơn hàng",
      value: "1,234",
      change: "+12.5%",
      icon: <ShoppingBag className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Tăng trưởng",
      value: "+24%",
      change: "+4.2%",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Chào mừng đến với trang quản trị Sneaker Shop
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> so với
                tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Chức năng đang được phát triển...
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Chức năng đang được phát triển...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
