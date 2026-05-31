export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

export type Application = {
  id: string;
  jobAnalysisId?: string | null;

  jobTitle: string;
  companyName?: string | null;
  location?: string | null;
  jobUrl?: string | null;

  status: ApplicationStatus;

  notes?: string | null;
  nextStep?: string | null;
  appliedAt?: string | null;

  createdAt: string;
  updatedAt: string;
};
