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
    fullName: z
      .string()
      .min(1, "Họ và tên không được để trống")
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(100, "Họ và tên không được vượt quá 100 ký tự")
      .regex(
        /^[\p{L}\s]+$/u,
        "Họ và tên chỉ được chứa chữ cái và khoảng trắng",
      ),
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    phone: z
      .string()
      .min(1, "Số điện thoại không được để trống")
      .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
    birthday: z
      .string()
      .min(1, "Ngày sinh không được để trống")
      .refine(
        (value) => {
          const date = new Date(value);
          const now = new Date();
          const age = now.getFullYear() - date.getFullYear();
          return age >= 13 && age <= 120;
        },
        {
          message: "Bạn phải từ 13 tuổi trở lên để đăng ký",
        },
      ),
    password: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số")
      .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
