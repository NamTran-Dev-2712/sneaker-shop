import type { BaseGetResponse } from "~/types/global/base.response";

export interface GetColorItem {
  id: number;
  name: string;
  slug: string;
  hex: string;
  productCount: number;
  createdAt: string;
}

export interface GetColorResponse extends BaseGetResponse<GetColorItem> {}
