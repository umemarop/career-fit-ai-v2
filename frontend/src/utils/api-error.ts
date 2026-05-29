import axios from "axios";

import type {
  ApiErrorResponse,
  NormalizedApiError,
} from "@/types/api-error.type";

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response) {
      return {
        message: "Unable to connect to the server.",
        isNetworkError: true,
      };
    }

    return {
      statusCode: error.response.status,
      message:
        error.response.data?.message ||
        "Something went wrong while processing your request.",
      fieldErrors: error.response.data?.errors,
      isNetworkError: false,
    };
  }

  return {
    message: "An unexpected error occurred.",
    isNetworkError: false,
  };
};
