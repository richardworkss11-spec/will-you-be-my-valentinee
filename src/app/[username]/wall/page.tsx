import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileByUsername, getWallValentines } from "@/lib/queries";
import PublicWall from "@/components/pages/PublicWall";

const SITE_URL = "https://www.will-you-be-my-valentinee.com";

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
    return {
      title: "Not Found",
      robots: { index: false, follow: false },
    };
  }

  const valentines = await getWallValentines(profile.id);
  const count = valentines.length;
  const title = `${profile.display_name}'s Wall of Love`;
  const description =
    count > 0
      ? `See all ${count} heartfelt valentine${count !== 1 ? "s" : ""} people have sent to ${profile.display_name}! Send your own valentine message and make their day special.`
      : `Be the first to send ${profile.display_name} a heartfelt valentine message! Create a beautiful digital valentine and make their day special.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${profile.username}/wall`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${profile.username}/wall`,
      type: "website",
      siteName: "Will You Be My Valentine?",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${profile.display_name}'s Valentine Page`,
        item: `${SITE_URL}/${profile.username}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Wall of Love",
        item: `${SITE_URL}/${profile.username}/wall`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PublicWall profile={profile} valentines={valentines} />
    </>
  );
}
