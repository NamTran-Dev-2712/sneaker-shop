import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponseError } from "~/types/global/api.response";

// Remix SSR: always use process.env instead of import.meta.env
const baseURL = process.env.API_URL || process.env.VITE_API_URL;

if (!baseURL) {
  console.warn("[api.server] ⚠️ Missing API_URL in environment variables");
}

// Create axios instance specifically for server
const apiServer: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // Extremely important: Remix loader runs in Node so it can still send cookies with requests
  // => you must manually attach cookies from the request if you want authentication
  timeout: 20000,
  withCredentials: true,
});

// Store to maintain cookie across requests within same refresh flow
let storedCookie: string | undefined;

// Store new cookies from refresh token response to forward to browser
let newCookiesFromRefresh: string[] = [];

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

// Request interceptor to ensure cookie is always attached
apiServer.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If there's a stored cookie from previous request, use it
    if (storedCookie && !config.headers.cookie) {
      config.headers.cookie = storedCookie;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor to handle errors with refresh token logic
apiServer.interceptors.response.use(
  (response: AxiosResponse) => response,
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

      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiServer(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get cookie from original request headers or stored cookie
        const cookieHeader =
          originalRequest.headers?.cookie ||
          originalRequest.headers?.Cookie ||
          storedCookie;

        if (!cookieHeader) {
          // No cookie available - user is not logged in
          // Don't attempt refresh, return original error instead of 'Session expired'
          console.warn(
            "[api.server] ⚠️ No cookie available, skipping refresh token attempt",
          );
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
          isRefreshing = false;
          return Promise.reject(apiError);
        }

        // Check if cookie contains refreshToken
        const hasRefreshToken = cookieHeader.includes("refreshToken=");
        if (!hasRefreshToken) {
          console.warn(
            "[api.server] ⚠️ Cookie exists but no refreshToken found, skipping refresh",
          );
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
          isRefreshing = false;
          return Promise.reject(apiError);
        }

        console.log("[api.server] 🔄 Attempting to refresh token...", {
          hasOriginalCookie: !!(
            originalRequest.headers?.cookie || originalRequest.headers?.Cookie
          ),
          hasStoredCookie: !!storedCookie,
          cookieLength: cookieHeader.length,
          cookiePreview: `${cookieHeader.substring(0, 100)}...`,
        });

        // Call refresh token API with cookie
        const refreshResponse = await apiServer.post(
          "/auth/refresh-token",
          {},
          {
            headers: {
              cookie: cookieHeader,
            },
          },
        );

        console.log("[api.server] ✅ Token refreshed successfully");

        // Extract new cookies from response if available
        const newCookies = refreshResponse.headers["set-cookie"];

        console.log("[api.server] 🍪 Response cookies:", {
          hasSetCookie: !!newCookies,
          cookieCount: Array.isArray(newCookies) ? newCookies.length : 0,
          cookies: newCookies,
        });

        if (newCookies) {
          // Store the new cookie for subsequent requests
          const cookieString = newCookies.join("; ");
          storedCookie = cookieString;

          // Store new cookies to forward to browser later
          newCookiesFromRefresh = Array.isArray(newCookies)
            ? [...newCookies]
            : [newCookies];

          // Update the original request with new cookies
          if (originalRequest.headers) {
            originalRequest.headers.cookie = cookieString;
          }

          console.log("[api.server] 🍪 Updated cookies for future requests:", {
            cookieLength: cookieString.length,
            cookiePreview: `${cookieString.substring(0, 100)}...`,
            willForwardToBrowser: true,
          });
        } else {
          // If no new cookies, keep using the existing one
          if (originalRequest.headers && cookieHeader) {
            originalRequest.headers.cookie = cookieHeader;
          }
          console.warn(
            "[api.server] ⚠️ No set-cookie in refresh response, using existing cookie",
          );
        }

        // Token refreshed successfully, process queued requests
        processQueue();
        isRefreshing = false;

        // Retry the original request
        return apiServer(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, reject all queued requests
        console.error("[api.server] ❌ Token refresh failed:", refreshError);
        processQueue(refreshError);
        isRefreshing = false;
        storedCookie = undefined; // Clear stored cookie on failure

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
    const errorData = error.response?.data as any;
    const apiError: ApiResponseError = {
      success: false,
      statusCode: error.response?.status || 500,
      message:
        errorData?.message ||
        errorData?.Message ||
        error.message ||
        "Something went wrong",
      data: null,
      errors: errorData?.errors || null,
    };

    // Log error for debugging
    if (error.response?.status && error.response.status >= 500) {
      console.error("[api.server] 🔴 Server error:", {
        status: error.response.status,
        url: originalRequest?.url,
        message: apiError.message,
      });
    }

    return Promise.reject(apiError);
  },
);

// Helper function to set cookie for all subsequent requests in this instance
export const setServerCookie = (cookie: string) => {
  storedCookie = cookie;
};

// Helper function to clear stored cookie
export const clearServerCookie = () => {
  storedCookie = undefined;
};

// Helper function to get new cookies from refresh token response
// This should be called in loaders to forward cookies to browser
export const getNewCookiesFromResponse = (): string[] | null => {
  if (newCookiesFromRefresh.length > 0) {
    const cookies = [...newCookiesFromRefresh];
    newCookiesFromRefresh = []; // Clear after reading
    return cookies;
  }
  return null;
};

// Helper function to clear new cookies
export const clearNewCookies = () => {
  newCookiesFromRefresh = [];
};

export default apiServer;
