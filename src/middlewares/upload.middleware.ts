import multer from "multer";
import { AppError } from "../utils/appError.js";
import {
  ALLOWED_MIME_TYPES,
  UPLOAD_ERROR_MESSAGES,
  UPLOAD_LIMITS,
} from "../constants/upload.constants.js";

type CreateUploadOptions = {
  allowedMimeTypes: readonly string[];
  maxFileSize: number;
  errorMessage: string;
};
const createUploadMiddleware = ({
  allowedMimeTypes,
  maxFileSize,
  errorMessage,
}: CreateUploadOptions) => {
  return multer({
    storage: multer.memoryStorage(),

    limits: {
      fileSize: maxFileSize,
    },

    fileFilter: (req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new AppError(errorMessage, 400));
      }

      cb(null, true);
    },
  });
};

export const uploadAvatar = createUploadMiddleware({
  allowedMimeTypes: ALLOWED_MIME_TYPES.AVATAR,
  maxFileSize: UPLOAD_LIMITS.AVATAR_MAX_FILE_SIZE,
  errorMessage: UPLOAD_ERROR_MESSAGES.AVATAR_INVALID_FILE_TYPE,
});

export const uploadResume = createUploadMiddleware({
  allowedMimeTypes: ALLOWED_MIME_TYPES.RESUME,
  maxFileSize: UPLOAD_LIMITS.RESUME_MAX_FILE_SIZE,
  errorMessage: UPLOAD_ERROR_MESSAGES.RESUME_INVALID_FILE_TYPE,
});
