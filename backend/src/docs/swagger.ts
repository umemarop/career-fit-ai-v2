import swaggerJSDoc from "swagger-jsdoc";
import { env } from "../config/env.js";

import { components } from "./components.js";
import { authPaths } from "./auth.paths.js";
import { sessionPaths } from "./session.paths.js";
import { profilePaths } from "./profile.paths.js";
import { resumePaths } from "./resume.paths.js";
import { jobAnalysisPaths } from "./jobAnalysis.paths.js";
import { aiUsagePaths } from "./aiUsage.paths.js";
import { applicationPaths } from "./application.paths.js";
import { adminPaths } from "./admin.paths.js";
import { healthPaths } from "./health.paths.js";

const localServerUrl = `http://localhost:${env.PORT}`;

const servers = [
  {
    url: localServerUrl,
    description: "Local server",
  },
];

if (env.API_URL) {
  servers.push({
    url: env.API_URL,
    description: "Production server",
  });
}

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "CareerFit AI v2 API",
      version: "2.0.0",
      description:
        "CareerFit AI v2 backend API for authentication, sessions, profiles, resumes, job analysis, AI usage limits, applications, admin management, and health checks.",
      contact: {
        name: "Sanghun Han",
        email: "umemarop@gmail.com",
      },
    },

    servers,

    tags: [
      { name: "Health", description: "Server health and intro endpoints" },
      {
        name: "Authentication",
        description:
          "Register, login, logout, token refresh, email verification, and password recovery",
      },
      { name: "Session", description: "User session management endpoints" },
      { name: "Profile", description: "User profile endpoints" },
      {
        name: "Resume",
        description: "Resume upload, parsing, retrieval, and deletion",
      },
      {
        name: "Job Analysis",
        description: "AI-powered job analysis endpoints",
      },
      {
        name: "AI Usage",
        description: "AI usage limit and daily usage status endpoints",
      },
      {
        name: "Application",
        description: "Job application tracking endpoints",
      },
      {
        name: "Admin",
        description: "Admin user management endpoints",
      },
    ],

    components,

    paths: {
      ...healthPaths,
      ...authPaths,
      ...sessionPaths,
      ...profilePaths,
      ...resumePaths,
      ...jobAnalysisPaths,
      ...aiUsagePaths,
      ...applicationPaths,
      ...adminPaths,
    },
  },

  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
