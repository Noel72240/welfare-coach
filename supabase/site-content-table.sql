-- Page admin « Mon approche » : table manquante → erreur PGRST205
-- Supabase → SQL Editor → coller tout le bloc → Run

CREATE TABLE IF NOT EXISTS public.site_content (
  id text PRIMARY KEY,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_content" ON public.site_content;
CREATE POLICY "anon_select_site_content"
  ON public.site_content FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS "authenticated_all_site_content" ON public.site_content;
CREATE POLICY "authenticated_all_site_content"
  ON public.site_content FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

GRANT SELECT ON TABLE public.site_content TO anon;
GRANT ALL ON TABLE public.site_content TO authenticated;
GRANT ALL ON TABLE public.site_content TO service_role;
