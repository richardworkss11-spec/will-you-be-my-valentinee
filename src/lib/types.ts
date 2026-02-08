export type Screen = "landing" | "congrats" | "form" | "thankyou";

export interface FormData {
  name: string;
  instagram: string;
  date: string;
  reason: string;
  photo: File | null;
  message: string;
  location: string;
  song: string;
}

export interface ValentineRecord {
  name: string;
  instagram: string;
  date: string;
  reason: string;
  photo_url: string | null;
  message: string;
  location: string;
  song: string;
  profile_id: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  username_changes: number;
  created_at: string;
}

export interface ProfileSetupData {
  displayName: string;
  username: string;
  avatarUrl: string | null;
}

export interface WallValentine {
  id: string;
  wall_display_name: string;
  photo_url: string | null;
  message: string;
  reason: string;
  date: string;
  location: string;
  song: string;
  reaction: string | null;
  created_at: string;
}

export interface DashboardValentine {
  id: string;
  name: string;
  instagram: string;
  date: string;
  reason: string;
  photo_url: string | null;
  message: string;
  location: string;
  song: string;
  reaction: string | null;
  created_at: string;
}
