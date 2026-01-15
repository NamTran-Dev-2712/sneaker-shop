import { z } from "zod/v4";

// ==========================================
// Size Form Schema
// ==========================================

/**
 * Các hệ thống size được hỗ trợ
 */
export const SIZE_SYSTEMS = ["US", "UK", "EU", "CM"] as const;
export type SizeSystem = (typeof SIZE_SYSTEMS)[number];

/**
 * Base schema cho Size - dùng chung cho Create và Update
 */
const sizeBaseSchema = z.object({
  system: z.enum(SIZE_SYSTEMS, {
    message: "Vui lòng chọn hệ thống size",
  }),
  value: z
    .number()
    .min(1, "Giá trị size phải lớn hơn 0")
    .max(100, "Giá trị size không được quá 100"),
});

/**
 * Schema cho form tạo size mới
 */
export const createSizeSchema = sizeBaseSchema;

/**
 * Schema cho form cập nhật size
 */
export const updateSizeSchema = sizeBaseSchema;

// ==========================================
// Type Exports
// ==========================================

export type CreateSizeFormData = z.infer<typeof createSizeSchema>;
export type UpdateSizeFormData = z.infer<typeof updateSizeSchema>;
