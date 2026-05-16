import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "./profile.controller.js";
import {
  createProfileSchema,
  updateProfileSchema,
} from "./profile.validation.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .post(validate(createProfileSchema), createProfile)
  .get(getProfile)
  .patch(validate(updateProfileSchema), updateProfile);

export default router;
