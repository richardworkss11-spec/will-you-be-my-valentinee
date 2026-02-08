"use server";

import { createClient } from "@supabase/supabase-js";
import type { ValentineRecord } from "./types";

export async function submitValentine(data: ValentineRecord) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { error } = await supabase.from("valentines").insert({
    name: data.name.trim(),
    email: data.email.trim(),
    date: data.date,
    reason: data.reason.trim(),
    photo_url: data.photo_url,
    message: data.message.trim(),
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
