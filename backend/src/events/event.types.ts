export type AppEvents = {
  "auth.emailVerificationRequested": {
    userId: string;
    email: string;
    name: string | null;
    verificationUrl: string;
  };

  "auth.passwordResetRequested": {
    userId: string;
    email: string;
    name: string | null;
    resetUrl: string;
  };
};
