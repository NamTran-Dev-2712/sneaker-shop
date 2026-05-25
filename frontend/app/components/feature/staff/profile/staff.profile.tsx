import useAuth from "~/store/auth/auth.hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  User,
  Building2,
  Shield,
  Calendar,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import StaffChangePassword from "~/components/feature/staff/security/staff.change-password";

const StaffProfile = () => {
  const { user } = useAuth();
  const staffProfile = user?.staffProfile;

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">
          Xem thông tin tài khoản và cửa hàng được phân công.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info - Left Column */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar} alt={user?.fullName} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-semibold">{user?.fullName}</h2>
            <Badge variant="secondary" className="mt-2">
              <Shield className="mr-1 h-3 w-3" />
              Nhân viên
            </Badge>

            <Separator className="my-4 w-full" />

            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="break-all">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user?.phone}</span>
              </div>
              {user?.birthday && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(user.birthday).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Store Info - Right Column */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Cửa hàng được phân công
            </CardTitle>
            <CardDescription>
              Chi tiết về chi nhánh bạn đang làm việc
            </CardDescription>
          </CardHeader>
          <CardContent>
            {staffProfile ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {staffProfile.storeName}
                    </h3>
                    <Badge variant="outline" className="mt-1">
                      {staffProfile.storeCode}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  {staffProfile.storeAddress && (
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Địa chỉ
                      </div>
                      <p className="text-sm">{staffProfile.storeAddress}</p>
                    </div>
                  )}
                  {staffProfile.storePhone && (
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        Số điện thoại
                      </div>
                      <p className="text-sm">{staffProfile.storePhone}</p>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Nếu bạn cần thay đổi thông tin cá nhân hoặc chuyển cửa hàng,
                    vui lòng liên hệ quản trị viên.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Store className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Chưa được phân công cửa hàng. Vui lòng liên hệ quản trị viên.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <StaffChangePassword />
    </div>
  );
};

export default StaffProfile;
