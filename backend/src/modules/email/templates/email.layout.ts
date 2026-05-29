type EmailLayoutProps = {
  title: string;
  body: string;
  buttonText: string;
  url: string;
  footerText: string;
};

export const emailLayout = ({
  title,
  body,
  buttonText,
  url,
  footerText,
}: EmailLayoutProps): string => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 32px;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
        <h1 style="margin: 0 0 16px; font-size: 24px; color: #111827;">
          ${title}
        </h1>

        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
          ${body}
        </p>

        <a
          href="${url}"
          style="display: inline-block; padding: 12px 20px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;"
        >
          ${buttonText}
        </a>

        <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
          If the button does not work, copy and paste this link into your browser:
        </p>

        <p style="word-break: break-all; margin: 8px 0 0; font-size: 14px; line-height: 1.6; color: #2563eb;">
          ${url}
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
          ${footerText}
        </p>
      </div>
    </div>
  `;
};
