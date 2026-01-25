import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponseError } from "~/types/global/api.response";

const api: AxiosInstance = axios.create({
  baseURL:
    typeof window !== "undefined"
      ? window.ENV.VITE_API_URL
      : import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if error is 401 (Unauthorized) and token might be expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent refresh token endpoint from triggering refresh
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        const apiError: ApiResponseError = {
          success: false,
          statusCode: 401,
          message: "Session expired. Please login again.",
          data: null,
          errors: null,
        };
        return Promise.reject(apiError);
      }

      // Check if refreshToken cookie exists before attempting refresh
      // If no cookie exists (user not logged in), don't attempt refresh for public APIs
      const hasRefreshToken = document.cookie
        .split("; ")
        .some((cookie) => cookie.startsWith("refreshToken="));

      if (!hasRefreshToken) {
        // No refresh token cookie - user is not logged in
        // Return original error for public APIs or proper auth error for protected APIs
        const apiError: ApiResponseError = {
          success: false,
          statusCode: error.response?.status || 401,
          message:
            (error.response?.data as any)?.message ||
            (error.response?.data as any)?.Message ||
            error.message ||
            "Unauthorized",
          data: null,
          errors: (error.response?.data as any)?.errors || null,
        };
        return Promise.reject(apiError);
      }

      console.log("[api.client] Received 401, attempting token refresh...");

      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token API
        await api.post("/auth/refresh-token");

        console.log("[api.client] Token refreshed successfully");

        // Token refreshed successfully, process queued requests
        processQueue();
        isRefreshing = false;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, reject all queued requests
        console.error("[api.client] Token refresh failed:", refreshError);
        processQueue(refreshError);
        isRefreshing = false;

        const apiError: ApiResponseError = {
          success: false,
          statusCode: 401,
          message: "Session expired. Please login again.",
          data: null,
          errors: null,
        };
        return Promise.reject(apiError);
      }
    }

    // Handle other errors
    const apiError: ApiResponseError = {
      success: false,
      statusCode: error.response?.status || 500,
      message:
        (error.response?.data as any)?.message ||
        (error.response?.data as any)?.Message ||
        error.message ||
        "Something went wrong",
      data: null,
      errors: (error.response?.data as any)?.errors || null,
    };
    return Promise.reject(apiError);
  },
);

export default api;
