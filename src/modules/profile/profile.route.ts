import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireEmailVerified } from "../../middlewares/requireEmailVerified.middleware.js";
import {
  uploadAvatar,
  uploadResume,
} from "../../middlewares/upload.middleware.js";
import {
  deleteProfile,
  getProfile,
  upsertProfile,
  updateAvatar,
  deleteAvatar,
} from "./profile.controller.js";
import {
  autofillProfileFromResume,
  autofillProfileFromUploadedResume,
} from "./profile.autofill.controller.js";

import { upsertProfileSchema } from "./profile.validation.js";

const router = Router();

router.use(protect);
router.use(requireEmailVerified);

router.get("/me", getProfile);

router.post("/autofill/resume", autofillProfileFromResume);

router.post(
  "/autofill/resume/upload",
  uploadResume.single("resume"),
  autofillProfileFromUploadedResume,
);

router
  .route("/")
  .put(validate(upsertProfileSchema), upsertProfile)
  .delete(deleteProfile);

router.patch("/avatar", uploadAvatar.single("avatar"), updateAvatar);

router.delete("/avatar", deleteAvatar);

export default router;
