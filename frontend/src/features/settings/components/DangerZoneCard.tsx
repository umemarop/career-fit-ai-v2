"use client";

import { useState } from "react";
import { Trash2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeleteAccountModal } from "./DeleteAccountModal";

type DangerZoneCardProps = {
  isUpdating: boolean;
  onDeleteAccount: () => Promise<void>;
};

export function DangerZoneCard({
  isUpdating,
  onDeleteAccount,
}: DangerZoneCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <TriangleAlert className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950">Danger Zone</h2>
          <p className="mt-1 text-sm text-slate-500">
            Permanent account actions live here. Please proceed carefully.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-950">Delete account</p>
          <p className="mt-1 text-sm text-red-700">
            Your account will be disabled immediately and permanently removed
            after the retention period.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isUpdating}
          className="border-red-200 bg-white text-red-700 hover:bg-red-100 hover:text-red-800"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        isDeleting={isUpdating}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeleteAccount}
      />
    </section>
  );
}
