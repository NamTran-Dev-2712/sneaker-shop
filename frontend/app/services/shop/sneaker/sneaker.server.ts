import apiServer from "~/common/configs/axios.server";
import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import type { GetSneakerDetailResponse } from "./dto/get-sneaker/get-sneaker.response";

/**
 * Server-side sneaker service for SSR data fetching (SEO)
 */
export const sneakerServerService = {
  /**
   * Get sneaker detail by slug for server-side rendering
   */
  getSneakerBySlug: async (
    slug: string,
    cookie?: string,
  ): Promise<ApiResponse<GetSneakerDetailResponse | null>> => {
    try {
      const res = await apiServer.get<
        ApiResponse<GetSneakerDetailResponse | null>
      >(`/sneakers/slug/${slug}`, {
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
