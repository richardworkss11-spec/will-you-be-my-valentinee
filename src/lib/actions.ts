"use server";

import { createClient } from "@/lib/supabase/server";
import type { ValentineRecord } from "./types";

const RESERVED_USERNAMES = [
  "setup",
  "dashboard",
  "auth",
  "api",
  "admin",
  "wall",
  "settings",
  "profile",
];

export async function submitValentine(data: ValentineRecord) {
  const supabase = await createClient();

  const { error } = await supabase.from("valentines").insert({
    name: data.name.trim(),
    instagram: data.instagram.trim(),
    date: data.date,
    reason: data.reason.trim(),
    photo_url: data.photo_url,
    message: data.message.trim(),
    location: data.location.trim(),
    song: data.song.trim(),
    profile_id: data.profile_id,
    show_on_wall: data.show_on_wall,
    wall_display_name: data.wall_display_name.trim(),
    photo_public: data.photo_public,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function createProfile(data: {
  displayName: string;
  username: string;
  avatarUrl: string | null;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Validate username format
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  if (!usernameRegex.test(data.username)) {
    return {
      error:
        "Username must be 3-30 characters and only contain letters, numbers, hyphens, and underscores",
    };
  }

  // Check reserved usernames
  if (RESERVED_USERNAMES.includes(data.username.toLowerCase())) {
    return { error: "This username is reserved" };
  }

  // Check availability
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", data.username)
    .single();

  if (existing) {
    return { error: "Username is already taken" };
  }

  const { error } = await supabase.from("profiles").insert({
    user_id: user.id,
    display_name: data.displayName.trim(),
    username: data.username.toLowerCase(),
    avatar_url: data.avatarUrl,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function checkUsernameAvailability(username: string) {
  if (!username || username.length < 3) {
    return { available: false, error: "Username must be at least 3 characters" };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  if (!usernameRegex.test(username)) {
    return { available: false, error: "Only letters, numbers, hyphens, underscores" };
  }

  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return { available: false, error: "This username is reserved" };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .single();

  if (existing) {
    return { available: false, error: "Username is already taken" };
  }

  return { available: true, error: null };
}

export async function reactToValentine(valentineId: string, reaction: string | null) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get the user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return { error: "Profile not found" };
  }

  // Verify the valentine belongs to this user
  const { data: valentine } = await supabase
    .from("valentines")
    .select("profile_id")
    .eq("id", valentineId)
    .single();

  if (!valentine || valentine.profile_id !== profile.id) {
    return { error: "Not authorized" };
  }

  const { error } = await supabase
    .from("valentines")
    .update({ reaction })
    .eq("id", valentineId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function updateAvatar(avatarUrl: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function updateUsername(newUsername: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Validate format
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  if (!usernameRegex.test(newUsername)) {
    return {
      error: "Username must be 3-30 characters, only letters, numbers, hyphens, underscores",
    };
  }

  if (RESERVED_USERNAMES.includes(newUsername.toLowerCase())) {
    return { error: "This username is reserved" };
  }

  // Get current profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, username_changes")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return { error: "Profile not found" };
  }

  // Same username — no-op
  if (profile.username === newUsername.toLowerCase()) {
    return { error: null };
  }

  // Check change limit
  const changes = profile.username_changes ?? 0;
  if (changes >= 3) {
    return { error: "You've reached the maximum of 3 username changes" };
  }

  // Check availability
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", newUsername)
    .single();

  if (existing) {
    return { error: "Username is already taken" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username: newUsername.toLowerCase(),
      username_changes: changes + 1,
    })
    .eq("id", profile.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
