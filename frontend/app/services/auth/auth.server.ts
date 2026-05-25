import api from "~/common/configs/axios.server";
import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import type { LoginResponse } from "./dto/login/login.response";
import { getCookieFromRequest } from "~/common/helpers/cookie.helper";

export const authServiceFromServer = {
  getProfile: async (
    request: Request,
  ): Promise<ApiResponse<LoginResponse | null>> => {
    const cookie = getCookieFromRequest(request) ?? "";

    if (!cookie) {
      console.warn("[auth.server] ⚠️ No cookie found in request");
      await api.post("/auth/logout");
      return {
        success: false,
        statusCode: 401,
        message: "No authentication cookie found",
        data: null,
        errors: null,
      };
    }

    try {
      // show url in console
      console.log(api.defaults.baseURL + "/auth/profile");

      const res = await api.get<ApiResponse<LoginResponse | null>>(
        "/auth/profile",
        {
          headers: {
            cookie,
          },
        },
      );

      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      console.error("[auth.server] ❌ Failed to fetch profile:", err.message);

      return {
        success: false,
        statusCode: err.statusCode || 500,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  logout: async (request?: Request) => {
    const cookie = request ? (getCookieFromRequest(request) ?? "") : "";

    try {
      await api.post("/auth/logout", {});
      console.log("[auth.server] ✅ Logout successful");
    } catch (error) {
      console.error("[auth.server] ❌ Logout failed:", error);
    }
  },
};
