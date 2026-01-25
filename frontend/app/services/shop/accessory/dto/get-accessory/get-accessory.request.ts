import type { BaseGetRequest } from "~/types/global/base.request";

export interface GetAccessoryRequest extends BaseGetRequest {
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: string;
}
