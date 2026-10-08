import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface InscriptionData {
  nome: string;
  email: string;
  telefone: string;
  servico_interesse?: string;
  mensagem?: string;
  created_at?: string;
}

export interface StoredInscription extends InscriptionData {
  id: string;
  created_at: string;
  status: 'synced_supabase' | 'pending_supabase' | 'local_storage';
}

const STORAGE_KEYS = {
  CONFIG_URL: 'scriptorium_supabase_url',
  CONFIG_KEY: 'scriptorium_supabase_anon_key',
  INSCRIPTIONS: 'scriptorium_inscriptions_archive',
};

// Default fallback env vars or localStorage config
export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let storedUrl = '';
  let storedKey = '';

  try {
    storedUrl = (localStorage.getItem(STORAGE_KEYS.CONFIG_URL) || '').trim();
    storedKey = (localStorage.getItem(STORAGE_KEYS.CONFIG_KEY) || '').trim();
  } catch {
    // localStorage might be unavailable in restricted sandbox
  }

  const url = storedUrl || envUrl;
  const anonKey = storedKey || envKey;
  const isConfigured = Boolean(url && anonKey && url.startsWith('http'));

  return { url, anonKey, isConfigured };
}

export function saveCustomCredentials(url: string, anonKey: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG_URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.CONFIG_KEY, anonKey.trim());
  } catch (err) {
    console.error('Failed to save Supabase credentials in local storage', err);
  }
}

export function clearCustomCredentials(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONFIG_URL);
    localStorage.removeItem(STORAGE_KEYS.CONFIG_KEY);
  } catch (err) {
    console.error('Failed to clear credentials', err);
  }
}

let cachedClient: SupabaseClient | null = null;
let lastClientKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  const currentKey = `${url}:${anonKey}`;
  if (cachedClient && lastClientKey === currentKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastClientKey = currentKey;
    return cachedClient;
  } catch (err) {
    console.error('Erro ao inicializar cliente Supabase:', err);
    return null;
  }
}

// Local persistence buffer helper
export function getLocalInscriptions(): StoredInscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INSCRIPTIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function persistLocalInscription(entry: StoredInscription) {
  try {
    const list = getLocalInscriptions();
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.INSCRIPTIONS, JSON.stringify(list.slice(0, 50)));
  } catch (err) {
    console.warn('Could not save to local storage backup', err);
  }
}

export async function testConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Credenciais do Supabase não configuradas (URL ou Anon Key ausente).',
    };
  }

  try {
    const { error } = await client.from('inscricoes').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "inscricoes" does not exist')) {
        return {
          success: false,
          message: 'Conexão estabelecida, mas a tabela "inscricoes" ainda não foi criada no Supabase. Execute o script SQL fornecido.',
        };
      }
      return {
        success: false,
        message: `Erro da API Supabase: ${error.message} (Código ${error.code || 'n/a'})`,
      };
    }
    return {
      success: true,
      message: 'Conexão com a API do Supabase e tabela "inscricoes" verificada com sucesso!',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Falha na requisição: ${msg}`,
    };
  }
}

export async function submitInscription(data: InscriptionData): Promise<{
  success: boolean;
  mode: 'supabase' | 'local_backup';
  message: string;
  recordId: string;
  error?: string;
}> {
  const timestamp = new Date().toISOString();
  const localId = `GOTHIC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const client = getSupabaseClient();

  if (client) {
    try {
      const payload = {
        nome: data.nome.trim(),
        email: data.email.trim().toLowerCase(),
        telefone: data.telefone.trim(),
        servico_interesse: data.servico_interesse || 'Geral / Manuscrito',
        mensagem: (data.mensagem || '').trim(),
        created_at: timestamp,
      };

      const { data: insertedData, error } = await client
        .from('inscricoes')
        .insert([payload])
        .select('id')
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        
        // Still save to local storage as fallback so lead is NEVER lost
        persistLocalInscription({
          ...payload,
          id: localId,
          status: 'pending_supabase',
        });

        // If table does not exist or permission error, provide actionable diagnosis
        let diag = error.message;
        if (error.message.includes('relation "inscricoes" does not exist')) {
          diag = 'A tabela "inscricoes" não existe no seu projeto Supabase. Salvo em cópia de segurança local.';
        }

        return {
          success: false,
          mode: 'local_backup',
          recordId: localId,
          message: 'Erro na inserção remota no Supabase.',
          error: diag,
        };
      }

      const assignedId = insertedData?.id || localId;

      persistLocalInscription({
        nome: payload.nome,
        email: payload.email,
        telefone: payload.telefone,
        servico_interesse: payload.servico_interesse,
        mensagem: payload.mensagem,
        created_at: timestamp,
        id: assignedId,
        status: 'synced_supabase',
      });

      return {
        success: true,
        mode: 'supabase',
        recordId: assignedId,
        message: 'Inscrição transmitida com sucesso para o banco de dados Supabase.',
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Falha na conexão de rede';
      persistLocalInscription({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        servico_interesse: data.servico_interesse,
        mensagem: data.mensagem,
        created_at: timestamp,
        id: localId,
        status: 'pending_supabase',
      });

      return {
        success: false,
        mode: 'local_backup',
        recordId: localId,
        message: 'Não foi possível contatar o Supabase no momento.',
        error: errorMsg,
      };
    }
  }

  // If Supabase is not yet configured, save locally with clear indication
  persistLocalInscription({
    nome: data.nome,
    email: data.email,
    telefone: data.telefone,
    servico_interesse: data.servico_interesse,
    mensagem: data.mensagem,
    created_at: timestamp,
    id: localId,
    status: 'local_storage',
  });

  return {
    success: true,
    mode: 'local_backup',
    recordId: localId,
    message: 'Inscrição registrada com êxito! (Aguardando configuração de credenciais do Supabase para sincronização em nuvem).',
  };
}

export const SUPABASE_SQL_SETUP = `-- ==============================================================================
-- SCRIPT DE CRIAÇÃO DA BASE DE DADOS SUPABASE - SCRIPTORIUM GOTHICUS
-- Cole e execute este script no "SQL Editor" do painel Supabase
-- ==============================================================================

-- 1. Habilitar extensão pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Criar a tabela 'inscricoes'
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

-- 3. Índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_inscricoes_created_at ON public.inscricoes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inscricoes_email ON public.inscricoes (email);
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON public.inscricoes (status);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.inscricoes ENABLE ROW LEVEL SECURITY;

-- 4.1. Permitir que novos clientes anônimos se inscrevam através do formulário do site
DROP POLICY IF EXISTS "Permitir inscricao publica anonima" ON public.inscricoes;
CREATE POLICY "Permitir inscricao publica anonima"
  ON public.inscricoes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4.2. Permitir leitura de dados para administradores e verificação
DROP POLICY IF EXISTS "Permitir leitura de inscricoes" ON public.inscricoes;
CREATE POLICY "Permitir leitura de inscricoes"
  ON public.inscricoes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4.3. Permitir atualização apenas para usuários autenticados
DROP POLICY IF EXISTS "Permitir atualizacao para administradores" ON public.inscricoes;
CREATE POLICY "Permitir atualizacao para administradores"
  ON public.inscricoes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
`;
