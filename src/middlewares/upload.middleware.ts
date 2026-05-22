import multer from "multer";
import { AppError } from "../utils/appError.js";

const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter: (req, file, cb) => {
    if (!allowedImageMimeTypes.includes(file.mimetype)) {
      return cb(
        new AppError("Only jpeg, png, and webp images are allowed", 400),
      );
    }

    cb(null, true);
  },
});
