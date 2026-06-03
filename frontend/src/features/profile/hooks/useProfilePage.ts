"use client";

import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";

import {
  DEFAULT_PROFILE_FORM_STATE,
  formStateToUpsertProfileInput,
  profileToFormState,
  type ProfileFormState,
} from "@/features/profile/profile-form.utils";
import {
  autofillProfileFromSavedResume,
  autofillProfileFromUploadedResume,
  deleteProfile,
  deleteProfileAvatar,
  getMyProfile,
  uploadProfileAvatar,
  upsertProfile,
} from "@/services/profile.service";
import type { Profile } from "@/types/profile.types";
import { normalizeApiError } from "@/utils/api-error";
import { getPublicFileUrl } from "@/utils/file-url";

export function useProfilePage() {
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

  const avatarUrl = profile?.avatarUrl
    ? getPublicFileUrl(profile.avatarUrl)
    : null;

  const showMessage = (message: string) => {
    setMessage(message);

    window.setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  async function loadProfile() {
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
  }

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

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    formState,
    avatarUrl,
    avatarInputRef,
    resumeInputRef,

    isInitialLoading,
    isSaving,
    isAutofilling,
    isAvatarUploading,
    isAvatarDeleting,
    isEditing,
    isDeleteProfileModalOpen,
    isDeletingProfile,

    message,
    errorMessage,
    shouldShowForm,
    skillsErrorMessage,

    updateFormField,
    handleSaveProfile,
    handleEditProfile,
    handleCancelEdit,
    handleOpenDeleteProfileModal,
    handleCloseDeleteProfileModal,
    handleDeleteProfile,
    handleAutofillFromSavedResume,
    handleUploadResumeAutofillClick,
    handleResumeAutofillUpload,
    handleUploadAvatarClick,
    handleAvatarFileChange,
    handleDeleteAvatar,
  };
}
