-- Migration v4: Fix RLS policy gaps
-- 1. Allow authenticated users to upload to valentine-photos bucket
-- 2. Allow authenticated users to see public wall valentines on ANY profile

-- ============================================
-- FIX 1: Storage — authenticated uploads to valentine-photos
-- ============================================
-- The original policy only allowed 'anon' uploads.
-- When a logged-in user fills the form, they are 'authenticated',
-- so the upload was blocked by RLS.
CREATE POLICY "Authenticated valentine photo uploads"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'valentine-photos');

-- ============================================
-- FIX 2: Valentines — authenticated users can see public walls
-- ============================================
-- The "Public wall reads" policy only applied to 'anon'.
-- Logged-in users visiting another user's wall saw nothing.
CREATE POLICY "Authenticated public wall reads"
  ON public.valentines
  FOR SELECT
  TO authenticated
  USING (show_on_wall = true);
