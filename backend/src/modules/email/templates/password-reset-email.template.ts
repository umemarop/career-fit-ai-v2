import { emailLayout } from "./email.layout.js";
import type { EmailTemplate, EmailTemplateProps } from "./email.types.js";

export const passwordResetEmailTemplate = ({
  name,
  url,
}: EmailTemplateProps): EmailTemplate => {
  return {
    subject: "Reset your password",
    html: emailLayout({
      title: "Reset your password",
      body: `Hi ${name}, we received a request to reset your Career Fit AI password. Click the button below to choose a new password.`,
      buttonText: "Reset Password",
      url,
      footerText:
        "This password reset link will expire soon. If you did not request a password reset, you can safely ignore this email.",
    }),
    text: `Hi ${name},

We received a request to reset your Career Fit AI password.

Reset your password by opening the link below:

${url}

This password reset link will expire soon.

If you did not request a password reset, you can safely ignore this email.`,
  };
};
