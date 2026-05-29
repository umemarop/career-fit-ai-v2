export type ApiErrorResponse = {
  status?: string;
  message?: string;
  errors?: Record<string, string>;
};

export type NormalizedApiError = {
  statusCode?: number;
  message: string;
  fieldErrors?: Record<string, string>;
  isNetworkError: boolean;
};
