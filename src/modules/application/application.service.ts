import { prisma } from "../../prisma/client.js";
import { AppError } from "../../utils/appError.js";
import type {
  CreateApplicationInput,
  GetMyApplicationsQuery,
  UpdateApplicationInput,
  UpdateApplicationStatusInput,
} from "./application.validation.js";
import { removeUndefined } from "../../utils/removeUndefined.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const createApplication = async (
  userId: string,
  input: CreateApplicationInput,
) => {
  if (input.jobAnalysisId) {
    const jobAnalysis = await prisma.jobAnalysis.findFirst({
      where: {
        id: input.jobAnalysisId,
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        location: true,
      },
    });
    if (!jobAnalysis) {
      throw new AppError("Job analysis not found", 404);
    }
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobAnalysisId: jobAnalysis.id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });
    if (existingApplication) {
      throw new AppError(
        "Application already exists for this job analysis",
        409,
      );
    }
    const application = await prisma.application.create({
      data: {
        userId,
        jobAnalysisId: jobAnalysis.id,
        jobTitle: jobAnalysis.jobTitle,
        companyName: jobAnalysis.companyName,
        location: jobAnalysis.location,
        jobUrl: input.jobUrl ?? null,
        status: input.status ?? "SAVED",
        notes: input.notes ?? null,
        nextStep: input.nextStep ?? null,
        appliedAt: input.appliedAt ?? null,
      },
    });
    return application;
  }
  const application = await prisma.application.create({
    data: {
      userId,
      jobAnalysisId: null,
      jobTitle: input.jobTitle!,
      companyName: input.companyName ?? null,
      location: input.location ?? null,
      jobUrl: input.jobUrl ?? null,
      status: input.status ?? "SAVED",
      notes: input.notes ?? null,
      nextStep: input.nextStep ?? null,
      appliedAt: input.appliedAt ?? null,
    },
  });
  return application;
};

interface GetmyApplicationsResult {
  applications: {
    id: string;
    jobTitle: string;
    companyName: string | null;
    location: string | null;
    jobUrl: string | null;
    status: string;
    appliedAt: Date | null;
    nextStep: string | null;
    createdAt: Date;
    updatedAt: Date;
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

export const getMyApplications = async (
  userId: string,
  query: GetMyApplicationsQuery,
): Promise<GetmyApplicationsResult> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: Prisma.ApplicationWhereInput = {
    userId,
    deletedAt: null,
  };

  if (query.status) {
    where.status = query.status;
  }

  if (query.keyword) {
    where.OR = [
      {
        jobTitle: {
          contains: query.keyword,
          mode: "insensitive",
        },
      },
      {
        companyName: {
          contains: query.keyword,
          mode: "insensitive",
        },
      },
      {
        location: {
          contains: query.keyword,
          mode: "insensitive",
        },
      },
    ];
  }

  const orderBy: Prisma.ApplicationOrderByWithRelationInput =
    query.sort === "oldest"
      ? { createdAt: "asc" }
      : query.sort === "appliedAt_desc"
        ? { appliedAt: "desc" }
        : query.sort === "appliedAt_asc"
          ? { appliedAt: "asc" }
          : query.sort === "jobTitle_asc"
            ? { jobTitle: "asc" }
            : query.sort === "companyName_asc"
              ? { companyName: "asc" }
              : { createdAt: "desc" };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        location: true,
        jobUrl: true,
        status: true,
        appliedAt: true,
        nextStep: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.application.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    applications,
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

export const getApplicationById = async (
  userId: string,
  applicationId: string,
) => {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      jobAnalysisId: true,
      jobTitle: true,
      companyName: true,
      location: true,
      jobUrl: true,
      status: true,
      notes: true,
      nextStep: true,
      appliedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }
  return application;
};

export const updateApplication = async (
  userId: string,
  applicationId: string,
  input: UpdateApplicationInput,
) => {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
      deletedAt: null,
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const updateData = removeUndefined({
    jobTitle: input.jobTitle,
    companyName: input.companyName,
    location: input.location,
    jobUrl: input.jobUrl,
    notes: input.notes,
    nextStep: input.nextStep,
    appliedAt: input.appliedAt,
  }) as Prisma.ApplicationUpdateInput;

  const updatedApplication = await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: updateData,
  });

  return updatedApplication;
};

export const updateApplicationStatus = async (
  userId: string,
  applicationId: string,
  input: UpdateApplicationStatusInput,
) => {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
      deletedAt: null,
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const updatedApplication = await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: input.status,
    },
  });
  return updatedApplication;
};

export const deleteApplication = async (
  userId: string,
  applicationId: string,
) => {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
      deletedAt: null,
    },
  });
  if (!application) {
    throw new AppError("Application not found", 404);
  }

  await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
