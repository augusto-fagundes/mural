-- Popula módulos
INSERT INTO modules (id, nome, color) VALUES
  (gen_random_uuid(), 'Financeiro', '#f59e42'),
  (gen_random_uuid(), 'Workspace', '#22c55e'),
  (gen_random_uuid(), 'Bot', '#3b82f6'),
  (gen_random_uuid(), 'Mapa', '#6366f1')
ON CONFLICT (nome) DO NOTHING;

-- Popula status de sugestão
INSERT INTO suggestion_statuses (id, nome, color) VALUES
  (gen_random_uuid(), 'Recebido', '#fde68a'),
  (gen_random_uuid(), 'Em análise', '#a5b4fc'),
  (gen_random_uuid(), 'Aprovada', '#6ee7b7'),
  (gen_random_uuid(), 'Rejeitada', '#fca5a5'),
  (gen_random_uuid(), 'Implementada', '#c4b5fd')
ON CONFLICT (nome) DO NOTHING;

-- Popula usuários
INSERT INTO users (id, email, nome, is_admin) VALUES
  (gen_random_uuid(), 'carlos@empresa.com', 'Carlos', false),
  (gen_random_uuid(), 'ana@empresa.com', 'Ana', false),
  (gen_random_uuid(), 'pedro@empresa.com', 'Pedro', false),
  (gen_random_uuid(), 'lucia@empresa.com', 'Lucia', false),
  (gen_random_uuid(), 'interno@mksolution.com', 'Interno', true)
ON CONFLICT (email) DO NOTHING;

-- Popula sugestões
INSERT INTO suggestions (id, title, description, email, is_public, votes, comments_count, status_id, module_id, created_at, updated_at)
SELECT gen_random_uuid(), 'Adicionar filtro avançado no relatório financeiro', 'Gostaria de poder filtrar os relatórios por período personalizado, tipo de transação e status de pagamento simultaneamente para ter uma visão mais detalhada dos dados financeiros.', 'carlos@empresa.com', true, 23, 5, s.id, m.id, now(), now()
FROM suggestion_statuses s, modules m WHERE s.nome = 'Em análise' AND m.nome = 'Financeiro';

INSERT INTO suggestions (id, title, description, email, is_public, votes, comments_count, status_id, module_id, created_at, updated_at)
SELECT gen_random_uuid(), 'Integração com Slack para notificações', 'Seria muito útil receber notificações importantes diretamente no Slack da equipe quando houver atualizações críticas no sistema.', 'ana@empresa.com', true, 18, 3, s.id, m.id, now(), now()
FROM suggestion_statuses s, modules m WHERE s.nome = 'Recebido' AND m.nome = 'Workspace';

INSERT INTO suggestions (id, title, description, email, is_public, votes, comments_count, status_id, module_id, created_at, updated_at)
SELECT gen_random_uuid(), 'Modo escuro para toda a plataforma', 'Implementar tema escuro em todas as páginas para melhorar a experiência durante o uso noturno e reduzir o cansaço visual.', 'pedro@empresa.com', true, 45, 12, s.id, m.id, now(), now()
FROM suggestion_statuses s, modules m WHERE s.nome = 'Aprovada' AND m.nome = 'Bot';

INSERT INTO suggestions (id, title, description, email, is_public, votes, comments_count, status_id, module_id, created_at, updated_at)
SELECT gen_random_uuid(), 'Exportar dados do mapa em formato Excel', 'Possibilidade de exportar todos os dados visualizados no mapa diretamente para planilhas Excel para análise offline.', 'lucia@empresa.com', true, 31, 8, s.id, m.id, now(), now()
FROM suggestion_statuses s, modules m WHERE s.nome = 'Implementada' AND m.nome = 'Mapa';

INSERT INTO suggestions (id, title, description, email, is_public, votes, comments_count, status_id, module_id, created_at, updated_at)
SELECT gen_random_uuid(), 'Sugestão privada para testes', 'Esta é uma sugestão privada que não deve aparecer no mural público.', 'interno@mksolution.com', false, 2, 1, s.id, m.id, now(), now()
FROM suggestion_statuses s, modules m WHERE s.nome = 'Recebido' AND m.nome = 'Workspace';

-- Popula votos (exemplo)
INSERT INTO suggestion_votes (id, suggestion_id, user_email, created_at)
SELECT gen_random_uuid(), s.id, 'carlos@empresa.com', now() FROM suggestions s LIMIT 1;

-- Popula comentários (exemplo)
INSERT INTO suggestion_comments (id, suggestion_id, author_name, author_email, content, created_at, updated_at)
SELECT gen_random_uuid(), s.id, 'Carlos', 'carlos@empresa.com', 'Ótima sugestão, apoio totalmente!', now(), now() FROM suggestions s LIMIT 1; 