import { emailLayout } from "./email.layout.js";
import type { EmailTemplate, EmailTemplateProps } from "./email.types.js";

export const verificationEmailTemplate = ({
  name,
  url,
}: EmailTemplateProps): EmailTemplate => {
  return {
    subject: "Verify your email address",
    html: emailLayout({
      title: "Verify your email address",
      body: `Hi ${name}, welcome to Career Fit AI. Please verify your email address to complete your account setup.`,
      buttonText: "Verify Email",
      url,
      footerText:
        "This email verification link will expire soon. If you did not create an account, you can safely ignore this email.",
    }),
    text: `Hi ${name},

Welcome to Career Fit AI.

Please verify your email address by opening the link below:

${url}

This email verification link will expire soon.

If you did not create an account, you can safely ignore this email.`,
  };
};
