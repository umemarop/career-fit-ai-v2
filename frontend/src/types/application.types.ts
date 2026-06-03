export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

export type ApplicationSort =
  | "latest"
  | "oldest"
  | "appliedAt_desc"
  | "appliedAt_asc"
  | "jobTitle_asc"
  | "companyName_asc";

export type Application = {
  id: string;
  userId?: string;
  jobAnalysisId?: string | null;

  jobTitle: string;
  companyName: string | null;
  location: string | null;
  jobUrl: string | null;

  status: ApplicationStatus;

  notes: string | null;
  nextStep: string | null;
  appliedAt: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type ApplicationListItem = {
  id: string;
  jobAnalysisId?: string | null;

  jobTitle: string;
  companyName: string | null;
  location: string | null;
  jobUrl: string | null;

  status: ApplicationStatus;
  nextStep: string | null;
  appliedAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CreateApplicationInput = {
  jobAnalysisId?: string;

  jobTitle?: string;
  companyName?: string;
  location?: string;
  jobUrl?: string;

  status?: ApplicationStatus;

  notes?: string;
  nextStep?: string;
  appliedAt?: string;
};

export type UpdateApplicationInput = {
  jobTitle?: string;
  companyName?: string | null;
  location?: string | null;
  jobUrl?: string | null;

  notes?: string | null;
  nextStep?: string | null;
  appliedAt?: string | null;
};

export type UpdateApplicationStatusInput = {
  status: ApplicationStatus;
};

export type GetApplicationsParams = {
  status?: ApplicationStatus;
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: ApplicationSort;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};

export type GetApplicationsResponse = {
  data: ApplicationListItem[];
  meta: PaginationMeta;
};

export type GetApplicationResponse = {
  data: Application;
};

export type CreateApplicationResponse = {
  data: Application;
};

export type UpdateApplicationResponse = {
  data: Application;
};

export type ApplicationFormMode = "create" | "edit";

export type ApplicationFormInitialData = {
  id?: string;
  jobAnalysisId?: string | null;

  jobTitle?: string;
  companyName?: string | null;
  location?: string | null;
  jobUrl?: string | null;

  status?: ApplicationStatus;
  appliedAt?: string | null;
  nextStep?: string | null;
  notes?: string | null;
};
