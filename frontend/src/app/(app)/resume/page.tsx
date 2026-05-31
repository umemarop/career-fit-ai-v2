import { CurrentResumeCard } from "@/features/resume/components/CurrentResumeCard";
import { ResumeActions } from "@/features/resume/components/ResumeActions";
import { ResumeHeader } from "@/features/resume/components/ResumeHeader";
import { ResumeUploadSection } from "@/features/resume/components/ResumeUploadSection";

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ResumeHeader />
      <ResumeUploadSection />
      <CurrentResumeCard />
      <ResumeActions />
    </div>
  );
}
