import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireEmailVerified } from "../../middlewares/requireEmailVerified.middleware.js";
import { uploadResume } from "../../middlewares/upload.middleware.js";
import {
  deleteResume,
  getResumeMe,
  uploadResume as uploadResumeController,
} from "./resume.controller.js";

const router = Router();
router.use(protect);
router.use(requireEmailVerified);

router.post(
  "/upload",

  uploadResume.single("resume"),
  uploadResumeController,
);

router.get("/me", getResumeMe);

router.delete("/", deleteResume);

export default router;
