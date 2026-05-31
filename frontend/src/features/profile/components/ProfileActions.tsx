import { Save } from "lucide-react";

export function ProfileActions() {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        <Save className="h-4 w-4" />
        Save changes
      </button>
    </div>
  );
}
