type DeleteProfileModalProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteProfileModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-950">Delete Profile</h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Are you sure you want to delete your profile? This will remove your
          skills, career goals, target roles, preferences, and profile photo.
          Your account and resume will not be deleted.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
