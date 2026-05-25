import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { AddToCartRequest } from "./dto/add-to-cart/add-to-cart.request";
import type { AddToCartResponse } from "./dto/add-to-cart/add-to-cart.response";
import type { UpdateCartItemRequest } from "./dto/update-cart-item/update-cart-item.request";
import type { UpdateCartItemResponse } from "./dto/update-cart-item/update-cart-item.response";
import type { GetCartResponse } from "./dto/get-cart/get-cart.response";

export const cartService = {
  getCart: async (
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<ApiResponse<GetCartResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetCartResponse | null>>("/cart", {
        params: {
          pageNumber,
          pageSize,
        },
      });
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

  addToCart: async (
    addToCartRequest: AddToCartRequest,
  ): Promise<ApiResponse<AddToCartResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<AddToCartResponse | null>>(
        "/cart/items",
        addToCartRequest,
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

  updateCartItem: async (
    cartItemId: number,
    updateCartItemRequest: UpdateCartItemRequest,
  ): Promise<ApiResponse<UpdateCartItemResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateCartItemResponse | null>>(
        `/cart/items/${cartItemId}`,
        updateCartItemRequest,
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

  removeCartItem: async (cartItemId: number): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(
        `/cart/items/${cartItemId}`,
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

  clearCart: async (): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>("/cart");
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
