import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

export function AnalysisForm() {
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
        defaultValue={`We are looking for a Junior Backend Developer with experience in Node.js, Express, PostgreSQL, REST APIs, authentication, and cloud deployment. The ideal candidate should be comfortable working in a startup environment and collaborating with frontend developers.`}
      />

      <div className="mt-4 flex justify-end">
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Analyze job
        </Button>
      </div>
    </section>
  );
}
