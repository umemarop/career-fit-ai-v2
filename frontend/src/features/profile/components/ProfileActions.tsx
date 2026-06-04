import { Loader2, Save, X } from "lucide-react";

import { VerifiedActionButton } from "@/components/common/VerifiedActionButton";

type ProfileActionsProps = {
  isSaving: boolean;
  showCancel?: boolean;
  onSave: () => void;
  onCancel?: () => void;
};

export function ProfileActions({
  isSaving,
  showCancel = false,
  onSave,
  onCancel,
}: ProfileActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      {showCancel && (
        <button
          type="button"
          disabled={isSaving}
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      )}

      <VerifiedActionButton
        type="button"
        disabled={isSaving}
        onClick={onSave}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isSaving ? "Saving..." : "Save changes"}
      </VerifiedActionButton>
    </div>
  );
}
