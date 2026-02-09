import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://www.will-you-be-my-valentinee.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Fetch all public profiles for dynamic routes
  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, created_at")
    .order("created_at", { ascending: false });

  const userPages: MetadataRoute.Sitemap = (profiles ?? []).map((profile) => ({
    url: `${SITE_URL}/${profile.username}`,
    lastModified: new Date(profile.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const wallPages: MetadataRoute.Sitemap = (profiles ?? []).map((profile) => ({
    url: `${SITE_URL}/${profile.username}/wall`,
    lastModified: new Date(profile.created_at),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...userPages,
    ...wallPages,
  ];
}
