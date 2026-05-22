import { eventBus } from "../../events/eventBus.js";
import { emailService } from "../email/email.service.js";

eventBus.on("auth.emailVerificationRequested", async (payload) => {
  console.log("email verification event received", payload.email);
  try {
    await emailService.sendVerificationEmail(
      {
        email: payload.email,
        name: payload.name,
      },
      payload.verificationUrl,
    );
    console.log("verification email sent", payload.email);
  } catch (error) {
    console.error("Failed to send verification email", error);
  }
});

eventBus.on("auth.passwordResetRequested", async (payload) => {
  try {
    await emailService.sendPasswordResetEmail(
      {
        email: payload.email,
        name: payload.name,
      },
      payload.resetUrl,
    );
    console.log("password reset email sent", payload.email);
  } catch (error) {
    console.error("Failed to send password reset email", error);
  }
});
