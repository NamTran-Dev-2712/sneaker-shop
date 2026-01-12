import { z } from "zod/v4";

// Store form validation schema
export const storeFormSchema = z.object({
  code: z
    .string()
    .min(1, "Mã cửa hàng không được để trống")
    .max(20, "Mã cửa hàng không được quá 20 ký tự")
    .regex(
      /^[A-Z0-9\-]+$/,
      "Mã cửa hàng chỉ chứa chữ in hoa, số và dấu gạch ngang",
    )
    .optional(),
  name: z
    .string()
    .min(1, "Tên cửa hàng không được để trống")
    .max(100, "Tên cửa hàng không được quá 100 ký tự"),
  address: z.string().max(200, "Địa chỉ không được quá 200 ký tự").optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
});

export type StoreFormData = z.infer<typeof storeFormSchema>;

// Store create validation (code is required)
export const storeCreateSchema = storeFormSchema.extend({
  code: z
    .string()
    .min(1, "Mã cửa hàng không được để trống")
    .max(20, "Mã cửa hàng không được quá 20 ký tự")
    .regex(
      /^[A-Z0-9\-]+$/,
      "Mã cửa hàng chỉ chứa chữ in hoa, số và dấu gạch ngang",
    ),
});

export type StoreCreateData = z.infer<typeof storeCreateSchema>;

// Store update validation (code is not changeable)
export const storeUpdateSchema = storeFormSchema.omit({ code: true });

export type StoreUpdateData = z.infer<typeof storeUpdateSchema>;
