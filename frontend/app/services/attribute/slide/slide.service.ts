import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateSlideRequest } from "./dto/create-slide/create-slide.request";
import type { CreateSlideResponse } from "./dto/create-slide/create-slide.response";
import type { UpdateSlideRequest } from "./dto/update-slide/update-slide.request";
import type { UpdateSlideResponse } from "./dto/update-slide/update-slide.response";
import type { GetSlideRequest } from "./dto/get-slide/get-slide.request";
import type {
  GetSlideItem,
  GetSlideResponse,
} from "./dto/get-slide/get-slide.response";

export const slideService = {
  createSlide: async (
    createSlideRequest: CreateSlideRequest,
  ): Promise<ApiResponse<CreateSlideResponse | null>> => {
    try {
      const formData = new FormData();
      formData.append("title", createSlideRequest.title);
      formData.append("subtitle", createSlideRequest.subtitle);
      formData.append("description", createSlideRequest.description);
      formData.append("image", createSlideRequest.image);
      formData.append("buttonText", createSlideRequest.buttonText);
      formData.append("buttonUrl", createSlideRequest.buttonUrl);

      const res = await api.post<ApiResponse<CreateSlideResponse | null>>(
        "/slides",
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

  updateSlide: async (
    updateSlideRequest: UpdateSlideRequest,
    slideId: number,
  ): Promise<ApiResponse<UpdateSlideResponse | null>> => {
    try {
      const formData = new FormData();
      formData.append("id", slideId.toString());
      formData.append("title", updateSlideRequest.title);
      formData.append("subtitle", updateSlideRequest.subtitle);
      formData.append("description", updateSlideRequest.description);
      if (updateSlideRequest.image) {
        formData.append("image", updateSlideRequest.image);
      }
      formData.append("buttonText", updateSlideRequest.buttonText);
      formData.append("buttonUrl", updateSlideRequest.buttonUrl);

      const res = await api.put<ApiResponse<UpdateSlideResponse | null>>(
        `/slides/${slideId}`,
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

  deleteSlide: async (slideId: number): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(`/slides/${slideId}`);
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

  getAllSlides: async (): Promise<ApiResponse<GetSlideItem[] | null>> => {
    try {
      const res =
        await api.get<ApiResponse<GetSlideItem[] | null>>(`/slides/all`);
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

  getSlides: async (
    query: GetSlideRequest,
  ): Promise<ApiResponse<GetSlideResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetSlideResponse | null>>(
        `/slides`,
        { params: query },
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
