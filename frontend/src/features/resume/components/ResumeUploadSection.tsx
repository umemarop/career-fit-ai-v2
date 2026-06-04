import { useRef, useState } from "react";
import { FileUp } from "lucide-react";

import { VerifiedActionButton } from "@/components/common/VerifiedActionButton";

type ResumeUploadSectionProps = {
  onSelectFile: (file: File) => void;
  isUploading: boolean;
};

export function ResumeUploadSection({
  onSelectFile,
  isUploading,
}: ResumeUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleBrowseClick() {
    fileInputRef.current?.click();
  }

  function handleSelectedFile(file: File) {
    if (file.type !== "application/pdf") {
      return;
    }

    onSelectFile(file);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    handleSelectedFile(file);

    event.target.value = "";
  }

  function handleDragOver(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    handleSelectedFile(file);
  }

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-2xl border border-dashed p-8 shadow-sm transition ${
        isDragging
          ? "border-indigo-400 bg-indigo-50"
          : "border-slate-300 bg-white"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        hidden
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
          <FileUp className="h-7 w-7 text-indigo-600" />
        </div>

        <h2 className="mt-4 text-base font-semibold text-slate-950">
          Upload your resume
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Drag and drop your PDF resume here, or browse your files to upload the
          latest version.
        </p>

        <VerifiedActionButton
          type="button"
          onClick={handleBrowseClick}
          disabled={isUploading}
          className="mt-6"
        >
          {isUploading ? "Saving..." : "Browse file"}
        </VerifiedActionButton>

        <p className="mt-3 text-xs text-slate-400">
          PDF only. Recommended file size under 5MB.
        </p>
      </div>
    </section>
  );
}
