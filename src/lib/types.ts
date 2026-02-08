export type Screen = "landing" | "congrats" | "form" | "thankyou";

export interface FormData {
  name: string;
  email: string;
  date: string;
  reason: string;
  photo: File | null;
  message: string;
}

export interface ValentineRecord {
  name: string;
  email: string;
  date: string;
  reason: string;
  photo_url: string | null;
  message: string;
}
