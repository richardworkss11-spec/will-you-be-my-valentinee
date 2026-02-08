import type { Metadata } from "next";
import { getProfileByUsername } from "@/lib/queries";

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
    };
  }

  return {
    title: `Will you be ${profile.display_name}'s Valentine?`,
    description: `${profile.display_name} has a very important question for you... Will you be their Valentine?`,
    openGraph: {
      title: `Will you be ${profile.display_name}'s Valentine?`,
      description: `${profile.display_name} has a very important question for you...`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Will you be ${profile.display_name}'s Valentine?`,
      description: `${profile.display_name} has a very important question for you...`,
    },
  };
}

export default async function UsernameLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
