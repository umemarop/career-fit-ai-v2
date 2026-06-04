import { VerifiedActionButton } from "@/components/common/VerifiedActionButton";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

type AnalysisFormProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function AnalysisForm({
  value,
  isLoading,
  onChange,
  onSubmit,
}: AnalysisFormProps) {
  const isInvalid = value.trim().length < 50;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">
          Job description
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Paste the full job description. The AI will extract the role details
          and compare them with your profile.
        </p>
      </div>

      <Textarea
        placeholder="Paste the job description here..."
        className="min-h-64 resize-none"
        value={value}
        maxLength={10000}
        onChange={(event) => onChange(event.target.value)}
      />

      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
        <p className="text-slate-500">Minimum 50 characters required.</p>
        <p className={isInvalid ? "text-slate-400" : "text-slate-500"}>
          {value.trim().length}/10000
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <VerifiedActionButton
          type="button"
          className="gap-2"
          onClick={onSubmit}
          disabled={isInvalid || isLoading}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? "Analyzing..." : "Analyze job"}
        </VerifiedActionButton>
      </div>
    </section>
  );
}
