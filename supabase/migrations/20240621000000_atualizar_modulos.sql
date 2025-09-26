-- Atualizar módulos com as novas opções especificadas
-- Primeiro, limpar os módulos existentes
DELETE FROM modules;

-- Inserir os novos módulos com cores distintas
INSERT INTO modules (id, nome, color) VALUES
  (gen_random_uuid(), 'Integradores', '#3b82f6'),     -- blue-500
  (gen_random_uuid(), 'Financeiro', '#f59e0b'),       -- amber-500
  (gen_random_uuid(), 'Técnico', '#10b981'),          -- emerald-500
  (gen_random_uuid(), 'Workspace', '#84cc16'),        -- lime-500
  (gen_random_uuid(), 'Estoque', '#f97316'),          -- orange-500
  (gen_random_uuid(), 'Bot', '#a21caf'),              -- fuchsia-800
  (gen_random_uuid(), 'BI', '#8b5cf6'),               -- violet-500
  (gen_random_uuid(), 'Mapa', '#06b6d4'),             -- cyan-500
  (gen_random_uuid(), 'Notas', '#eab308'),            -- yellow-500
  (gen_random_uuid(), 'CRM', '#dc2626'),              -- red-600
  (gen_random_uuid(), 'Gestão', '#059669'),           -- emerald-600
  (gen_random_uuid(), 'Outro', '#6b7280')             -- gray-500
ON CONFLICT (nome) DO NOTHING;