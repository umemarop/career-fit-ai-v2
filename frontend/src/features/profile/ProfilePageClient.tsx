"use client";

import { AvatarSection } from "@/features/profile/components/AvatarSection";
import { BasicInformationSection } from "@/features/profile/components/BasicInformationSection";
import { CareerGoalsSection } from "@/features/profile/components/CareerGoalsSection";
import { CareerPreferencesSection } from "@/features/profile/components/CareerPreferencesSection";
import { DeleteProfileModal } from "@/features/profile/components/DeleteProfileModal";
import { ProfileActions } from "@/features/profile/components/ProfileActions";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileSummary } from "@/features/profile/components/ProfileSummary";
import { SkillsSection } from "@/features/profile/components/SkillsSection";
import { useProfilePage } from "@/features/profile/hooks/useProfilePage";

export function ProfilePageClient() {
  const {
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
  } = useProfilePage();

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
      <DeleteProfileModal
        isOpen={isDeleteProfileModalOpen}
        isDeleting={isDeletingProfile}
        onClose={handleCloseDeleteProfileModal}
        onConfirm={handleDeleteProfile}
      />

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

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

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
      ) : profile ? (
        <ProfileSummary
          profile={profile}
          onEdit={handleEditProfile}
          onDelete={handleOpenDeleteProfileModal}
        />
      ) : null}
    </div>
  );
}
