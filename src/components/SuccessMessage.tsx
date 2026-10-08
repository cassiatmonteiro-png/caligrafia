import React, { useState } from 'react';
import { WaxSealEmblem, CornerFlourish, GothicDivider } from './GothicOrnament.tsx';
import { Check, Copy, RefreshCw, Feather, ShieldCheck } from 'lucide-react';
import { InscriptionData } from '../lib/supabase.ts';

interface SuccessMessageProps {
  data: InscriptionData;
  recordId: string;
  isSupabaseSynced: boolean;
  onReset: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  data,
  recordId,
  isSupabaseSynced,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyDetails = async () => {
    const textToCopy = `[Registro Scriptorium Gothicus]
Protocolo: ${recordId}
Nome: ${data.nome}
E-mail: ${data.email}
Telefone: ${data.telefone}
Interesse: ${data.servico_interesse || 'Geral'}
Data: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-xl bg-stone-900/90 border border-amber-600/40 shadow-2xl backdrop-blur-sm text-stone-200">
      {/* Decorative corner flourishes */}
      <CornerFlourish position="top-left" className="absolute top-3 left-3" />
      <CornerFlourish position="top-right" className="absolute top-3 right-3" />
      <CornerFlourish position="bottom-left" className="absolute bottom-3 left-3" />
      <CornerFlourish position="bottom-right" className="absolute bottom-3 right-3" />

      {/* Wax Seal Centerpiece */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 relative">
          <WaxSealEmblem size="lg" />
          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-md">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        <span className="text-xs tracking-[0.25em] uppercase text-amber-500 font-cinzel">
          Registro Selado & Confirmado
        </span>

        <h3 className="mt-2 text-2xl sm:text-3xl font-display text-amber-100 tracking-wide">
          Inscrição Concluída com Honra
        </h3>

        <GothicDivider className="my-4" />

        <p className="font-cormorant text-lg sm:text-xl text-stone-300 italic max-w-lg leading-relaxed">
          &ldquo;Assim como a tinta de noz de galha grava perpetuamente o pergaminho, tuas informações foram devidamente registradas em nosso scriptorium.&rdquo;
        </p>
      </div>

      {/* Inscription Folio Card Details */}
      <div className="mt-6 p-4 sm:p-5 rounded-lg bg-stone-950/70 border border-amber-800/30 text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800 gap-2">
          <span className="text-stone-400 font-cinzel text-xs uppercase tracking-wider">
            Código de Registro
          </span>
          <span className="font-mono text-xs sm:text-sm text-amber-300 font-medium tracking-wider">
            {recordId}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-stone-300">
          <div>
            <span className="text-xs text-stone-500 block font-cinzel">Nome do Cliente</span>
            <span className="font-medium text-stone-200">{data.nome}</span>
          </div>

          <div>
            <span className="text-xs text-stone-500 block font-cinzel">Contato E-mail</span>
            <span className="font-medium text-stone-200">{data.email}</span>
          </div>

          <div>
            <span className="text-xs text-stone-500 block font-cinzel">Telefone / WhatsApp</span>
            <span className="font-medium text-stone-200">{data.telefone}</span>
          </div>

          <div>
            <span className="text-xs text-stone-500 block font-cinzel">Estilo / Obra</span>
            <span className="font-medium text-amber-200/90">{data.servico_interesse || 'Geral / Manuscrito'}</span>
          </div>
        </div>

        {data.mensagem && (
          <div className="mt-3 pt-3 border-t border-stone-800">
            <span className="text-xs text-stone-500 block font-cinzel">Detalhes Solicitados</span>
            <p className="text-xs sm:text-sm text-stone-300 italic mt-0.5">&ldquo;{data.mensagem}&rdquo;</p>
          </div>
        )}

        {/* Database Transmission Status */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isSupabaseSynced
                ? 'Conexão Supabase: Dados inseridos na tabela remota'
                : 'Base de dados: Registro local verificado e seguro'}
            </span>
          </div>
          <span className="text-amber-500/80 font-mono text-[11px]">
            {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Explanatory Next Steps */}
      <div className="mt-6 p-4 rounded-lg bg-amber-950/20 border border-amber-900/30 flex items-start gap-3">
        <Feather className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-stone-300 leading-relaxed font-cormorant text-base">
          Nosso mestre calígrafo examinará sua solicitação, preparará a amostra de tintas e tipografia histórica, e entrará em contato via WhatsApp ou e-mail dentro do prazo de <strong>24 horas úteis</strong>.
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleCopyDetails}
          type="button"
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copiado para a Área de Transferência!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-stone-400" />
              <span>Copiar Dados do Registro</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          type="button"
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-amber-600/40 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-100 text-xs sm:text-sm font-medium shadow-md transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Realizar Nova Inscrição</span>
        </button>
      </div>
    </div>
  );
};
