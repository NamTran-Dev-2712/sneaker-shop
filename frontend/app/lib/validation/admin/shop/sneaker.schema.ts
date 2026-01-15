import { z } from "zod/v4";

// ==========================================
// Sneaker Form Schemas
// ==========================================

/**
 * Schema cho Sub Image (dùng trong update để track các ảnh phụ hiện có)
 */
export const existingSubImageSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
  toRemove: z.boolean().optional(),
});

/**
 * Schema cho Variant trong Colorway
 */
export const variantSchema = z.object({
  id: z.number().optional(),
  sizeId: z.number().min(1, "Vui lòng chọn size"),
  retailPrice: z
    .number()
    .min(0, "Giá bán lẻ không được âm")
    .optional()
    .nullable(),
  onlinePrice: z
    .number()
    .min(0, "Giá online không được âm")
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
});

/**
 * Schema cho inline color khi tạo màu mới
 */
export const inlineColorSchema = z.object({
  name: z
    .string()
    .min(1, "Tên màu không được để trống")
    .max(50, "Tên màu không được quá 50 ký tự"),
  hex: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Mã màu phải có định dạng HEX",
    ),
});

/**
 * Schema cho Colorway
 */
export const colorwaySchema = z
  .object({
    id: z.number().optional(),
    colorId: z.number().optional().nullable(),
    newColor: inlineColorSchema.optional().nullable(),
    coverImage: z.instanceof(File).optional().nullable(),
    coverImageUrl: z.string().optional(),
    isActive: z.boolean().optional(),
    variants: z.array(variantSchema).min(1, "Phải có ít nhất 1 biến thể size"),
  })
  .refine((data) => data.colorId || data.newColor, {
    message: "Phải chọn màu có sẵn hoặc tạo màu mới",
    path: ["colorId"],
  });

/**
 * Schema cho form tạo Sneaker
 */
export const createSneakerSchema = z.object({
  brandId: z.number().min(1, "Vui lòng chọn hãng"),
  brandSeriesId: z.number().min(1, "Vui lòng chọn dòng sản phẩm"),
  name: z
    .string()
    .min(1, "Tên sản phẩm không được để trống")
    .max(200, "Tên sản phẩm không được quá 200 ký tự"),
  description: z
    .string()
    .max(2000, "Mô tả không được quá 2000 ký tự")
    .optional()
    .nullable(),
  mainImage: z.instanceof(File, { message: "Vui lòng chọn ảnh chính" }),
  subImages: z.array(z.instanceof(File)).optional(),
  colorways: z.array(colorwaySchema).min(1, "Phải có ít nhất 1 phối màu"),
});

/**
 * Schema cho form cập nhật Sneaker
 */
export const updateSneakerSchema = z.object({
  id: z.number(),
  brandId: z.number().min(1, "Vui lòng chọn hãng"),
  brandSeriesId: z.number().min(1, "Vui lòng chọn dòng sản phẩm"),
  name: z
    .string()
    .min(1, "Tên sản phẩm không được để trống")
    .max(200, "Tên sản phẩm không được quá 200 ký tự"),
  description: z
    .string()
    .max(2000, "Mô tả không được quá 2000 ký tự")
    .optional()
    .nullable(),
  mainImage: z.instanceof(File).optional().nullable(),
  mainImageUrl: z.string().optional(),
  isActive: z.boolean(),
  existingSubImages: z.array(existingSubImageSchema).optional(),
  newSubImages: z.array(z.instanceof(File)).optional(),
  colorways: z.array(colorwaySchema).optional(),
});

// ==========================================
// Type Exports
// ==========================================

export type ExistingSubImageFormData = z.infer<typeof existingSubImageSchema>;
export type VariantFormData = z.infer<typeof variantSchema>;
export type ColorwayFormData = z.infer<typeof colorwaySchema>;
export type CreateSneakerFormData = z.infer<typeof createSneakerSchema>;
export type UpdateSneakerFormData = z.infer<typeof updateSneakerSchema>;
