import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Eye, EyeOff, LogIn, Mail } from "lucide-react";
import {
  loginSchema,
  type LoginFormData,
} from "~/lib/validation/auth/login.schema";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import SocialLogin from "../social-login";
import { authSerivce } from "~/services/auth/auth.service";
import { showSuccessToast } from "~/lib/toast/toast.success";
import { showErrorToast } from "~/lib/toast/toast.error";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import type { ApiResponseError } from "~/types/global/api.response";
import { useAppDispatch } from "~/hooks/redux";
import { login } from "~/store/auth/auth.slice";
import type { LoginRequest } from "~/services/auth/dto/login/login.request";
import { convertPhoneVietNamToInternational } from "~/common/helpers/phone.helper";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Determine if identifier is email or phone
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(data.identifier);

      const loginRequest: LoginRequest = {
        password: data.password,
        ...(isEmail
          ? { email: data.identifier }
          : { phone: convertPhoneVietNamToInternational(data.identifier) }),
      };

      const response = await authSerivce.login(loginRequest);

      if (response.success && response.data) {
        dispatch(login(response.data));
        showSuccessToast(
          `Chào mừng ${response.data.fullName}! Đăng nhập thành công.`,
        );
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const err = response as unknown as ApiResponseError;
        showErrorToast(getErrMessage(err));
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      showErrorToast("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau!");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Đăng nhập</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email/Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="identifier">
            Email hoặc Số điện thoại
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="identifier"
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              {...register("identifier")}
              aria-invalid={!!errors.identifier}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {errors.identifier && (
            <p className="text-sm text-destructive">
              {errors.identifier.message}
            </p>
          )}
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
              placeholder="Nhập mật khẩu"
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
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Đang xử lý...
            </>
          ) : (
            "Đăng nhập"
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
            Hoặc đăng nhập với
          </span>
        </div>
      </div>

      {/* Social Login */}
      <SocialLogin />

      {/* Register Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Chưa có tài khoản? </span>
        <Link
          to="/register"
          className="font-medium text-primary hover:underline"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
