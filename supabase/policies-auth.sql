-- Version courte (admin + storage authenticated uniquement).
-- Pour la config complète (anon lecture avis/galerie + storage lecture publique), voir :
--   supabase/policies-complete.sql
--
-- Vérifie les noms exacts de tes buckets : SELECT id FROM storage.buckets;

-- ── Tables : droits complets pour utilisateurs connectés (admin) ─────────────

DROP POLICY IF EXISTS "authenticated_full_access_avis" ON public.avis;
CREATE POLICY "authenticated_full_access_avis"
  ON public.avis
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_full_access_galerie" ON public.galerie;
CREATE POLICY "authenticated_full_access_galerie"
  ON public.galerie
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── Storage : upload / lecture liste / suppression pour l’admin ─────────────
-- Buckets (noms exacts comme dans Storage) : vérifier avec select id from storage.buckets;

DROP POLICY IF EXISTS "authenticated_storage_site_buckets" ON storage.objects;
CREATE POLICY "authenticated_storage_site_buckets"
  ON storage.objects
  FOR ALL
  TO authenticated
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
