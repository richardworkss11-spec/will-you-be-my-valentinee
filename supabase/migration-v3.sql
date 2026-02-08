-- Migration v3: New columns for valentines + profile features

-- Valentines: new fields
ALTER TABLE valentines ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE valentines ADD COLUMN IF NOT EXISTS song text;
ALTER TABLE valentines ADD COLUMN IF NOT EXISTS reaction text;
ALTER TABLE valentines ADD COLUMN IF NOT EXISTS instagram text;

-- Profiles: track username change count (max 3 allowed)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username_changes integer DEFAULT 0;

-- Owner can UPDATE their own valentines (needed for reactions)
CREATE POLICY "Owner valentine updates"
  ON public.valentines
  FOR UPDATE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );
