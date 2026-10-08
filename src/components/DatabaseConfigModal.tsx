import React, { useState, useEffect } from 'react';
import {
  getSupabaseCredentials,
  saveCustomCredentials,
  clearCustomCredentials,
  testConnection,
  getLocalInscriptions,
  SUPABASE_SQL_SETUP,
  StoredInscription,
} from '../lib/supabase.ts';
import {
  Database,
  Check,
  Copy,
  RefreshCw,
  X,
  Server,
  FileCode,
  Users,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface DatabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseConfigModal: React.FC<DatabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'records'>('status');
  const [credentials, setCredentials] = useState({ url: '', anonKey: '' });
  const [testResult, setTestResult] = useState<{ loading: boolean; success?: boolean; message?: string }>({
    loading: false,
  });
  const [records, setRecords] = useState<StoredInscription[]>([]);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getSupabaseCredentials();
      setCredentials({ url: current.url, anonKey: current.anonKey });
      setRecords(getLocalInscriptions());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomCredentials(credentials.url, credentials.anonKey);
    handleTestConnection();
  };

  const handleClear = () => {
    clearCustomCredentials();
    setCredentials({ url: '', anonKey: '' });
    setTestResult({ loading: false, message: 'Credenciais personalizadas limpas.' });
  };

  const handleTestConnection = async () => {
    setTestResult({ loading: true });
    const res = await testConnection();
    setTestResult({
      loading: false,
      success: res.success,
      message: res.message,
    });
  };

  const handleCopySql = async () => {
    await navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-xl bg-stone-900 border border-stone-700 shadow-2xl text-stone-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg text-amber-100 font-semibold">
                Integração Direta com API Supabase
              </h3>
              <p className="text-xs text-stone-400 font-sans">
                Conexão ao banco de dados relacional para recebimento de inscrições
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-800 bg-stone-950/40 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-2 border-b-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'status'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Conexão & Credenciais</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-2 border-b-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Tabela SQL (Supabase)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('records');
              setRecords(getLocalInscriptions());
            }}
            className={`px-3 py-2 border-b-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'records'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registros Recebidos ({records.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'status' && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-stone-950/70 border border-stone-800 text-xs text-stone-300 leading-relaxed">
                <p>
                  O formulário está conectado à API direta do Supabase via biblioteca{' '}
                  <code className="text-amber-300 font-mono">@supabase/supabase-js</code>.
                  Ele insere novas inscrições na tabela{' '}
                  <code className="text-amber-300 font-mono">inscricoes</code> sem exigir autenticação OAuth do cliente.
                </p>
              </div>

              <form onSubmit={handleSaveCredentials} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-cinzel text-stone-400 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={credentials.url}
                    onChange={(e) => setCredentials({ ...credentials, url: e.target.value })}
                    placeholder="https://xyzproject.supabase.co"
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 font-mono text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-500">
                    Disponível no painel do Supabase em Project Settings &gt; API &gt; Project URL
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase font-cinzel text-stone-400 mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    value={credentials.anonKey}
                    onChange={(e) => setCredentials({ ...credentials, anonKey: e.target.value })}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 font-mono text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-500">
                    Chave anônima pública (anon / public key) usada com Row Level Security
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-amber-100 font-medium text-xs transition-colors"
                  >
                    Salvar e Testar
                  </button>

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testResult.loading}
                    className="px-4 py-2 rounded-lg border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testResult.loading ? 'animate-spin' : ''}`} />
                    <span>Testar Conexão</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-2 text-stone-500 hover:text-stone-300 text-xs ml-auto transition-colors"
                  >
                    Limpar
                  </button>
                </div>
              </form>

              {/* Status Test Box */}
              {testResult.message && (
                <div
                  className={`p-4 rounded-lg border text-xs flex items-start gap-3 ${
                    testResult.success
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-800 text-amber-200'
                  }`}
                >
                  {testResult.success ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block">
                      {testResult.success ? 'Conexão Estabelecida' : 'Verificação de Conexão'}
                    </span>
                    <p className="mt-1 leading-relaxed">{testResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-300">
                  Execute este script no <strong>SQL Editor</strong> do painel Supabase para criar a tabela com suporte a novas inscrições:
                </p>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-lg bg-stone-950 border border-stone-800 text-amber-200/90 font-mono text-xs overflow-x-auto leading-relaxed">
                {SUPABASE_SQL_SETUP}
              </pre>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Registros salvos localmente e enviados à API:</span>
                <span className="font-mono text-amber-400">{records.length} inscrições</span>
              </div>

              {records.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-stone-800 rounded-lg text-stone-500 text-xs">
                  Nenhuma inscrição recebida ainda neste navegador. Faça um teste preenchendo o formulário principal!
                </div>
              ) : (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {records.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-lg bg-stone-950/70 border border-stone-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-100 font-cinzel">{rec.nome}</span>
                        <span className="text-[11px] font-mono text-stone-500">
                          {new Date(rec.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-stone-400">
                        <span>E-mail: {rec.email}</span>
                        <span>Tel: {rec.telefone}</span>
                        <span className="text-amber-400/90 font-medium">
                          {rec.servico_interesse}
                        </span>
                      </div>
                      {rec.mensagem && (
                        <p className="text-stone-400 italic text-[11px] pt-1 border-t border-stone-800/60">
                          &ldquo;{rec.mensagem}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs text-stone-400">
          <span>Integração Direta Supabase REST API</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
