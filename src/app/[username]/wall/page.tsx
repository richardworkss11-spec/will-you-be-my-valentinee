import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileByUsername, getWallValentines } from "@/lib/queries";
import PublicWall from "@/components/pages/PublicWall";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return { title: "Not Found" };
  }

  return {
    title: `${profile.display_name}'s Wall of Love`,
    description: `See all the valentines people have sent to ${profile.display_name}!`,
    openGraph: {
      title: `${profile.display_name}'s Wall of Love`,
      description: `See all the valentines people have sent to ${profile.display_name}!`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.display_name}'s Wall of Love`,
      description: `See all the valentines people have sent to ${profile.display_name}!`,
    },
  };
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
