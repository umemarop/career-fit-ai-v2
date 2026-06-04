"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

type DeleteAccountModalProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteAccountModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) {
    return null;
  }

  const canConfirm = confirmText === "DELETE" && !isDeleting;

  const handleConfirm = async () => {
    if (!canConfirm) return;

    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <TriangleAlert className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-950">
              Are you sure you want to delete your account?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              This action will immediately disable your account and revoke all
              active sessions.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          Your profile, resume, analyses, and applications will be kept during
          the retention period, then permanently deleted by cleanup.
        </div>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Type <span className="font-semibold text-red-700">DELETE</span> to
          confirm.
        </label>

        <input
          value={confirmText}
          onChange={(event) => setConfirmText(event.target.value)}
          disabled={isDeleting}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
          placeholder="DELETE"
        />

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
