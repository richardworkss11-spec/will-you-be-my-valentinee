-- Valentine's Day Multi-User Platform Schema (v2)
-- Run this AFTER migration.sql or on a fresh database

-- ============================================
-- PROFILES TABLE
-- ============================================
create table if not exists public.profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  display_name text not null,
  username text not null unique,
  avatar_url text,
  created_at timestamptz default now()
);

-- Index for fast username lookups (case-insensitive)
create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));

-- Enable RLS
alter table public.profiles enable row level security;

-- Anyone can read profiles (public pages)
create policy "Public profile reads"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

-- Only the owner can insert their profile
create policy "Owner profile insert"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Only the owner can update their profile
create policy "Owner profile update"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================
-- UPDATE VALENTINES TABLE
-- ============================================
-- Add new columns for multi-user + privacy
alter table public.valentines
  add column if not exists profile_id uuid references public.profiles(id) on delete cascade,
  add column if not exists show_on_wall boolean default false,
  add column if not exists wall_display_name text,
  add column if not exists photo_public boolean default false;

-- Index for fetching valentines by profile
create index if not exists valentines_profile_id_idx
  on public.valentines (profile_id);

-- Drop old policies to replace them
drop policy if exists "Allow anonymous inserts" on public.valentines;
drop policy if exists "Allow authenticated reads" on public.valentines;

-- Anon users can insert valentines (submitting a valentine)
create policy "Anon valentine inserts"
  on public.valentines
  for insert
  to anon, authenticated
  with check (true);

-- Public wall reads: only show valentines where show_on_wall is true
create policy "Public wall reads"
  on public.valentines
  for select
  to anon
  using (show_on_wall = true);

-- Profile owner can read ALL their valentines (public + private)
create policy "Owner reads all valentines"
  on public.valentines
  for select
  to authenticated
  using (
    profile_id in (
      select id from public.profiles where user_id = auth.uid()
    )
  );

-- ============================================
-- STORAGE: Profile avatars bucket
-- ============================================
insert into storage.buckets (id, name, public)
values ('profile-avatars', 'profile-avatars', true)
on conflict (id) do nothing;

-- Allow authenticated uploads to profile-avatars bucket
create policy "Authenticated avatar uploads"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'profile-avatars');

-- Allow public reads from profile-avatars bucket
create policy "Public avatar reads"
  on storage.objects
  for select
  to public
  using (bucket_id = 'profile-avatars');
