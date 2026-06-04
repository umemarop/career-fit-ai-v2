export type SettingsUser = {
  id: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  browser: string | null;
  os: string | null;
  deviceType: string | null;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isCurrent: boolean;
};

export type ChangePasswordInput = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export type GetMeResponse = {
  status: "success";
  data: {
    user: SettingsUser;
  };
};

export type GetSessionsResponse = {
  status: "success";
  results: number;
  data: {
    sessions: Session[];
  };
};

export type MessageResponse = {
  status: "success";
  message: string;
};
