// SUPABASE SETUP GUIDE - Welfare Coach
// ════════════════════════════════════════════════════════════════

// ── 1. CRÉER LES TABLES ──

// SQL à exécuter dans Supabase Dashboard → SQL Editor

-- Table: admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  password_changed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: avis
CREATE TABLE IF NOT EXISTS avis (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nom VARCHAR(255) NOT NULL,
  ville VARCHAR(255),
  note INT DEFAULT 5,
  texte TEXT NOT NULL,
  photo_url VARCHAR(500),
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: photos (optionnel, pour référencer les photos)
CREATE TABLE IF NOT EXISTS photos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  avis_id BIGINT REFERENCES avis(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── 2. AJOUTER UN UTILISATEUR ADMIN PAR DÉFAUT ──

INSERT INTO admin_users (email, password_hash, password_changed)
VALUES ('welfare.coach72@gmail.com', 'YWRtaW4xMjM=', false)
ON CONFLICT(email) DO NOTHING;

-- Note: 'YWRtaW4xMjM=' est le base64 de 'admin123'
-- À changer après première connexion!

-- ── 3. CRÉER LE STORAGE (Buckets) ──

-- Aller dans Supabase Dashboard → Storage → Create New Bucket
-- Créer 2 buckets publics:

1. avis-photos
   - Public (cocher "Public bucket")
   - Pour les photos des avis clients

2. coaching-photos
   - Public
   - Pour les photos du coaching/approche

-- ── 4. RLS POLICIES (Sécurité) ──

-- Pour admin_users (lecture/écriture uniquement pour l'admin)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read own data" ON admin_users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Pour avis (lecture publique, écriture restreinte)
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible avis" ON avis
  FOR SELECT USING (visible = true);

-- IMPORTANT:
-- Avec RLS activé, un INSERT nécessite une policy avec WITH CHECK.
-- Comme ton admin côté site n'utilise pas Supabase Auth (mot de passe stocké localement),
-- le plus simple (mais le moins sécurisé) est d'autoriser la gestion publique.
-- Si tu veux une vraie sécurité, il faut passer par Supabase Auth + policies, ou une Edge Function (service role).

-- Option A (simple / dev / site privé): autoriser CRUD public
DROP POLICY IF EXISTS "Public can manage avis" ON avis;
CREATE POLICY "Public can manage avis" ON avis
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Option B (recommandé si tu as Supabase Auth): à adapter selon ton auth (ex: role admin)
-- CREATE POLICY "Admin can manage avis" ON avis
--   FOR ALL
--   USING (auth.role() = 'authenticated')
--   WITH CHECK (auth.role() = 'authenticated');

-- Pour storage (lecture publique)
-- Aller dans Storage → Policies et créer:

CREATE POLICY "Public read access" on storage.objects
  FOR SELECT USING ( bucket_id = 'avis-photos' );

CREATE POLICY "Authenticated upload" on storage.objects
  FOR INSERT WITH CHECK ( bucket_id = 'avis-photos' );

-- ── 5. INSTALLER SUPABASE CLIENT ──

// Dans ton terminal:
npm install @supabase/supabase-js

-- ── 6. UTILISER DANS TON APP ──

// Dans supabaseClient.js (déjà fourni)
// URLs et clés:
// URL: https://lsfjpiwjdzclbhqbysnq.supabase.co
// Key: sb_publishable_eS-ysLy20C5qYQnWVCu9lw_eTIGXxiJ

-- ── 7. AJOUTER QUELQUES AVIS DE TEST ──

INSERT INTO avis (nom, ville, note, texte, visible) VALUES
('Marie L.', 'Le Mans', 5, 'En quelques séances, Johanna m''a aidée à retrouver une relation apaisée avec la nourriture. Son approche bienveillante et sans jugement est vraiment efficace !', true),
('Sophie R.', 'Connerré', 5, 'J''ai perdu 8 kg en 3 mois sans me priver. Johanna m''a appris à manger mieux, pas moins. Je recommande à 100% !', true),
('Claire M.', 'Bonnétable', 5, 'Le diagnostic frigo était une vraie révélation. Des conseils pratiques, adaptés à ma vie de famille. Merci Johanna !', true),
('Aurélie D.', 'Sarthe', 5, 'Un suivi personnalisé et motivant. Johanna est à l''écoute, professionnelle et très sympathique. Je continue l''aventure avec elle !', true);

-- ════════════════════════════════════════════════════════════════

// RÉSUMÉ DES ÉTAPES:

1. ✅ Aller dans Supabase Dashboard → SQL Editor
2. ✅ Copier/coller les CREATE TABLE (admin_users, avis, photos)
3. ✅ Exécuter l'INSERT pour créer l'admin par défaut
4. ✅ Aller dans Storage → Créer buckets (avis-photos, coaching-photos)
5. ✅ Configurer RLS Policies pour la sécurité
6. ✅ npm install @supabase/supabase-js
7. ✅ Utiliser supabaseClient.js dans ton app

// ════════════════════════════════════════════════════════════════
// FIN SETUP SUPABASE
