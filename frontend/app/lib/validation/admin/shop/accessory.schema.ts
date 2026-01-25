import { z } from "zod";

// ==========================================
// Accessory Schemas
// ==========================================

export const createAccessorySchema = z.object({
  categoryId: z.number().min(1, "Vui lòng chọn danh mục"),
  brandId: z.number().min(1, "Vui lòng chọn hãng"),
  name: z
    .string()
    .min(1, "Tên phụ kiện không được để trống")
    .max(200, "Tên phụ kiện không được quá 200 ký tự"),
  description: z
    .string()
    .max(2000, "Mô tả không được quá 2000 ký tự")
    .optional(),
  mainImage: z.union([
    z.instanceof(File, { message: "Vui lòng chọn ảnh chính" }),
    z.string().min(1, "Ảnh chính không được để trống"),
  ]),
  subImages: z
    .array(z.union([z.instanceof(File), z.string()]))
    .max(10, "Tối đa 10 ảnh phụ")
    .optional(),
  retailPrice: z.number().min(0, "Giá bán lẻ không được âm").optional(),
  onlinePrice: z.number().min(0, "Giá online không được âm").optional(),
});

export const updateAccessorySchema = z.object({
  categoryId: z.number().min(1, "Vui lòng chọn danh mục"),
  brandId: z.number().min(1, "Vui lòng chọn hãng"),
  name: z
    .string()
    .min(1, "Tên phụ kiện không được để trống")
    .max(200, "Tên phụ kiện không được quá 200 ký tự"),
  description: z
    .string()
    .max(2000, "Mô tả không được quá 2000 ký tự")
    .optional(),
  mainImage: z.union([
    z.instanceof(File, { message: "Vui lòng chọn ảnh chính" }),
    z.string().min(1, "Ảnh chính không được để trống"),
  ]),
  subImages: z
    .array(z.union([z.instanceof(File), z.string()]))
    .max(10, "Tối đa 10 ảnh phụ")
    .optional(),
  retailPrice: z.number().min(0, "Giá bán lẻ không được âm").optional(),
  onlinePrice: z.number().min(0, "Giá online không được âm").optional(),
  isActive: z.boolean().optional(),
});

// ==========================================
// Types
// ==========================================

export type CreateAccessoryInput = z.infer<typeof createAccessorySchema>;
export type UpdateAccessoryInput = z.infer<typeof updateAccessorySchema>;
