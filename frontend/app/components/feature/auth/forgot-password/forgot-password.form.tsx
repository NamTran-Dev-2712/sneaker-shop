import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, KeyRound, Loader2, Mail } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import {
  forgotPasswordRequestSchema,
  forgotPasswordResetSchema,
  type ForgotPasswordRequestData,
  type ForgotPasswordResetData,
} from "~/lib/validation/auth/forgot-password.schema";
import { authSerivce } from "~/services/auth/auth.service";
import { showErrorToast, showSuccessToast } from "~/components/common/toast";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";

type ForgotStep = "request" | "reset";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotStep>("request");
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const requestForm = useForm<ForgotPasswordRequestData>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    mode: "onBlur",
  });

  const resetForm = useForm<ForgotPasswordResetData>({
    resolver: zodResolver(forgotPasswordResetSchema),
    mode: "onBlur",
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const maskedEmail = useMemo(() => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!domain || local.length < 3) return email;
    return `${local.slice(0, 2)}***@${domain}`;
  }, [email]);

  const onRequestOtp = async (data: ForgotPasswordRequestData) => {
    setIsSubmitting(true);

    try {
      const response = await authSerivce.requestPasswordResetOtp({
        email: data.email,
      });

      if (!response.success) {
        const err = response as unknown as ApiResponseError;
        showErrorToast(getErrMessage(err));
        return;
      }

      setEmail(data.email.trim().toLowerCase());
      setStep("reset");
      setCooldown(response.data?.cooldownSeconds ?? 60);
      showSuccessToast(
        response.data?.message ||
          "Nếu email tồn tại trong hệ thống, mã OTP đã được gửi.",
      );
    } catch {
      showErrorToast("Không thể gửi OTP lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResendOtp = async () => {
    if (!email || cooldown > 0 || isResending) {
      return;
    }

    setIsResending(true);

    try {
      const response = await authSerivce.resendPasswordResetOtp({ email });

      if (!response.success) {
        const err = response as unknown as ApiResponseError;
        showErrorToast(getErrMessage(err));
        return;
      }

      setCooldown(response.data?.cooldownSeconds ?? 60);
      showSuccessToast(response.data?.message || "Đã gửi lại OTP thành công.");
    } catch {
      showErrorToast("Không thể gửi lại OTP. Vui lòng thử lại sau.");
    } finally {
      setIsResending(false);
    }
  };

  const onResetPassword = async (data: ForgotPasswordResetData) => {
    if (!email) {
      showErrorToast("Phiên đặt lại mật khẩu không hợp lệ. Vui lòng thử lại.");
      setStep("request");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authSerivce.resetPasswordWithOtp({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      if (!response.success) {
        const err = response as unknown as ApiResponseError;
        showErrorToast(getErrMessage(err));
        return;
      }

      showSuccessToast(
        response.data?.message || "Đặt lại mật khẩu thành công.",
      );
      navigate("/login");
    } catch {
      showErrorToast("Không thể đặt lại mật khẩu. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Quên mật khẩu</h1>
        <p className="text-muted-foreground">
          {step === "request"
            ? "Nhập email để nhận mã OTP đặt lại mật khẩu"
            : `Nhập OTP đã gửi đến ${maskedEmail || email}`}
        </p>
      </div>

      {step === "request" ? (
        <form
          onSubmit={requestForm.handleSubmit(onRequestOtp)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Nhập email đăng ký"
                {...requestForm.register("email")}
                className="pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            {requestForm.formState.errors.email && (
              <p className="text-sm text-destructive">
                {requestForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi OTP...
              </>
            ) : (
              "Gửi OTP"
            )}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={resetForm.handleSubmit(onResetPassword)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Mã OTP (6 chữ số)</Label>
            <Controller
              control={resetForm.control}
              name="otp"
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {resetForm.formState.errors.otp && (
              <p className="text-sm text-destructive text-center">
                {resetForm.formState.errors.otp.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới"
              {...resetForm.register("newPassword")}
            />
            {resetForm.formState.errors.newPassword && (
              <p className="text-sm text-destructive">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              {...resetForm.register("confirmPassword")}
            />
            {resetForm.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <Button
              type="button"
              variant="ghost"
              className="px-0"
              onClick={onResendOtp}
              disabled={cooldown > 0 || isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi lại...
                </>
              ) : cooldown > 0 ? (
                `Gửi lại OTP sau ${cooldown}s`
              ) : (
                "Gửi lại OTP"
              )}
            </Button>

            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={() => {
                setStep("request");
                setCooldown(0);
                resetForm.reset();
              }}
            >
              Đổi email
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </Button>
        </form>
      )}

      <div className="text-center text-sm">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
