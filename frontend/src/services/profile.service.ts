import { api } from "@/lib/api";
import type {
  AutofillProfileResponse,
  DeleteAvatarResponse,
  GetProfileResponse,
  Profile,
  UpdateAvatarResponse,
  UpsertProfileInput,
  UpsertProfileResponse,
} from "@/types/profile.types";

export async function getMyProfile(): Promise<Profile> {
  const response = await api.get<GetProfileResponse>("/profile/me");

  return response.data.data.profile;
}

export async function upsertProfile(
  input: UpsertProfileInput,
): Promise<Profile> {
  const response = await api.put<UpsertProfileResponse>("/profile", input);

  return response.data.data.profile;
}

export async function deleteProfile(): Promise<void> {
  await api.delete("/profile");
}

export async function uploadProfileAvatar(file: File): Promise<Profile> {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.patch<UpdateAvatarResponse>(
    "/profile/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data.profile;
}

export async function deleteProfileAvatar(): Promise<Profile> {
  const response = await api.delete<DeleteAvatarResponse>("/profile/avatar");

  return response.data.data.profile;
}

export async function autofillProfileFromSavedResume() {
  const response = await api.post<AutofillProfileResponse>(
    "/profile/autofill/resume",
  );

  return response.data.data.profileDraft;
}

export async function autofillProfileFromUploadedResume(file: File) {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post<AutofillProfileResponse>(
    "/profile/autofill/resume/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data.profileDraft;
}
