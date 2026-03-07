import { z } from "zod/v4";

export const staffCreateSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ")
    .max(255, "Email không được quá 255 ký tự"),
  phone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)\d{9,10}$/, "Số điện thoại không hợp lệ"),
  fullName: z
    .string()
    .min(1, "Họ và tên không được để trống")
    .max(200, "Họ và tên không được quá 200 ký tự"),
  storeId: z
    .number({ message: "Vui lòng chọn cửa hàng" })
    .int()
    .positive("Vui lòng chọn cửa hàng"),
});

export type StaffCreateData = z.infer<typeof staffCreateSchema>;

export const staffUpdateSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ và tên không được để trống")
    .max(200, "Họ và tên không được quá 200 ký tự"),
  storeId: z
    .number({ message: "Vui lòng chọn cửa hàng" })
    .int()
    .positive("Vui lòng chọn cửa hàng"),
  isActive: z.boolean(),
});

export type StaffUpdateData = z.infer<typeof staffUpdateSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mật khẩu hiện tại không được để trống"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu mới phải chứa ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Mật khẩu mới phải chứa ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Mật khẩu mới phải chứa ít nhất 1 chữ số")
      .regex(
        /[!?*.]/,
        "Mật khẩu mới phải chứa ít nhất 1 ký tự đặc biệt (!?*).",
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu hiện tại",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
