import { notFound } from "next/navigation";
import { getProfileByUsername, getWallValentines } from "@/lib/queries";
import PublicWall from "@/components/pages/PublicWall";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function WallPage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const valentines = await getWallValentines(profile.id);

  return <PublicWall profile={profile} valentines={valentines} />;
}
