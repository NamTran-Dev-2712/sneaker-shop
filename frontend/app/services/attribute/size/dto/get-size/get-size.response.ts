import type { BaseGetResponse } from "~/types/global/base.response";

export interface GetSizeItem {
  id: number;
  system: string;
  value: number;
  productCount: number;
  createdAt: string;
}

export interface GetSizeResponse extends BaseGetResponse<GetSizeItem> {}
