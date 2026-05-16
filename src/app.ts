import express from "express";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

import { AppError } from "./utils/appError.js";
import { errorController } from "./middlewares/error.middleware.js";

import authRouter from "./modules/auth/auth.route.js";
import profileRouter from "./modules/profile/profile.route.js";
import jobAnalysisRouter from "./modules/jobAnalysis/jobAnalysis.route.js";
import applicationRouter from "./modules/application/application.route.js";

export const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "CareerFit API is running 🚀",
    version: "v1",
    endpoints: {
      auth: "/api/v1/auth",
      profile: "/api/v1/profile",
      jobAnalysis: "/api/v1/job-analysis",
      application: "/api/v1/application",
    },
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/job-analysis", jobAnalysisRouter);
app.use("/api/v1/applications", applicationRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);
