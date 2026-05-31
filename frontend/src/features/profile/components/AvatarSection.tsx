import { Camera, Trash2, User } from "lucide-react";

export function AvatarSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
            <User className="h-9 w-9 text-slate-400" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Profile photo
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload a professional avatar for your account.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Camera className="h-4 w-4" />
            Upload
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}
