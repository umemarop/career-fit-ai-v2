export type ApiFieldError = {
  path?: string;
  field?: string;
  message?: string;
};

export type ApiErrorResponse = {
  status?: "success" | "error" | "fail";
  message?: string;
  errors?: ApiFieldError[] | Record<string, string>;
};

export type NormalizedApiError = {
  statusCode?: number;
  message: string;
  fieldErrors?: Record<string, string>;
  isNetworkError: boolean;
};
