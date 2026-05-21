export type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

export type EmailTemplateProps = {
  name: string;
  url: string;
};
