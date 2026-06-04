import { Loader2, Upload, WandSparkles } from "lucide-react";

import { VerifiedActionButton } from "@/components/common/VerifiedActionButton";

type ProfileHeaderProps = {
  isAutofilling: boolean;
  onAutofillFromSavedResume: () => void;
  onUploadResumeAutofillClick: () => void;
};

export function ProfileHeader({
  isAutofilling,
  onAutofillFromSavedResume,
  onUploadResumeAutofillClick,
}: ProfileHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-indigo-600">Profile</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Manage your career profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Keep your profile up to date so CareerFit AI can provide better job
          analysis, recommendations, and application insights.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <VerifiedActionButton
          type="button"
          disabled={isAutofilling}
          onClick={onAutofillFromSavedResume}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAutofilling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <WandSparkles className="h-4 w-4" />
          )}
          Autofill from saved resume
        </VerifiedActionButton>

        <VerifiedActionButton
          type="button"
          disabled={isAutofilling}
          onClick={onUploadResumeAutofillClick}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          Upload resume & autofill
        </VerifiedActionButton>
      </div>
    </section>
  );
}
