import "dotenv/config";

import http from "http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./prisma/client.js";
import { logger } from "./utils/logger.js";

let server: http.Server | undefined;
let isShutdown = false;

const shutdown = async (exitCode = 0) => {
  if (isShutdown) return;
  isShutdown = true;

  logger.info("Shutting down");

  try {
    const currentServer = server;

    if (currentServer) {
      await new Promise<void>((resolve, reject) => {
        currentServer.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      logger.info("HTTP server closed");
    }

    await prisma.$disconnect();
    logger.info("Prisma disconnected");
  } catch (err) {
    logger.error("Error during shutdown", {
      error: err instanceof Error ? err.message : err,
    });
    exitCode = 1;
  } finally {
    process.exit(exitCode);
  }
};

process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught exception", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  if (server) {
    void shutdown(1);
  } else {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", {
    reason,
  });

  void shutdown(1);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully");
  void shutdown(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully");
  void shutdown(0);
});

server = app.listen(env.PORT, () => {
  logger.info("Server started", {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
  });
});
