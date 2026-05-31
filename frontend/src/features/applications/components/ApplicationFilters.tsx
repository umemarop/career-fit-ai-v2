import { Search } from "lucide-react";

export function ApplicationFilters() {
  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_220px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by role, company, or location"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
          />
        </label>

        <select className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50">
          <option>All Statuses</option>
          <option>Saved</option>
          <option>Applied</option>
          <option>Interviewing</option>
          <option>Offer</option>
          <option>Rejected</option>
          <option>Withdrawn</option>
        </select>

        <select className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50">
          <option>Latest</option>
          <option>Oldest</option>
          <option>Applied date: newest</option>
          <option>Applied date: oldest</option>
          <option>Job title A-Z</option>
          <option>Company A-Z</option>
        </select>
      </div>
    </section>
  );
}
