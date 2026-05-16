import "dotenv/config";

import http from "http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./prisma/client.js";

let server: http.Server | undefined;
let isShutdown = false;

const shutdown = async (exitCode = 0) => {
  if (isShutdown) return;
  isShutdown = true;

  console.log("Shutting down...");

  try {
    const currentServer = server;

    if (currentServer) {
      await new Promise<void>((resolve, reject) => {
        currentServer.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log("HTTP server closed.");
    }

    await prisma.$disconnect();
    console.log("Prisma disconnected.");
  } catch (err) {
    console.error("Error during shutdown:", err);
    exitCode = 1;
  } finally {
    process.exit(exitCode);
  }
};

process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);

  if (server) {
    void shutdown(1);
  } else {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(reason);

  void shutdown(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  void shutdown(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  void shutdown(0);
});

server = app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
