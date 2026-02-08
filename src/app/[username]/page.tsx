import { notFound } from "next/navigation";
import { getProfileByUsername } from "@/lib/queries";
import ValentineExperience from "@/components/pages/ValentineExperience";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  return (
    <ValentineExperience
      profileId={profile.id}
      profileName={profile.display_name}
      profileAvatar={profile.avatar_url}
      username={profile.username}
    />
  );
}
