import type { BaseGetResponse } from "~/types/global/base.response";

export interface GetSlideItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  createdAt: string;
}

export interface GetSlideResponse extends BaseGetResponse<GetSlideItem> {}
