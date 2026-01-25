import { z } from "zod";

// ==========================================
// Category Schemas
// ==========================================

export const brandInputSchema = z.object({
  name: z
    .string()
    .min(1, "Tên hãng không được để trống")
    .max(100, "Tên hãng không được quá 100 ký tự"),
  thumbnailImage: z.union([
    z.instanceof(File, { message: "Vui lòng chọn ảnh đại diện" }),
    z.string().min(1, "Ảnh đại diện không được để trống"),
  ]),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Tên danh mục không được để trống")
    .max(100, "Tên danh mục không được quá 100 ký tự"),
  brands: z
    .array(brandInputSchema)
    .min(1, "Vui lòng thêm ít nhất 1 hãng cho danh mục"),
});

// Schema cho brand khi update (có thể có id nếu là existing brand)
export const updateBrandInputSchema = z.object({
  id: z.number().optional(), // Có id nếu là existing brand, không có nếu là brand mới
  name: z
    .string()
    .min(1, "Tên hãng không được để trống")
    .max(100, "Tên hãng không được quá 100 ký tự"),
  thumbnailImage: z.union([
    z.instanceof(File, { message: "Vui lòng chọn ảnh đại diện" }),
    z.string().min(1, "Ảnh đại diện không được để trống"),
  ]),
  isNew: z.boolean().optional(), // Flag để biết là brand mới hay existing
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Tên danh mục không được để trống")
    .max(100, "Tên danh mục không được quá 100 ký tự"),
  brands: z.array(updateBrandInputSchema).optional(),
  brandIdsToRemove: z.array(z.number()).optional(),
});

// ==========================================
// Types
// ==========================================

export type BrandInput = z.infer<typeof brandInputSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandInputSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
