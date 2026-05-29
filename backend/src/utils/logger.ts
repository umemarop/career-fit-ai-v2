// src/utils/logger.ts

type LogLevel = "info" | "warn" | "error";

const log = (level: LogLevel, message: string, meta?: unknown) => {
  const payload = {
    level,
    message,
    ...(meta !== undefined && { meta }),
    timestamp: new Date().toISOString(),
  };

  const output = JSON.stringify(payload);

  if (level === "error") {
    console.error(output);
    return;
  }

  if (level === "warn") {
    console.warn(output);
    return;
  }

  console.log(output);
};

export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
};
