import { Camera, Loader2, Trash2, User } from "lucide-react";

type AvatarSectionProps = {
  avatarUrl: string | null;
  canManageAvatar: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  onUploadClick: () => void;
  onDeleteClick: () => void;
};

export function AvatarSection({
  avatarUrl,
  canManageAvatar,
  isUploading,
  isDeleting,
  onUploadClick,
  onDeleteClick,
}: AvatarSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-9 w-9 text-slate-400" />
            )}
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Career profile photo
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload a professional photo for your career profile.
            </p>

            {!canManageAvatar && (
              <p className="mt-2 text-xs text-amber-600">
                Save your profile before uploading a photo.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={!canManageAvatar || isUploading}
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            Upload
          </button>

          <button
            type="button"
            disabled={!canManageAvatar || !avatarUrl || isDeleting}
            onClick={onDeleteClick}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}
