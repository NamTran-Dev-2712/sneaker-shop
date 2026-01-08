import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const registerSchema = z
  .object({
    email: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        {
          message: "Email không hợp lệ",
        },
      ),
    phone: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          const phoneRegex = /^[0-9]{10,11}$/;
          return phoneRegex.test(value);
        },
        {
          message: "Số điện thoại phải có 10-11 chữ số",
        },
      ),
    password: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    avatar: z
      .instanceof(File)
      .optional()
      .nullable()
      .refine(
        (file) => {
          if (!file) return true;
          return file.size <= MAX_FILE_SIZE;
        },
        {
          message: "Kích thước ảnh không được vượt quá 5MB",
        },
      )
      .refine(
        (file) => {
          if (!file) return true;
          return ACCEPTED_IMAGE_TYPES.includes(file.type);
        },
        {
          message: "Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP, GIF",
        },
      ),
  })
  .refine((data) => data.email || data.phone, {
    message: "Vui lòng nhập ít nhất email hoặc số điện thoại",
    path: ["email"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
