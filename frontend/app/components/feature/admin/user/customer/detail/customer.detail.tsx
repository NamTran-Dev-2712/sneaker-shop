import { useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  ShieldX,
  Star,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  useAdminCustomerDetail,
  useToggleCustomerActive,
} from "~/hooks/react-query/use-admin-customer.query";
import { formatDate } from "~/common/helpers/format-date.helper";
import { formatCurrency } from "~/common/helpers/format-currency.helper";

interface CustomerDetailProps {
  id: number;
}

const tierColors: Record<string, string> = {
  BRONZE: "bg-orange-100 text-orange-700 border-orange-200",
  SILVER: "bg-gray-100 text-gray-700 border-gray-200",
  GOLD: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PLATINUM: "bg-blue-100 text-blue-700 border-blue-200",
  DIAMOND: "bg-purple-100 text-purple-700 border-purple-200",
};

const CustomerDetail = ({ id }: CustomerDetailProps) => {
  const navigate = useNavigate();
  const { data: customer, isLoading, isError } = useAdminCustomerDetail(id);
  const toggleActive = useToggleCustomerActive();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">
          Đang tải thông tin khách hàng...
        </p>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Không tìm thấy khách hàng.</p>
        <Button variant="outline" onClick={() => navigate("/admin/customers")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/customers")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{customer.fullName}</h1>
          <p className="text-sm text-muted-foreground">ID: #{customer.id}</p>
        </div>
        {customer.hasAccount && (
          <div className="ml-auto">
            <Button
              variant={customer.isActive ? "destructive" : "default"}
              onClick={() => toggleActive.mutate(customer.id)}
              disabled={toggleActive.isPending}
            >
              {toggleActive.isPending
                ? "Đang xử lý..."
                : customer.isActive
                  ? "Khóa tài khoản"
                  : "Mở khóa tài khoản"}
            </Button>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
            <p className="text-2xl font-bold">{customer.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
            <p className="text-2xl font-bold">
              {formatCurrency(customer.totalSpent)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Điểm tích lũy</p>
            <p className="text-2xl font-bold">{customer.loyaltyPoints}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Hạng thành viên</p>
            <Badge
              variant="outline"
              className={tierColors[customer.loyaltyTier] ?? ""}
            >
              <Star className="h-3 w-3 mr-1" />
              {customer.loyaltyTier}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Full Name */}
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Họ và tên</p>
                <p className="font-medium">{customer.fullName}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Số điện thoại</p>
                <p className="font-medium">{customer.phone ?? "—"}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email ?? "—"}</p>
              </div>
            </div>

            {/* Birthday */}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Ngày sinh</p>
                <p className="font-medium">
                  {customer.birthday ? formatDate(customer.birthday) : "—"}
                </p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Ngày tham gia</p>
                <p className="font-medium">{formatDate(customer.createdAt)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Status */}
          <div>
            <p className="text-sm font-medium mb-2">Trạng thái tài khoản</p>
            <div className="flex flex-wrap gap-2">
              {customer.hasAccount ? (
                <>
                  <Badge
                    variant={customer.isActive ? "default" : "destructive"}
                  >
                    {customer.isActive ? (
                      <>
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Đang hoạt động
                      </>
                    ) : (
                      <>
                        <ShieldX className="h-3 w-3 mr-1" />
                        Bị khóa
                      </>
                    )}
                  </Badge>
                  <Badge
                    variant={customer.isEmailVerified ? "secondary" : "outline"}
                  >
                    {customer.isEmailVerified
                      ? "Email đã xác thực"
                      : "Chưa xác thực email"}
                  </Badge>
                </>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Chưa có tài khoản
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetail;
