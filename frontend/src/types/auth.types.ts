export type UserRole = "USER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginResponse = {
  status: "success";
  data: {
    user: AuthUser;
    accessToken: string;
  };
};

export type RegisterResponse = {
  status: "success";
  data: {
    user: AuthUser;
  };
};

export type RefreshResponse = {
  status: "success";
  data: {
    accessToken: string;
  };
};

export type MeResponse = {
  status: "success";
  data: {
    user: AuthUser;
  };
};

export type MessageResponse = {
  status: "success";
  message: string;
};

export type GoogleAuthUrlResponse = {
  status: "success";
  data: {
    url: string;
  };
};

export type GoogleCallbackResponse = {
  status: "success";
  data: {
    user: AuthUser;
    accessToken: string;
  };
};
