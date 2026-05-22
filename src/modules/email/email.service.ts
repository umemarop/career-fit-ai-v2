import { Resend } from "resend";
import { env } from "../../config/env.js";
import {
  passwordResetEmailTemplate,
  verificationEmailTemplate,
  type EmailTemplate,
} from "./templates/index.js";

const resend = new Resend(env.RESEND_API_KEY);

type EmailUser = {
  email: string;
  name?: string | null;
};

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export class EmailService {
  private readonly from = env.EMAIL_FROM;

  private async send({ to, subject, html, text }: SendEmailOptions) {
    await resend.emails.send({
      from: this.from,
      to,
      subject,
      html,
      text,
    });
  }

  async sendVerificationEmail(user: EmailUser, verificationUrl: string) {
    const name = user.name || user.email;

    const template: EmailTemplate = verificationEmailTemplate({
      name,
      url: verificationUrl,
    });

    await this.send({
      to: user.email,
      ...template,
    });
  }

  async sendPasswordResetEmail(user: EmailUser, resetUrl: string) {
    const name = user.name || user.email;

    const template: EmailTemplate = passwordResetEmailTemplate({
      name,
      url: resetUrl,
    });

    await this.send({
      to: user.email,
      ...template,
    });
  }
}

export const emailService = new EmailService();
