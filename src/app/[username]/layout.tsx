import type { Metadata } from "next";
import { getProfileByUsername } from "@/lib/queries";

const SITE_URL = "https://www.will-you-be-my-valentinee.com";

interface LayoutProps {
  children: React.ReactNode;
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

  const title = `Will you be ${profile.display_name}'s Valentine?`;
  const description = `${profile.display_name} has a very important question for you... Will you be their Valentine? Send a heartfelt valentine message, share a photo, dedicate a song, and make their day special.`;
  const url = `${SITE_URL}/${profile.username}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${profile.username}`,
    },
    openGraph: {
      title,
      description,
      url,
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

export default async function UsernameLayout({ children, params }: LayoutProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return <>{children}</>;
  }

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
      {children}
    </>
  );
}
