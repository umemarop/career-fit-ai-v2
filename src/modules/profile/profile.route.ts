import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { uploadAvatar } from "../../middlewares/upload.middleware.js";
import {
  deleteProfile,
  getProfile,
  upsertProfile,
  updateAvatar,
  deleteAvatar,
} from "./profile.controller.js";

import { upsertProfileSchema } from "./profile.validation.js";

const router = Router();

router.use(protect);

router.get("/me", getProfile);

router
  .route("/")
  .put(validate(upsertProfileSchema), upsertProfile)
  .delete(deleteProfile);

router.patch("/avatar", uploadAvatar.single("avatar"), updateAvatar);

router.delete("/avatar", deleteAvatar);

export default router;
