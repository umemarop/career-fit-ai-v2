import { eventBus } from "../../events/eventBus.js";
import { emailService } from "../email/email.service.js";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

eventBus.on("auth.emailVerificationRequested", async (payload) => {
  if (env.NODE_ENV === "test") {
    return;
  }

  try {
    await emailService.sendVerificationEmail(
      {
        email: payload.email,
        name: payload.name,
      },
      payload.verificationUrl,
    );

    logger.info("Verification email sent", {
      email: payload.email,
    });
  } catch (error) {
    logger.error("Failed to send verification email", {
      error,
      email: payload.email,
    });
  }
});

eventBus.on("auth.passwordResetRequested", async (payload) => {
  if (env.NODE_ENV === "test") {
    return;
  }

  try {
    await emailService.sendPasswordResetEmail(
      {
        email: payload.email,
        name: payload.name,
      },
      payload.resetUrl,
    );

    logger.info("Password reset email sent", {
      email: payload.email,
    });
  } catch (error) {
    logger.error("Failed to send password reset email", {
      error,
      email: payload.email,
    });
  }
});
