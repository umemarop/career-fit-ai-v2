export type AdminRole = "USER" | "ADMIN";

export type AdminUserStatus = "ACTIVE" | "DISABLED";

export type AdminVerifiedFilter = "ALL" | "VERIFIED" | "UNVERIFIED";

export type AdminUsersSort =
  | "latest"
  | "oldest"
  | "email_asc"
  | "email_desc"
  | "role_asc"
  | "role_desc";

export type AdminStats = {
  users: {
    total: number;
    active: number;
    disabled: number;
    verified: number;
    unverified: number;
    admins: number;
  };

  profiles: {
    total: number;
  };

  resumes: {
    total: number;
  };

  applications: {
    total: number;
    active: number;
    deleted: number;
  };

  jobAnalyses: {
    total: number;
    active: number;
    deleted: number;
  };
};

export type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type AdminProfile = {
  id: string;
  avatarUrl: string | null;
  experienceLevel: string;
  workEligibility: string | null;
  location: string | null;
  targetRole: string | null;
  desiredRoles: string[];
  careerGoals: string | null;
  preferredJobType: string | null;
  remotePreference: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminResume = {
  id: string;
  originalName: string;
  fileUrl: string | null;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserDetail = AdminUser & {
  profile: AdminProfile | null;
  resume: AdminResume | null;
  hasProfile: boolean;
  hasResume: boolean;
  counts: {
    applications: number;
    jobAnalyses: number;
    activeSessions: number;
  };
};

export type AdminUsersMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type AdminUsersResponse = {
  users: AdminUser[];
  meta: AdminUsersMeta;
};

export type AdminUserResponse = {
  user: AdminUser;
};

export type AdminUserDetailResponse = {
  user: AdminUserDetail;
};
export type UpdateAdminUserRoleInput = {
  role: AdminRole;
};

export type UpdateAdminUserStatusInput = {
  status: AdminUserStatus;
};

export type AdminUsersQuery = {
  keyword?: string;
  role?: AdminRole;
  verified?: boolean;
  status?: AdminUserStatus;
  page?: number;
  limit?: number;
  sort?: AdminUsersSort;
};

export const getAdminUserStatus = (user: Pick<AdminUser, "deletedAt">) => {
  return user.deletedAt ? "DISABLED" : "ACTIVE";
};
