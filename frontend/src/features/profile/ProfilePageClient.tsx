"use client";
import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";

import {
  DEFAULT_PROFILE_FORM_STATE,
  formStateToUpsertProfileInput,
  profileToFormState,
  type ProfileFormState,
} from "@/features/profile/profile-form.utils";

import { AvatarSection } from "@/features/profile/components/AvatarSection";
import { BasicInformationSection } from "@/features/profile/components/BasicInformationSection";
import { CareerGoalsSection } from "@/features/profile/components/CareerGoalsSection";
import { CareerPreferencesSection } from "@/features/profile/components/CareerPreferencesSection";
import { ProfileActions } from "@/features/profile/components/ProfileActions";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { SkillsSection } from "@/features/profile/components/SkillsSection";
import { ProfileSummary } from "@/features/profile/components/ProfileSummary";
import { getPublicFileUrl } from "@/utils/file-url";

import {
  autofillProfileFromSavedResume,
  autofillProfileFromUploadedResume,
  deleteProfile,
  deleteProfileAvatar,
  getMyProfile,
  uploadProfileAvatar,
  upsertProfile,
} from "@/services/profile.service";
import { normalizeApiError } from "@/utils/api-error";
import type { Profile } from "@/types/profile.types";

export function ProfilePageClient() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [formState, setFormState] = useState<ProfileFormState>(
    DEFAULT_PROFILE_FORM_STATE,
  );

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isAvatarDeleting, setIsAvatarDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] =
    useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shouldShowForm = !profile || isEditing;
  const skillsErrorMessage =
    hasTriedSubmit && formState.skillsText.trim().length === 0
      ? "Please add at least one skill."
      : undefined;

  const showMessage = (message: string) => {
    setMessage(message);

    setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  const avatarUrl = profile?.avatarUrl
    ? getPublicFileUrl(profile.avatarUrl)
    : null;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsInitialLoading(true);
        setErrorMessage(null);

        const profile = await getMyProfile();

        setProfile(profile);
        setFormState(profileToFormState(profile));
        setIsEditing(false);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setProfile(null);
          setFormState(DEFAULT_PROFILE_FORM_STATE);
          return;
        }

        const normalizedError = normalizeApiError(error);
        setErrorMessage(normalizedError.message);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateFormField = <K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K],
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setHasTriedSubmit(true);
      setMessage(null);
      setErrorMessage(null);

      const input = formStateToUpsertProfileInput(formState);

      if (input.skills.length === 0) {
        return;
      }

      const savedProfile = await upsertProfile(input);

      setProfile(savedProfile);
      setFormState(profileToFormState(savedProfile));
      setIsEditing(false);
      showMessage("Profile saved successfully.");
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(normalizedError.message);
    } finally {
      setIsSaving(false);
    }
  };
  const handleEditProfile = () => {
    if (!profile) return;

    setFormState(profileToFormState(profile));
    setIsEditing(true);
    setMessage(null);
    setErrorMessage(null);
  };

  const handleCancelEdit = () => {
    if (!profile) return;

    setFormState(profileToFormState(profile));
    setIsEditing(false);
    setHasTriedSubmit(false);
    setMessage(null);
    setErrorMessage(null);
  };

  const handleOpenDeleteProfileModal = () => {
    setIsDeleteProfileModalOpen(true);
  };

  const handleCloseDeleteProfileModal = () => {
    if (isDeletingProfile) return;

    setIsDeleteProfileModalOpen(false);
  };

  const handleDeleteProfile = async () => {
    try {
      setIsDeletingProfile(true);
      setMessage(null);
      setErrorMessage(null);

      await deleteProfile();

      setProfile(null);
      setFormState(DEFAULT_PROFILE_FORM_STATE);
      setIsEditing(false);
      setHasTriedSubmit(false);
      setIsDeleteProfileModalOpen(false);

      showMessage("Profile deleted successfully.");
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(normalizedError.message);
    } finally {
      setIsDeletingProfile(false);
    }
  };
  const applyProfileDraft = (
    draft: Awaited<ReturnType<typeof autofillProfileFromSavedResume>>,
  ) => {
    setFormState({
      skillsText: draft.skills.join(", "),
      experienceLevel: draft.experienceLevel,
      workEligibility: draft.workEligibility ?? "",
      location: draft.location ?? "",
      targetRole: draft.targetRole ?? "",
      desiredRolesText: draft.desiredRoles.join(", "),
      careerGoals: draft.careerGoals ?? "",
      preferredJobType: draft.preferredJobType ?? "",
      remotePreference: draft.remotePreference ?? "",
    });

    setIsEditing(true);

    setMessage(
      "Profile draft generated. Review the information before saving.",
    );

    setErrorMessage(null);
  };

  const handleAutofillFromSavedResume = async () => {
    try {
      setIsAutofilling(true);
      setMessage(null);
      setErrorMessage(null);

      const profileDraft = await autofillProfileFromSavedResume();

      applyProfileDraft(profileDraft);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(normalizedError.message);
    } finally {
      setIsAutofilling(false);
    }
  };

  const handleUploadResumeAutofillClick = () => {
    resumeInputRef.current?.click();
  };
  const handleResumeAutofillUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsAutofilling(true);
      setMessage(null);
      setErrorMessage(null);

      const profileDraft = await autofillProfileFromUploadedResume(file);

      applyProfileDraft(profileDraft);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(normalizedError.message);
    } finally {
      setIsAutofilling(false);
      event.target.value = "";
    }
  };

  const handleUploadAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsAvatarUploading(true);
      setMessage(null);
      setErrorMessage(null);

      const updatedProfile = await uploadProfileAvatar(file);

      setProfile(updatedProfile);
      showMessage("Profile photo updated successfully.");
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(normalizedError.message);
    } finally {
      setIsAvatarUploading(false);
      event.target.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setIsAvatarDeleting(true);
      setMessage(null);
      setErrorMessage(null);

      const updatedProfile = await deleteProfileAvatar();

      setProfile(updatedProfile);
      showMessage("Profile photo removed successfully.");
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(normalizedError.message);
    } finally {
      setIsAvatarDeleting(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      {isDeleteProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-950">
              Delete Profile
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to delete your profile? This will remove
              your skills, career goals, target roles, preferences, and profile
              photo. Your account and resume will not be deleted.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeletingProfile}
                onClick={handleCloseDeleteProfileModal}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeletingProfile}
                onClick={handleDeleteProfile}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingProfile ? "Deleting..." : "Delete Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFileChange}
      />
      <input
        ref={resumeInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleResumeAutofillUpload}
      />
      <ProfileHeader
        isAutofilling={isAutofilling}
        onAutofillFromSavedResume={handleAutofillFromSavedResume}
        onUploadResumeAutofillClick={handleUploadResumeAutofillClick}
      />

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {!profile && !isEditing && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-700">
          Create your profile manually or use resume autofill to get started.
        </div>
      )}

      <AvatarSection
        avatarUrl={avatarUrl}
        canManageAvatar={Boolean(profile)}
        isUploading={isAvatarUploading}
        isDeleting={isAvatarDeleting}
        onUploadClick={handleUploadAvatarClick}
        onDeleteClick={handleDeleteAvatar}
      />

      {shouldShowForm ? (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <BasicInformationSection
              formState={formState}
              onChange={updateFormField}
            />

            <CareerPreferencesSection
              formState={formState}
              onChange={updateFormField}
            />
          </div>

          <SkillsSection
            formState={formState}
            onChange={updateFormField}
            errorMessage={skillsErrorMessage}
          />

          <CareerGoalsSection
            formState={formState}
            onChange={updateFormField}
          />

          <ProfileActions
            isSaving={isSaving}
            showCancel={Boolean(profile)}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        </>
      ) : (
        <ProfileSummary
          profile={profile}
          onEdit={handleEditProfile}
          onDelete={handleOpenDeleteProfileModal}
        />
      )}
    </div>
  );
}
