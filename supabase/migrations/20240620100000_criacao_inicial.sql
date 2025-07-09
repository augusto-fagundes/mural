-- Criação das tabelas base, tudo com UUID

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nome text,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suggestion_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280'
);

INSERT INTO suggestion_statuses (id, nome, color) VALUES
  (gen_random_uuid(), 'Recebido', '#38bdf8'),
  (gen_random_uuid(), 'Em análise', '#fbbf24'),
  (gen_random_uuid(), 'Aprovada', '#10b981'),
  (gen_random_uuid(), 'Rejeitada', '#f43f5e'),
  (gen_random_uuid(), 'Implementada', '#8b5cf6')
ON CONFLICT (nome) DO NOTHING;

CREATE TABLE IF NOT EXISTS roadmap_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280'
);

INSERT INTO roadmap_statuses (id, nome, color) VALUES
  (gen_random_uuid(), 'Planejado', '#fbbf24'),
  (gen_random_uuid(), 'Em andamento', '#60a5fa'),
  (gen_random_uuid(), 'Concluído', '#34d399'),
  (gen_random_uuid(), 'Cancelado', '#f87171')
ON CONFLICT (nome) DO NOTHING;

CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280'
);

INSERT INTO modules (id, nome, color) VALUES
  (gen_random_uuid(), 'Financeiro', '#f59e42'),
  (gen_random_uuid(), 'Workspace', '#84cc16'),
  (gen_random_uuid(), 'Bot', '#a21caf'),
  (gen_random_uuid(), 'Mapa', '#06b6d4')
ON CONFLICT (nome) DO NOTHING;

CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  email text NOT NULL,
  youtube_url text,
  is_public boolean DEFAULT true,
  votes integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  admin_response text,
  is_pinned boolean DEFAULT false,
  status_id uuid REFERENCES suggestion_statuses(id),
  module_id uuid REFERENCES modules(id),
  image_urls text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suggestion_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (suggestion_id, user_email)
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  planned_date date,
  status_id uuid REFERENCES roadmap_statuses(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS changelog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  roadmap_item_id uuid REFERENCES roadmap_items(id) ON DELETE SET NULL,
  released_at date,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suggestion_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criação do bucket para imagens de sugestões
insert into storage.buckets (id, name, public) 
values ('suggestion-images', 'suggestion-images', true)
on conflict (id) do nothing;

-- Remove a policy se já existir (idempotente)
DROP POLICY IF EXISTS "Permitir upload público no bucket suggestion-images" ON storage.objects;

-- Cria a policy
CREATE POLICY "Permitir upload público no bucket suggestion-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'suggestion-images');

-- Função para incrementar votos
CREATE OR REPLACE FUNCTION increment_suggestion_votes(suggestion_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE suggestions SET votes = votes + 1 WHERE id = suggestion_id;
END;
$$ LANGUAGE plpgsql;

-- Função para decrementar votos
CREATE OR REPLACE FUNCTION decrement_suggestion_votes(suggestion_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE suggestions SET votes = GREATEST(votes - 1, 0) WHERE id = suggestion_id;
END;
$$ LANGUAGE plpgsql; 

-- Função para incrementar comentários
CREATE OR REPLACE FUNCTION increment_suggestion_comments()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM suggestions WHERE id = NEW.suggestion_id) THEN
    UPDATE suggestions
    SET comments_count = comments_count + 1
    WHERE id = NEW.suggestion_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para decrementar comentários
CREATE OR REPLACE FUNCTION decrement_suggestion_comments()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM suggestions WHERE id = OLD.suggestion_id) THEN
    UPDATE suggestions
    SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.suggestion_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger para INSERT em suggestion_comments
CREATE TRIGGER trigger_increment_comments
AFTER INSERT ON suggestion_comments
FOR EACH ROW
EXECUTE FUNCTION increment_suggestion_comments();

-- Trigger para DELETE em suggestion_comments
CREATE TRIGGER trigger_decrement_comments
AFTER DELETE ON suggestion_comments
FOR EACH ROW
EXECUTE FUNCTION decrement_suggestion_comments();

-- Função para incrementar votos (trigger)
CREATE OR REPLACE FUNCTION trigger_increment_suggestion_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM suggestions WHERE id = NEW.suggestion_id) THEN
    UPDATE suggestions
    SET votes = votes + 1
    WHERE id = NEW.suggestion_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para decrementar votos (trigger)
CREATE OR REPLACE FUNCTION trigger_decrement_suggestion_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM suggestions WHERE id = OLD.suggestion_id) THEN
    UPDATE suggestions
    SET votes = GREATEST(votes - 1, 0)
    WHERE id = OLD.suggestion_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger para INSERT em suggestion_votes
CREATE TRIGGER trigger_increment_votes
AFTER INSERT ON suggestion_votes
FOR EACH ROW
EXECUTE FUNCTION trigger_increment_suggestion_votes();

-- Trigger para DELETE em suggestion_votes
CREATE TRIGGER trigger_decrement_votes
AFTER DELETE ON suggestion_votes
FOR EACH ROW
EXECUTE FUNCTION trigger_decrement_suggestion_votes(); 