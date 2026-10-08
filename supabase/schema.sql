-- ==============================================================================
-- SCRIPT DE CRIAÇÃO DA BASE DE DADOS SUPABASE - SCRIPTORIUM GOTHICUS
-- Cole e execute este script no "SQL Editor" do seu painel Supabase
-- ==============================================================================

-- 1. Habilitar a extensão pgcrypto (para geração de UUID v4 caso necessário)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Criar a tabela 'inscricoes' para coleta de novos clientes interessados
CREATE TABLE IF NOT EXISTS public.inscricoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  servico_interesse TEXT DEFAULT 'Manuscrito Iluminado em Pergaminho com Ouro 24k',
  mensagem TEXT,
  status TEXT DEFAULT 'novo' NOT NULL,
  observacoes_internas TEXT
);

-- 3. Adicionar comentários descritivos para o painel do Supabase Studio
COMMENT ON TABLE public.inscricoes IS 'Registro de novos clientes e encomendas de caligrafia gótica';
COMMENT ON COLUMN public.inscricoes.nome IS 'Nome completo do cliente ou contratante';
COMMENT ON COLUMN public.inscricoes.email IS 'Endereço de e-mail para contato e envio de propostas';
COMMENT ON COLUMN public.inscricoes.telefone IS 'Telefone ou WhatsApp com DDD para retorno';
COMMENT ON COLUMN public.inscricoes.servico_interesse IS 'Estilo ou tipo de obra gótica de interesse';
COMMENT ON COLUMN public.inscricoes.mensagem IS 'Dedicatória, especificações de tamanho ou dúvidas do cliente';
COMMENT ON COLUMN public.inscricoes.status IS 'Status do atendimento: novo, em_contato, orcamento_enviado, concluido';

-- 4. Criar índices para otimização de consultas e relatórios
CREATE INDEX IF NOT EXISTS idx_inscricoes_created_at ON public.inscricoes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inscricoes_email ON public.inscricoes (email);
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON public.inscricoes (status);

-- 5. Configurar Row Level Security (RLS) para proteção da tabela
ALTER TABLE public.inscricoes ENABLE ROW LEVEL SECURITY;

-- 5.1. Permitir que clientes anônimos enviem inscrições através do formulário do site
DROP POLICY IF EXISTS "Permitir inscricao publica anonima" ON public.inscricoes;
CREATE POLICY "Permitir inscricao publica anonima"
  ON public.inscricoes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5.2. Permitir leitura de dados para administradores autenticados e chave anônima autorizada
DROP POLICY IF EXISTS "Permitir leitura de inscricoes" ON public.inscricoes;
CREATE POLICY "Permitir leitura de inscricoes"
  ON public.inscricoes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5.3. Permitir atualização de status apenas para usuários autenticados
DROP POLICY IF EXISTS "Permitir atualizacao para administradores autenticados" ON public.inscricoes;
CREATE POLICY "Permitir atualizacao para administradores autenticados"
  ON public.inscricoes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 6. DADO DE TESTE OPCIONAL (Descomente para inserir um registro de exemplo):
-- ==============================================================================
-- INSERT INTO public.inscricoes (nome, email, telefone, servico_interesse, mensagem)
-- VALUES (
--   'Dom Rodrigo de Toledo',
--   'rodrigo.toledo@exemplo.com',
--   '(11) 98765-4321',
--   'Manuscrito Iluminado em Pergaminho com Ouro 24k',
--   'Gostaria de orçar uma página solene de abertura com letra capitular ornada em azul e ouro.'
-- );
