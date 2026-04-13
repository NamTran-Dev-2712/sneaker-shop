import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { RegisterRequest } from "./dto/register/register.request";
import type { LoginRequest } from "./dto/login/login.request";
import type { LoginResponse } from "./dto/login/login.response";
import type { UpdateProfileRequest } from "./dto/update-profile/update-profile.request";
import type { UpdateProfileResponse } from "./dto/update-profile/update-profile.response";
import type { UpdateAvatarResponse } from "./dto/update-avatar/update-avatar.response";
import type { ChangePasswordRequest } from "./dto/change-password/change-password.request";
import type { ChangePasswordResponse } from "./dto/change-password/change-password.response";
import type { RequestPasswordResetOtpRequest } from "./dto/forgot-password/request-password-reset-otp.request";
import type { RequestPasswordResetOtpResponse } from "./dto/forgot-password/request-password-reset-otp.response";
import type { ResetPasswordWithOtpRequest } from "./dto/forgot-password/reset-password-with-otp.request";
import type { ResetPasswordWithOtpResponse } from "./dto/forgot-password/reset-password-with-otp.response";

const getApiUrl = (): string => {
  if (typeof window !== "undefined" && window.ENV?.VITE_API_URL) {
    return window.ENV.VITE_API_URL;
  }
  return import.meta.env.VITE_API_URL || "http://localhost:5012/api";
};

export const authSerivce = {
  register: async (
    registerRequest: RegisterRequest | FormData,
  ): Promise<ApiResponse<number | null>> => {
    try {
      const res = await api.post<ApiResponse<number | null>>(
        "/auth/register",
        registerRequest,
        {
          headers: {
            "Content-Type":
              registerRequest instanceof FormData
                ? "multipart/form-data"
                : "application/json",
          },
        },
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  login: async (
    loginRequest: LoginRequest,
  ): Promise<ApiResponse<LoginResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<LoginResponse | null>>(
        "/auth/login",
        loginRequest,
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      const res = await api.post<ApiResponse<null>>("/auth/logout");
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  getProfile: async (): Promise<ApiResponse<LoginResponse | null>> => {
    try {
      const res =
        await api.get<ApiResponse<LoginResponse | null>>("/auth/profile");
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  startGoogleLogin: (returnUrl?: string): void => {
    const apiUrl = getApiUrl();
    // Remove trailing /api if present since the OAuth endpoint is under /api/auth/google
    const baseApiUrl = apiUrl.endsWith("/api")
      ? apiUrl
      : apiUrl.replace(/\/api$/, "/api");
    const url = returnUrl
      ? `${baseApiUrl}/auth/google/start?returnUrl=${encodeURIComponent(returnUrl)}`
      : `${baseApiUrl}/auth/google/start`;
    window.location.href = url;
  },

  updateProfile: async (
    request: UpdateProfileRequest,
  ): Promise<ApiResponse<UpdateProfileResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateProfileResponse | null>>(
        "/auth/profile",
        request,
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  changePassword: async (
    request: ChangePasswordRequest,
  ): Promise<ApiResponse<ChangePasswordResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<ChangePasswordResponse | null>>(
        "/auth/password",
        request,
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;
      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  requestPasswordResetOtp: async (
    request: RequestPasswordResetOtpRequest,
  ): Promise<ApiResponse<RequestPasswordResetOtpResponse | null>> => {
    try {
      const res = await api.post<
        ApiResponse<RequestPasswordResetOtpResponse | null>
      >("/auth/forgot-password/request-otp", request);
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;
      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  resendPasswordResetOtp: async (
    request: RequestPasswordResetOtpRequest,
  ): Promise<ApiResponse<RequestPasswordResetOtpResponse | null>> => {
    try {
      const res = await api.post<
        ApiResponse<RequestPasswordResetOtpResponse | null>
      >("/auth/forgot-password/resend-otp", request);
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;
      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  resetPasswordWithOtp: async (
    request: ResetPasswordWithOtpRequest,
  ): Promise<ApiResponse<ResetPasswordWithOtpResponse | null>> => {
    try {
      const res = await api.post<
        ApiResponse<ResetPasswordWithOtpResponse | null>
      >("/auth/forgot-password/reset", request);
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;
      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  updateAvatar: async (
    file: File,
  ): Promise<ApiResponse<UpdateAvatarResponse | null>> => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.put<ApiResponse<UpdateAvatarResponse | null>>(
        "/auth/profile/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },
};
