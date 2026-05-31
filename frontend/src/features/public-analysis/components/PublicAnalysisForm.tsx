type PublicAnalysisFormProps = {
  jobDescription: string;
  isLoading: boolean;
  onJobDescriptionChange: (value: string) => void;
  onSubmit: () => void;
};

const MIN_JOB_DESCRIPTION_LENGTH = 50;
const MAX_JOB_DESCRIPTION_LENGTH = 10000;

export function PublicAnalysisForm({
  jobDescription,
  isLoading,
  onJobDescriptionChange,
  onSubmit,
}: PublicAnalysisFormProps) {
  const characterCount = jobDescription.trim().length;
  const isTooShort =
    characterCount > 0 && characterCount < MIN_JOB_DESCRIPTION_LENGTH;
  const isDisabled =
    isLoading ||
    characterCount < MIN_JOB_DESCRIPTION_LENGTH ||
    characterCount > MAX_JOB_DESCRIPTION_LENGTH;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-indigo-600">
          Try it without signing up
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Analyze a job description
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Paste a job description and preview how CareerFit AI extracts role
          details, skills, responsibilities, preparation tips, and warnings.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="public-job-description"
          className="text-sm font-medium text-slate-700"
        >
          Job description
        </label>

        <textarea
          id="public-job-description"
          value={jobDescription}
          onChange={(event) => onJobDescriptionChange(event.target.value)}
          placeholder="Paste a job description here. For example, include responsibilities, required skills, preferred qualifications, and company details."
          className="mt-2 min-h-80 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
          maxLength={MAX_JOB_DESCRIPTION_LENGTH}
        />

        <div className="mt-2 flex items-center justify-between gap-4 text-xs">
          <p className={isTooShort ? "text-amber-600" : "text-slate-500"}>
            Minimum {MIN_JOB_DESCRIPTION_LENGTH} characters required.
          </p>

          <p className="text-slate-500">
            {characterCount}/{MAX_JOB_DESCRIPTION_LENGTH}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isDisabled}
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isLoading ? "Analyzing..." : "Analyze job"}
      </button>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        Guest analysis gives a quick role breakdown. Sign up to unlock
        personalized fit scores, recommendations, and saved history.
      </p>
    </div>
  );
}
