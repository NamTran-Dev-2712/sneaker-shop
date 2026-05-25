import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email hoặc số điện thoại không được để trống")
    .refine(
      (value) => {
        // Kiểm tra xem có phải email hay số điện thoại
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,11}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      {
        message: "Vui lòng nhập email hoặc số điện thoại hợp lệ",
      },
    ),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
