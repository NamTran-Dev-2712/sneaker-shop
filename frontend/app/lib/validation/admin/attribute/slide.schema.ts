import { z } from "zod/v4";

// ==========================================
// Slide Form Schema
// ==========================================

/**
 * Base schema cho Slide - dùng chung cho Create và Update
 */
const slideBaseSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề slide không được để trống")
    .max(200, "Tiêu đề slide không được quá 200 ký tự"),
  subtitle: z
    .string()
    .min(1, "Phụ đề slide không được để trống")
    .max(200, "Phụ đề slide không được quá 200 ký tự"),
  description: z
    .string()
    .min(1, "Mô tả slide không được để trống")
    .max(500, "Mô tả slide không được quá 500 ký tự"),
  buttonText: z
    .string()
    .min(1, "Text nút không được để trống")
    .max(50, "Text nút không được quá 50 ký tự"),
  buttonUrl: z
    .string()
    .min(1, "URL nút không được để trống")
    .max(500, "URL nút không được quá 500 ký tự"),
});

/**
 * Schema cho form tạo slide mới - yêu cầu ảnh
 */
export const createSlideSchema = slideBaseSchema.extend({
  image: z
    .instanceof(File, { message: "Ảnh slide là bắt buộc" })
    .refine((file) => file.size > 0, "Ảnh slide là bắt buộc")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Kích thước ảnh không được vượt quá 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "Chỉ chấp nhận định dạng JPG, PNG, WEBP",
    ),
});

/**
 * Schema cho form cập nhật slide - ảnh không bắt buộc
 */
export const updateSlideSchema = slideBaseSchema.extend({
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Kích thước ảnh không được vượt quá 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "Chỉ chấp nhận định dạng JPG, PNG, WEBP",
    )
    .optional(),
});

// ==========================================
// Type Exports
// ==========================================

export type CreateSlideFormData = z.infer<typeof createSlideSchema>;
export type UpdateSlideFormData = z.infer<typeof updateSlideSchema>;
