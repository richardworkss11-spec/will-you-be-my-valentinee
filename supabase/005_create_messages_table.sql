-- 005: Create private messages table

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sender_name text,
  message text NOT NULL,
  photo_url text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_profile_id_idx ON public.messages (profile_id);
CREATE INDEX IF NOT EXISTS messages_unread_idx ON public.messages (profile_id, is_read) WHERE is_read = false;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Anyone can send a private message
CREATE POLICY "Anon message inserts" ON public.messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only the profile owner can read their messages
CREATE POLICY "Owner reads own messages" ON public.messages
  FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Only the profile owner can update (mark as read)
CREATE POLICY "Owner updates own messages" ON public.messages
  FOR UPDATE TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
