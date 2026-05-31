import { AvatarSection } from "@/features/profile/components/AvatarSection";
import { BasicInformationSection } from "@/features/profile/components/BasicInformationSection";
import { CareerGoalsSection } from "@/features/profile/components/CareerGoalsSection";
import { CareerPreferencesSection } from "@/features/profile/components/CareerPreferencesSection";
import { ProfileActions } from "@/features/profile/components/ProfileActions";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { SkillsSection } from "@/features/profile/components/SkillsSection";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ProfileHeader />
      <AvatarSection />

      <section className="grid gap-6 lg:grid-cols-2">
        <BasicInformationSection />
        <CareerPreferencesSection />
      </section>

      <SkillsSection />
      <CareerGoalsSection />
      <ProfileActions />
    </div>
  );
}
