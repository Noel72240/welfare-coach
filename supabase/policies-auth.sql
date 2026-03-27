-- Exécuter dans Supabase → SQL Editor (une fois), après connexion par email (Supabase Auth).
-- Avant, les policies ciblaient souvent le rôle `anon` : les requêtes avec session utilisateur
-- passent en `authenticated` → INSERT / Storage upload échouent sans ces règles.
--
-- Vérifie les noms exacts de tes buckets : Storage → ou requête :
--   select id from storage.buckets;
-- Adapte la liste ci-dessous si tes buckets ont d’autres noms.

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
-- Buckets par défaut du code (supabaseClient.js) : avis-photos, avis - photos,
-- coaching-photos, coching - photos

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
      'coching - photos'
    )
  )
  WITH CHECK (
    bucket_id IN (
      'avis-photos',
      'avis - photos',
      'coaching-photos',
      'coching - photos'
    )
  );
