export function BasicInformationSection() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Basic information
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Tell us about your current career stage and work eligibility.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Experience level
          </label>
          <select className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            <option>Entry</option>
            <option>Junior</option>
            <option>Mid</option>
            <option>Senior</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Work eligibility
          </label>
          <select className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            <option>Full work rights</option>
            <option>Limited work rights</option>
            <option>Needs sponsorship</option>
            <option>Not sure</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Location</label>
          <input
            type="text"
            placeholder="Brisbane, Australia"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>
    </div>
  );
}
