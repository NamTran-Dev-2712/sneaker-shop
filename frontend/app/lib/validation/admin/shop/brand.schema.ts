import { z } from "zod/v4";

// Brand form validation schema
export const brandFormSchema = z.object({
  name: z
    .string()
    .min(1, "Tên hãng không được để trống")
    .max(100, "Tên hãng không được quá 100 ký tự")
    .regex(
      /^[a-zA-Z0-9\s\-&.]+$/,
      "Tên hãng chỉ chứa chữ cái, số và các ký tự đặc biệt: - & .",
    ),
  isActive: z.boolean(),
});

export type BrandFormData = z.infer<typeof brandFormSchema>;

// Brand create validation (extends form schema)
export const brandCreateSchema = brandFormSchema.extend({
  logo: z
    .instanceof(File, { message: "Vui lòng chọn logo cho hãng" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Kích thước logo không được vượt quá 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "Logo phải là file ảnh (JPG, PNG, WEBP)",
    ),
});

export type BrandCreateData = z.infer<typeof brandCreateSchema>;

// Brand update validation (logo is optional)
export const brandUpdateSchema = brandFormSchema.extend({
  logo: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Kích thước logo không được vượt quá 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "Logo phải là file ảnh (JPG, PNG, WEBP)",
    )
    .optional()
    .nullable(),
});

export type BrandUpdateData = z.infer<typeof brandUpdateSchema>;

// Brand series validation schema
export const brandSeriesSchema = z.object({
  name: z
    .string()
    .min(1, "Tên dòng sản phẩm không được để trống")
    .max(100, "Tên dòng sản phẩm không được quá 100 ký tự")
    .regex(
      /^[a-zA-Z0-9\s\-&.]+$/,
      "Tên dòng sản phẩm chỉ chứa chữ cái, số và các ký tự đặc biệt: - & .",
    ),
});

export type BrandSeriesFormData = z.infer<typeof brandSeriesSchema>;

// For create brand series (array of series)
export const brandSeriesArraySchema = z
  .array(brandSeriesSchema)
  .min(1, "Vui lòng thêm ít nhất một dòng sản phẩm");

export type BrandSeriesArrayData = z.infer<typeof brandSeriesArraySchema>;
