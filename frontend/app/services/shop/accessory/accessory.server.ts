import apiServer from "~/common/configs/axios.server";
import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import type { GetAccessoryDetailResponse } from "./dto/get-accessory/get-accessory.response";

/**
 * Server-side accessory service for SSR data fetching (SEO)
 */
export const accessoryServerService = {
  /**
   * Get accessory detail by slug for server-side rendering
   */
  getAccessoryBySlug: async (
    slug: string,
    cookie?: string,
  ): Promise<ApiResponse<GetAccessoryDetailResponse | null>> => {
    try {
      const res = await apiServer.get<
        ApiResponse<GetAccessoryDetailResponse | null>
      >(`/accessory/slug/${slug}`, {
        headers: cookie ? { Cookie: cookie } : undefined,
      });
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode || 500,
        message: err.message || "Không thể tải thông tin sản phẩm",
        data: null,
        errors: err.errors,
      };
    }
  },
};
