import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { RegisterRequest } from "./dto/register/register.request";
import type { LoginRequest } from "./dto/login/login.request";
import type { LoginResponse } from "./dto/login/login.response";

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
};
