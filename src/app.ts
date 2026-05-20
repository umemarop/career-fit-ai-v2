import express from "express";
import morgan from "morgan";

import { AppError } from "./utils/appError.js";
import { errorController } from "./middlewares/error.middleware.js";

import authRouter from "./modules/auth/auth.route.js";
import sessionRoutes from "./modules/session/session.route.js";
import profileRouter from "./modules/profile/profile.route.js";
import jobAnalysisRouter from "./modules/jobAnalysis/jobAnalysis.route.js";
import applicationRouter from "./modules/application/application.route.js";

export const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "CareerFit API v2 is running 🚀",
    version: "v2",
    endpoints: {
      auth: "/api/v2/auth",
      sessions: "/api/v2/sessions",
      profile: "/api/v2/profile",
      jobAnalysis: "/api/v2/job-analysis",
      application: "/api/v2/application",
    },
  });
});

app.use("/api/v2/auth", authRouter);
app.use("/api/v2/sessions", sessionRoutes);
app.use("/api/v2/profile", profileRouter);
app.use("/api/v2/job-analysis", jobAnalysisRouter);
app.use("/api/v2/applications", applicationRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);
