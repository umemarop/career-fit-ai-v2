import type {
  JobType,
  Profile,
  ProfileDraft,
  RemotePreference,
  UpsertProfileInput,
  WorkEligibility,
} from "@/types/profile.types";

export type ProfileFormState = {
  skillsText: string;
  experienceLevel: Profile["experienceLevel"];
  workEligibility: WorkEligibility | "";
  location: string;
  targetRole: string;
  desiredRolesText: string;
  careerGoals: string;
  preferredJobType: JobType | "";
  remotePreference: RemotePreference | "";
};

export const DEFAULT_PROFILE_FORM_STATE: ProfileFormState = {
  skillsText: "",
  experienceLevel: "ENTRY",
  workEligibility: "",
  location: "",
  targetRole: "",
  desiredRolesText: "",
  careerGoals: "",
  preferredJobType: "",
  remotePreference: "",
};

const joinCommaSeparated = (values: string[]): string => {
  return values.join(", ");
};

const splitCommaSeparated = (value: string): string[] => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const emptyToUndefined = (value: string): string | undefined => {
  const trimmed = value.trim();

  return trimmed ? trimmed : undefined;
};

export const profileToFormState = (profile: Profile): ProfileFormState => {
  return {
    skillsText: joinCommaSeparated(profile.skills),
    experienceLevel: profile.experienceLevel,
    workEligibility: profile.workEligibility ?? "",
    location: profile.location ?? "",
    targetRole: profile.targetRole ?? "",
    desiredRolesText: joinCommaSeparated(profile.desiredRoles),
    careerGoals: profile.careerGoals ?? "",
    preferredJobType: profile.preferredJobType ?? "",
    remotePreference: profile.remotePreference ?? "",
  };
};

export const draftToFormState = (draft: ProfileDraft): ProfileFormState => {
  return {
    skillsText: joinCommaSeparated(draft.skills),
    experienceLevel: draft.experienceLevel,
    workEligibility: draft.workEligibility ?? "",
    location: draft.location ?? "",
    targetRole: draft.targetRole ?? "",
    desiredRolesText: joinCommaSeparated(draft.desiredRoles),
    careerGoals: draft.careerGoals ?? "",
    preferredJobType: draft.preferredJobType ?? "",
    remotePreference: draft.remotePreference ?? "",
  };
};

export const formStateToUpsertProfileInput = (
  formState: ProfileFormState,
): UpsertProfileInput => {
  return {
    skills: splitCommaSeparated(formState.skillsText),
    experienceLevel: formState.experienceLevel,
    workEligibility: formState.workEligibility || undefined,
    location: emptyToUndefined(formState.location),
    targetRole: emptyToUndefined(formState.targetRole),
    desiredRoles: splitCommaSeparated(formState.desiredRolesText),
    careerGoals: emptyToUndefined(formState.careerGoals),
    preferredJobType: formState.preferredJobType || undefined,
    remotePreference: formState.remotePreference || undefined,
  };
};
