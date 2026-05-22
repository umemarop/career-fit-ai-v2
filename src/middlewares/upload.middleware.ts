import multer from "multer";
import { AppError } from "../utils/appError.js";

type CreateUploadOptions = {
  allowedMimeTypes: string[];
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
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFileSize: 5 * 1024 * 1024,
  errorMessage: "Only jpeg, png, and webp images are allowed",
});

export const uploadResume = createUploadMiddleware({
  allowedMimeTypes: ["application/pdf"],
  maxFileSize: 10 * 1024 * 1024,
  errorMessage: "Only PDF files are allowed",
});
