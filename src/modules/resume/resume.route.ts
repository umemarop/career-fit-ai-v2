import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { uploadResume } from "../../middlewares/upload.middleware.js";
import {
  deleteResume,
  getResumeMe,
  uploadResume as uploadResumeController,
} from "./resume.controller.js";

const router = Router();
router.use(protect);
router.post(
  "/upload",

  uploadResume.single("resume"),
  uploadResumeController,
);

router.get("/me", getResumeMe);

router.delete("/", deleteResume);

export default router;
