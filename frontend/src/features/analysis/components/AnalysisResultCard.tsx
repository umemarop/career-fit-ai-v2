import { Building2, MapPin } from "lucide-react";

type AnalysisResultCardProps = {
  jobTitle: string;
  companyName: string | null;
  location: string | null;
};

export function AnalysisResultCard({
  jobTitle,
  companyName,
  location,
}: AnalysisResultCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Detected Role</p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
        {jobTitle}
      </h2>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-400" />
          {companyName ?? "Company not detected"}
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          {location ?? "Location not detected"}
        </div>
      </div>
    </section>
  );
}
