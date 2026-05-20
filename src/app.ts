import express from "express";
import morgan from "morgan";

import { AppError } from "./utils/appError.js";
import { errorController } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

import authRouter from "./modules/auth/auth.route.js";
import sessionRoutes from "./modules/session/session.route.js";
import profileRouter from "./modules/profile/profile.route.js";
import jobAnalysisRouter from "./modules/jobAnalysis/jobAnalysis.route.js";
import applicationRouter from "./modules/application/application.route.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";

export const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(hpp());
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
