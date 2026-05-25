import { z } from "zod";

export const forgotPasswordRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Định dạng email không hợp lệ"),
});

export const forgotPasswordResetSchema = z
  .object({
    otp: z
      .string()
      .min(6, "OTP phải gồm 6 chữ số")
      .max(6, "OTP phải gồm 6 chữ số")
      .regex(/^[0-9]{6}$/, "OTP phải gồm đúng 6 chữ số"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu mới phải chứa ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Mật khẩu mới phải chứa ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Mật khẩu mới phải chứa ít nhất 1 chữ số")
      .regex(/[!?*.]/, "Mật khẩu mới phải chứa ít nhất 1 ký tự đặc biệt (!?*)"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export type ForgotPasswordRequestData = z.infer<
  typeof forgotPasswordRequestSchema
>;
export type ForgotPasswordResetData = z.infer<typeof forgotPasswordResetSchema>;
