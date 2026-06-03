type GoToApplicationModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function GoToApplicationModal({
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: GoToApplicationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-sm font-medium text-indigo-600">
          Application created
        </p>

        <h2 className="mt-2 text-xl font-semibold text-slate-950">
          View this application now?
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          The application has been created successfully. Would you like to go to
          the Applications page and review it now?
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Stay here
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            View application
          </button>
        </div>
      </div>
    </div>
  );
}
