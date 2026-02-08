-- Valentine's Day App Schema

-- Create the valentines table
create table if not exists public.valentines (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  date text not null,
  reason text,
  photo_url text,
  message text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.valentines enable row level security;

-- Allow anonymous inserts
create policy "Allow anonymous inserts"
  on public.valentines
  for insert
  to anon
  with check (true);

-- Allow authenticated reads
create policy "Allow authenticated reads"
  on public.valentines
  for select
  to authenticated
  using (true);

-- Create storage bucket for photos
insert into storage.buckets (id, name, public)
values ('valentine-photos', 'valentine-photos', true)
on conflict (id) do nothing;

-- Allow anonymous uploads to valentine-photos bucket
create policy "Allow anonymous uploads"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'valentine-photos');

-- Allow public reads from valentine-photos bucket
create policy "Allow public reads"
  on storage.objects
  for select
  to public
  using (bucket_id = 'valentine-photos');
