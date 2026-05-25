import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Phone,
  User,
  Calendar,
} from "lucide-react";
import {
  registerSchema,
  type RegisterFormData,
} from "~/lib/validation/auth/register.schema";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import SocialLogin from "../social-login";
import UploadImage from "~/components/common/shared/upload-image";
import { authSerivce } from "~/services/auth/auth.service";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import type { ApiResponseError } from "~/types/global/api.response";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";
import { showInfoToast } from "~/components/common/toast/toast.custom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const formattedData: FormData = new FormData();
      formattedData.append("fullName", data.fullName);
      formattedData.append("email", data.email);
      formattedData.append("phone", data.phone);
      formattedData.append("birthday", data.birthday);
      formattedData.append("password", data.password);
      if (data.avatar) {
        formattedData.append("avatar", data.avatar);
      }

      const response = await authSerivce.register(formattedData);

      if (response.success) {
        showSuccessToast("Đăng ký tài khoản thành công!");
        showInfoToast(
          "Vui lòng kiểm tra email để xác thực tài khoản của bạn. Email xác thực đã được gửi đến hộp thư của bạn.",
          6000,
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const err = response as unknown as ApiResponseError;
        console.log(err);
        console.log(getErrMessage(err));
        showErrorToast(getErrMessage(err));
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Register error:", error);
      showErrorToast("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau!");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Đăng ký</h1>
        <p className="text-muted-foreground">
          Tạo tài khoản mới để trải nghiệm mua sắm tốt nhất
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Họ và tên
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="fullName"
              type="text"
              placeholder="Nhập họ và tên"
              {...register("fullName")}
              aria-invalid={!!errors.fullName}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {errors.fullName && (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Nhập email"
              {...register("email")}
              aria-invalid={!!errors.email}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Số điện thoại
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              placeholder="Nhập số điện thoại (10-11 số)"
              {...register("phone")}
              aria-invalid={!!errors.phone}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Birthday Field */}
        <div className="space-y-2">
          <Label htmlFor="birthday">
            Ngày sinh
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="birthday"
              type="date"
              {...register("birthday")}
              aria-invalid={!!errors.birthday}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {errors.birthday && (
            <p className="text-sm text-destructive">
              {errors.birthday.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Bạn phải từ 13 tuổi trở lên để đăng ký
          </p>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Mật khẩu
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              {...register("password")}
              aria-invalid={!!errors.password}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký
            tự đặc biệt
          </p>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Xác nhận mật khẩu
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Avatar Field (Optional) */}
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <UploadImage
              value={field.value}
              onChange={field.onChange}
              label="Ảnh đại diện"
              error={errors.avatar?.message}
              required={false}
            />
          )}
        />

        {/* Terms and Conditions */}
        <div className="text-xs text-muted-foreground">
          Bằng cách đăng ký, bạn đồng ý với{" "}
          <Link to="/terms" className="text-primary hover:underline">
            Điều khoản dịch vụ
          </Link>{" "}
          và{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Chính sách bảo mật
          </Link>{" "}
          của chúng tôi
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Đang xử lý...
            </>
          ) : (
            "Đăng ký"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Hoặc đăng ký với
          </span>
        </div>
      </div>

      {/* Social Login */}
      <SocialLogin />

      {/* Login Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Đã có tài khoản? </span>
        <Link to="/login" className="font-medium text-primary hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
