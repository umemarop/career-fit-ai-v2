export type ExperienceLevel = "ENTRY" | "JUNIOR" | "MID" | "SENIOR";

export type WorkEligibility =
  | "FULL_WORK_RIGHTS"
  | "LIMITED_WORK_RIGHTS"
  | "NEEDS_SPONSORSHIP"
  | "NOT_SURE";

export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE";

export type RemotePreference = "REMOTE" | "HYBRID" | "ONSITE" | "FLEXIBLE";

export type Profile = {
  id: string;
  userId: string;
  avatarUrl: string | null;

  skills: string[];
  experienceLevel: ExperienceLevel;
  workEligibility: WorkEligibility | null;
  location: string | null;
  targetRole: string | null;

  desiredRoles: string[];
  careerGoals: string | null;
  preferredJobType: JobType | null;
  remotePreference: RemotePreference | null;

  createdAt: string;
  updatedAt: string;
};

export type UpsertProfileInput = {
  skills: string[];
  experienceLevel: ExperienceLevel;
  workEligibility?: WorkEligibility;
  location?: string;
  targetRole?: string;
  desiredRoles: string[];
  careerGoals?: string;
  preferredJobType?: JobType;
  remotePreference?: RemotePreference;
};

export type ProfileDraft = {
  skills: string[];
  experienceLevel: ExperienceLevel;
  workEligibility?: WorkEligibility;
  location?: string;
  targetRole?: string;
  desiredRoles: string[];
  careerGoals?: string;
  preferredJobType?: JobType;
  remotePreference?: RemotePreference;
};

export type GetProfileResponse = {
  status: "success";
  data: {
    profile: Profile;
  };
};

export type UpsertProfileResponse = {
  status: "success";
  data: {
    profile: Profile;
  };
};

export type UpdateAvatarResponse = {
  status: "success";
  data: {
    profile: Profile;
  };
};

export type DeleteAvatarResponse = {
  status: "success";
  data: {
    profile: Profile;
  };
};

export type AutofillProfileResponse = {
  status: "success";
  data: {
    profileDraft: ProfileDraft;
  };
};
