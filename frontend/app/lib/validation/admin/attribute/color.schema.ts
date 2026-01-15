import { z } from "zod/v4";

// ==========================================
// Color Form Schema
// ==========================================

/**
 * Base schema cho Color - dùng chung cho Create và Update
 */
const colorBaseSchema = z.object({
  name: z
    .string()
    .min(1, "Tên màu không được để trống")
    .max(50, "Tên màu không được quá 50 ký tự")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên màu chỉ chứa chữ cái và khoảng trắng"),
  hex: z
    .string()
    .min(1, "Mã màu không được để trống")
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Mã màu phải có định dạng HEX (vd: #FF5733)",
    ),
});

/**
 * Schema cho form tạo màu mới
 */
export const createColorSchema = colorBaseSchema;

/**
 * Schema cho form cập nhật màu
 */
export const updateColorSchema = colorBaseSchema;

// ==========================================
// Type Exports
// ==========================================

export type CreateColorFormData = z.infer<typeof createColorSchema>;
export type UpdateColorFormData = z.infer<typeof updateColorSchema>;
