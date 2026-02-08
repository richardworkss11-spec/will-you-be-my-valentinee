import { createClient } from "@/lib/supabase/server";
import type { Profile, WallValentine, DashboardValentine } from "./types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfileByUsername(
  username: string
): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", username)
    .single();

  return data;
}

export async function getProfileByUserId(
  userId: string
): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data;
}

export async function getWallValentines(
  profileId: string
): Promise<WallValentine[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("valentines")
    .select(
      "id, wall_display_name, photo_url, photo_public, message, reason, date, created_at"
    )
    .eq("profile_id", profileId)
    .eq("show_on_wall", true)
    .order("created_at", { ascending: false });

  if (!data) return [];

  // Null out photo_url where sender didn't opt in
  return data.map((v) => ({
    id: v.id,
    wall_display_name: v.wall_display_name,
    photo_url: v.photo_public ? v.photo_url : null,
    message: v.message,
    reason: v.reason,
    date: v.date,
    created_at: v.created_at,
  }));
}

export async function getAllValentinesForOwner(
  profileId: string
): Promise<DashboardValentine[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("valentines")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  return data ?? [];
}
