import axios from "axios";

import type {
  ApiErrorResponse,
  ApiFieldError,
  NormalizedApiError,
} from "@/types/api-error.type";

const fieldLabelMap: Record<string, string> = {
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm password",
  currentPassword: "Current password",

  targetRole: "Target role",
  location: "Location",
  experienceLevel: "Experience level",
  workEligibility: "Work eligibility",
  preferredJobType: "Preferred job type",
  remotePreference: "Remote preference",
  skills: "Skills",
  desiredRoles: "Desired roles",
  careerGoals: "Career goals",

  jobTitle: "Job title",
  companyName: "Company name",
  jobDescription: "Job description",
  status: "Status",
  notes: "Notes",
};

const normalizeFieldKey = (field: string) => {
  return field
    .replace(/^body\./, "")
    .replace(/^params\./, "")
    .replace(/^query\./, "");
};

const getFieldKey = (error: ApiFieldError) => {
  return normalizeFieldKey(error.path || error.field || "");
};

const toFriendlyFieldMessage = (field: string, message?: string) => {
  const label = fieldLabelMap[field] || field;

  if (!message) {
    return `${label} is invalid.`;
  }

  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("required") ||
    lowerMessage.includes("received undefined")
  ) {
    return `${label} is required.`;
  }

  if (
    lowerMessage.includes("invalid enum") ||
    lowerMessage.includes("invalid option")
  ) {
    return `Please select a valid ${label.toLowerCase()}.`;
  }

  if (lowerMessage.includes("too small")) {
    return `${label} is too short.`;
  }

  if (lowerMessage.includes("too big")) {
    return `${label} is too long.`;
  }

  return message;
};

const parseFieldErrors = (
  errors?: ApiFieldError[] | Record<string, string>,
) => {
  if (!errors) {
    return undefined;
  }

  const fieldErrors: Record<string, string> = {};

  if (Array.isArray(errors)) {
    for (const error of errors) {
      const field = getFieldKey(error);

      if (!field) {
        continue;
      }

      fieldErrors[field] = toFriendlyFieldMessage(field, error.message);
    }

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
  }

  for (const [rawField, message] of Object.entries(errors)) {
    const field = normalizeFieldKey(rawField);

    if (!field) {
      continue;
    }

    fieldErrors[field] = toFriendlyFieldMessage(field, message);
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
};

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response) {
      return {
        message: "Unable to connect to the server.",
        isNetworkError: true,
      };
    }

    const statusCode = error.response.status;
    const responseData = error.response.data;
    const fieldErrors = parseFieldErrors(responseData?.errors);

    if (fieldErrors) {
      return {
        statusCode,
        message: "Please review the highlighted fields.",
        fieldErrors,
        isNetworkError: false,
      };
    }

    if (statusCode === 401) {
      return {
        statusCode,
        message: responseData?.message || "Please log in again.",
        isNetworkError: false,
      };
    }

    if (statusCode === 403) {
      return {
        statusCode,
        message:
          responseData?.message ||
          "You do not have permission to perform this action.",
        isNetworkError: false,
      };
    }

    if (statusCode >= 500) {
      return {
        statusCode,
        message: "Server error. Please try again later.",
        isNetworkError: false,
      };
    }

    return {
      statusCode,
      message:
        responseData?.message ||
        "Something went wrong while processing your request.",
      isNetworkError: false,
    };
  }

  return {
    message: "An unexpected error occurred.",
    isNetworkError: false,
  };
};
