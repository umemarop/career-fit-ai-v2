export const UPLOAD_LIMITS = {
  AVATAR_MAX_FILE_SIZE: 5 * 1024 * 1024,
  RESUME_MAX_FILE_SIZE: 10 * 1024 * 1024,
} as const;

export const ALLOWED_MIME_TYPES = {
  AVATAR: ["image/jpeg", "image/png", "image/webp"],
  RESUME: ["application/pdf"],
} as const;

export const UPLOAD_ERROR_MESSAGES = {
  AVATAR_INVALID_FILE_TYPE: "Only jpeg, png, and webp images are allowed",
  RESUME_INVALID_FILE_TYPE: "Only PDF files are allowed",
} as const;
