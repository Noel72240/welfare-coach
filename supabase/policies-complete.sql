-- ═══════════════════════════════════════════════════════════════════════════
-- Welfare Coach — RLS Storage + tables (référence unique)
-- À exécuter dans Supabase → SQL Editor après relecture.
--
-- ÉTAPE 0 — Noms exacts des buckets (obligatoire)
--   SELECT id FROM storage.buckets ORDER BY id;
-- ou : Storage → Files : le nom affiché = bucket_id (sensible à la casse / espaces).
--
-- Tes captures montrent parfois « coaching - photos » et parfois « coching - photos » :
-- ce ne sont PAS les mêmes chaînes. Il doit exister UN bucket par usage, ou alors
-- les deux noms doivent tous les deux apparaître dans les policies ci-dessous.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Table avis : lecture publique (site) + admin connecté ──────────────────
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_visible_avis" ON public.avis;
CREATE POLICY "anon_select_visible_avis"
  ON public.avis FOR SELECT TO anon
  USING (visible = true);

DROP POLICY IF EXISTS "authenticated_full_access_avis" ON public.avis;
CREATE POLICY "authenticated_full_access_avis"
  ON public.avis FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── Table galerie : lecture publique (lignes visibles) + admin ─────────────
ALTER TABLE public.galerie ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_visible_galerie" ON public.galerie;
CREATE POLICY "anon_select_visible_galerie"
  ON public.galerie FOR SELECT TO anon
  USING (visible = true);

DROP POLICY IF EXISTS "authenticated_full_access_galerie" ON public.galerie;
CREATE POLICY "authenticated_full_access_galerie"
  ON public.galerie FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── Storage : lecture publique (images affichées sur le site sans login) ─────
-- Les buckets sont « public » dans l’UI, mais l’API exige quand même une policy SELECT pour anon.

DROP POLICY IF EXISTS "anon_select_storage_site_buckets" ON storage.objects;
CREATE POLICY "anon_select_storage_site_buckets"
  ON storage.objects FOR SELECT TO anon
  USING (
    bucket_id IN (
      'avis-photos',
      'avis - photos',
      'coaching-photos',
      'coaching - photos',
      'coching - photos',
      'galerie'
    )
  );

-- ── Storage : admin connecté (upload, liste, suppression) ───────────────────

DROP POLICY IF EXISTS "authenticated_storage_site_buckets" ON storage.objects;
CREATE POLICY "authenticated_storage_site_buckets"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id IN (
      'avis-photos',
      'avis - photos',
      'coaching-photos',
      'coaching - photos',
      'coching - photos',
      'galerie'
    )
  )
  WITH CHECK (
    bucket_id IN (
      'avis-photos',
      'avis - photos',
      'coaching-photos',
      'coaching - photos',
      'coching - photos',
      'galerie'
    )
  );

-- Note sécurité : d’anciens scripts « INSERT / DELETE pour anon » sur le storage
-- ouvrent l’upload/suppression à tout le monde avec la clé anon. Préfère les
-- policies ci-dessus (SELECT anon + ALL authenticated) et supprime les policies
-- anon trop permissives si tu n’en as plus besoin.

-- ── Table site_content : contenu JSON (page « Mon approche », etc.) ─────────

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
