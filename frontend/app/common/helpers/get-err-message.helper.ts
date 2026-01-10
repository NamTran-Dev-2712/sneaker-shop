import type { ApiResponseError } from "~/types/global/api.response";

export const getErrMessage = (error: ApiResponseError): string => {
  if (error.errors && error.errors.length > 0) {
    return error.errors[0];
  }
  return error.message || "An unexpected error occurred.";
};
