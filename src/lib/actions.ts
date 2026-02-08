"use server";

import { createClient } from "@/lib/supabase/server";
import type { ValentineRecord } from "./types";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export async function uploadFile(
  formData: globalThis.FormData,
  bucket: "valentine-photos" | "profile-avatars"
) {
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    console.error("[uploadFile] No file provided");
    return { error: "No file provided", url: null };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    console.error("[uploadFile] Invalid type:", file.type);
    return { error: "Only JPEG, PNG, GIF, and WebP images are allowed", url: null };
  }

  if (file.size > MAX_FILE_SIZE) {
    console.error("[uploadFile] File too large:", file.size);
    return { error: "File must be under 5MB", url: null };
  }

  // Read buffer ONCE — use it for both validation and upload
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (!isValidImageSignature(bytes)) {
    console.error("[uploadFile] Invalid magic bytes:", bytes.slice(0, 12));
    return { error: "File does not appear to be a valid image", url: null };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ? ext : "jpg";
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${safeExt}`;

  // Upload the buffer directly (not the consumed file)
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: file.type,
    });

  if (uploadError) {
    console.error("[uploadFile] Supabase error:", uploadError.message);
    return { error: "Upload failed", url: null };
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return { error: null, url: urlData.publicUrl };
}

function isValidImageSignature(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true;
  // GIF: 47 49 46 38
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true;
  // WebP: RIFF....WEBP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return true;

  return false;
}

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

  // Input length validation
  const name = data.name.trim().slice(0, 100);
  const instagram = data.instagram.trim().slice(0, 50);
  const reason = data.reason.trim().slice(0, 2000);
  const message = data.message.trim().slice(0, 5000);
  const location = data.location.trim().slice(0, 100);
  const song = data.song.trim().slice(0, 200);

  if (!name) {
    return { error: "Name is required" };
  }

  if (!data.date) {
    return { error: "Date is required" };
  }

  const { error } = await supabase.from("valentines").insert({
    name,
    email: "",
    instagram,
    date: data.date,
    reason,
    photo_url: data.photo_url,
    message,
    location,
    song,
    profile_id: data.profile_id,
    show_on_wall: true,
    wall_display_name: name,
    photo_public: true,
  });

  if (error) {
    console.error("[submitValentine]", error.message, error.code);
    return { error: "Failed to submit valentine. Please try again." };
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

  // Validate display name
  const displayName = data.displayName.trim().slice(0, 50);
  if (!displayName) {
    return { error: "Display name is required" };
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
    display_name: displayName,
    username: data.username.toLowerCase(),
    avatar_url: data.avatarUrl,
  });

  if (error) {
    return { error: "Failed to create profile. Please try again." };
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
    return { error: "Failed to save reaction. Please try again." };
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
    return { error: "Failed to update avatar. Please try again." };
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
    return { error: "Failed to update username. Please try again." };
  }

  return { error: null };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
