import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Settings, Shield, Mail, CheckCircle, AlertCircle } from "lucide-react";
import UserChangePassword from "~/components/feature/user/profile/user.change-password";
import { authSerivce } from "~/services/auth/auth.service";
import useAuth from "~/store/auth/auth.hook";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";

const CustomerSettingsPage = () => {
  const { user } = useAuth();
  const [resendSent, setResendSent] = useState(false);

  const { mutate: resendVerification, isPending: resendPending } = useMutation({
    mutationFn: () => authSerivce.resendVerificationEmail(),
    onSuccess: (response) => {
      if (response.success) {
        setResendSent(true);
        showSuccessToast(
          response.data?.message ?? "Email xác thực đã được gửi lại.",
        );
      } else {
        showErrorToast(response.message ?? "Không thể gửi email xác thực.");
      }
    },
    onError: () => {
      showErrorToast("Không thể gửi email xác thực. Vui lòng thử lại sau.");
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <div className="flex items-center gap-3">
        <Settings className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Cài đặt tài khoản</h1>
      </div>

      {/* Email Verification Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-5 w-5" />
            Xác thực email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.isEmailVerified
                  ? "Email của bạn đã được xác thực."
                  : "Email chưa được xác thực. Vui lòng xác thực để bảo vệ tài khoản."}
              </p>
            </div>
            {user?.isEmailVerified ? (
              <Badge
                variant="outline"
                className="shrink-0 border-green-500 text-green-700 bg-green-50 flex items-center gap-1"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Đã xác thực
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="shrink-0 border-yellow-500 text-yellow-700 bg-yellow-50 flex items-center gap-1"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                Chưa xác thực
              </Badge>
            )}
          </div>

          {!user?.isEmailVerified && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {resendSent
                    ? "Email xác thực đã được gửi. Kiểm tra hộp thư của bạn."
                    : "Chưa nhận được email xác thực?"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resendVerification()}
                  disabled={resendPending || resendSent}
                >
                  {resendSent ? "Đã gửi" : "Gửi lại"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-base font-semibold">Bảo mật</h2>
      </div>
      <UserChangePassword />
    </div>
  );
};

export default CustomerSettingsPage;
