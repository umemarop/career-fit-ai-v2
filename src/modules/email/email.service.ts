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
  subject: string;
  html: string;
  text: string;
};

export class EmailService {
  private readonly to: string;
  private readonly name: string;
  private readonly url: string;
  private readonly from: string;

  constructor(user: EmailUser, url: string) {
    this.to = user.email;
    this.name = user.name || user.email;
    this.url = url;
    this.from = env.EMAIL_FROM;
  }

  private async send({ subject, html, text }: SendEmailOptions) {
    await resend.emails.send({
      from: this.from,
      to: this.to,
      subject,
      html,
      text,
    });
  }

  async sendVerificationEmail() {
    const template: EmailTemplate = verificationEmailTemplate({
      name: this.name,
      url: this.url,
    });

    await this.send(template);
  }

  async sendPasswordResetEmail() {
    const template: EmailTemplate = passwordResetEmailTemplate({
      name: this.name,
      url: this.url,
    });

    await this.send(template);
  }
}
