import { prisma } from "../../prisma/client.js";
import type { Role } from "../../generated/prisma/enums.js";
import type { Prisma } from "../../generated/prisma/client.js";

import { AppError } from "../../utils/appError.js";
import type {
  GetAdminUsersQuery,
  UpdateAdminUserRoleInput,
  UpdateAdminUserStatusInput,
} from "./admin.validation.js";

interface GetAdminStatsResult {
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
}

export const getAdminStats = async (): Promise<GetAdminStatsResult> => {
  const [
    totalUsers,
    activeUsers,
    disabledUsers,
    verifiedUsers,
    unverifiedUsers,
    adminUsers,
    totalProfiles,
    totalResumes,
    totalApplications,
    activeApplications,
    deletedApplications,
    totalJobAnalyses,
    activeJobAnalyses,
    deletedJobAnalyses,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.user.count({
      where: {
        deletedAt: {
          not: null,
        },
      },
    }),

    prisma.user.count({
      where: {
        isEmailVerified: true,
      },
    }),

    prisma.user.count({
      where: {
        isEmailVerified: false,
      },
    }),

    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),

    prisma.profile.count(),

    prisma.resume.count(),

    prisma.application.count(),

    prisma.application.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.application.count({
      where: {
        deletedAt: {
          not: null,
        },
      },
    }),

    prisma.jobAnalysis.count(),

    prisma.jobAnalysis.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.jobAnalysis.count({
      where: {
        deletedAt: {
          not: null,
        },
      },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      disabled: disabledUsers,
      verified: verifiedUsers,
      unverified: unverifiedUsers,
      admins: adminUsers,
    },

    profiles: {
      total: totalProfiles,
    },

    resumes: {
      total: totalResumes,
    },

    applications: {
      total: totalApplications,
      active: activeApplications,
      deleted: deletedApplications,
    },

    jobAnalyses: {
      total: totalJobAnalyses,
      active: activeJobAnalyses,
      deleted: deletedJobAnalyses,
    },
  };
};

interface GetAdminUsersResult {
  users: {
    id: string;
    email: string;
    role: Role;
    isEmailVerified: boolean;
    emailVerifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getAdminUsers = async (
  query: GetAdminUsersQuery,
): Promise<GetAdminUsersResult> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  if (query.keyword) {
    where.email = {
      contains: query.keyword,
      mode: "insensitive",
    };
  }

  if (query.role) {
    where.role = query.role;
  }

  if (query.verified !== undefined) {
    where.isEmailVerified = query.verified;
  }

  if (query.status === "ACTIVE") {
    where.deletedAt = null;
  }

  if (query.status === "DISABLED") {
    where.deletedAt = {
      not: null,
    };
  }

  const orderBy: Prisma.UserOrderByWithRelationInput =
    query.sort === "oldest"
      ? { createdAt: "asc" }
      : query.sort === "email_asc"
        ? { email: "asc" }
        : query.sort === "email_desc"
          ? { email: "desc" }
          : query.sort === "role_asc"
            ? { role: "asc" }
            : query.sort === "role_desc"
              ? { role: "desc" }
              : { createdAt: "desc" };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    }),

    prisma.user.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    users,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getAdminUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isEmailVerified: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,

      profile: {
        select: {
          id: true,
          avatarUrl: true,
          experienceLevel: true,
          workEligibility: true,
          location: true,
          targetRole: true,
          desiredRoles: true,
          careerGoals: true,
          preferredJobType: true,
          remotePreference: true,
          createdAt: true,
          updatedAt: true,
        },
      },

      resume: {
        select: {
          id: true,
          originalName: true,
          fileUrl: true,
          mimeType: true,
          size: true,
          createdAt: true,
          updatedAt: true,
        },
      },

      _count: {
        select: {
          applications: true,
          jobAnalyses: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const activeSessionCount = await prisma.refreshToken.count({
    where: {
      userId,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  return {
    user: {
      ...user,
      hasProfile: user.profile !== null,
      hasResume: user.resume !== null,
      counts: {
        applications: user._count.applications,
        jobAnalyses: user._count.jobAnalyses,
        activeSessions: activeSessionCount,
      },
    },
  };
};

export const updateAdminUserRole = async (
  currentAdminId: string,
  targetUserId: string,
  input: UpdateAdminUserRoleInput,
) => {
  if (currentAdminId === targetUserId) {
    throw new AppError("You cannot change your own role", 400);
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: targetUserId,
    },
    select: {
      id: true,
    },
  });

  if (!targetUser) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: targetUserId,
    },
    data: {
      role: input.role,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isEmailVerified: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
  });

  return {
    user: updatedUser,
  };
};

export const updateAdminUserStatus = async (
  currentAdminId: string,
  targetUserId: string,
  input: UpdateAdminUserStatusInput,
) => {
  if (currentAdminId === targetUserId) {
    throw new AppError("You cannot change your own status", 400);
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: targetUserId,
    },
    select: {
      id: true,
    },
  });

  if (!targetUser) {
    throw new AppError("User not found", 404);
  }

  const deletedAt = input.status === "ACTIVE" ? null : new Date();

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: {
        id: targetUserId,
      },
      data: {
        deletedAt,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    }),

    ...(input.status === "DISABLED"
      ? [
          prisma.refreshToken.updateMany({
            where: {
              userId: targetUserId,
              revokedAt: null,
            },
            data: {
              revokedAt: new Date(),
            },
          }),
        ]
      : []),
  ]);

  return {
    user: updatedUser,
  };
};
