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

export type AuthResponse = {
  status: "success";
  data: {
    user: AuthUser;
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
