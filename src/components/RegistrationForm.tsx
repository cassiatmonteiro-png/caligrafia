import React, { useState } from 'react';
import { CornerFlourish, GothicDivider } from './GothicOrnament.tsx';
import { submitInscription, InscriptionData } from '../lib/supabase.ts';
import { SuccessMessage } from './SuccessMessage.tsx';
import { Feather, Send, User, Mail, Phone, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

const SERVICE_OPTIONS = [
  'Manuscrito Iluminado em Pergaminho com Ouro 24k',
  'Brasão Heráldico & Monograma Caligráfico',
  'Certificado Nobre / Diploma Oficial em Textura Quadrata',
  'Poema & Citação Solene em Fraktur Germânica',
  'Identidade Visual de Marca com Tipografia Gótica Medieval',
  'Workshop & Aulas Particulares de Letras Negras',
];

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<InscriptionData>({
    nome: '',
    email: '',
    telefone: '',
    servico_interesse: SERVICE_OPTIONS[0],
    mensagem: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    data?: InscriptionData;
    recordId?: string;
    isSupabaseSynced?: boolean;
    errorMessage?: string;
  } | null>(null);

  // Phone masking helper: (XX) XXXXX-XXXX
  const formatPhoneNumber = (val: string) => {
    const numbers = val.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: formatted }));
    if (errors.telefone) {
      setErrors((prev) => ({ ...prev, telefone: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Por favor, informe seu nome completo.';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'O nome deve conter ao menos 3 caracteres.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, informe seu endereço de e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Formato de e-mail inválido (ex: nome@dominio.com).';
    }

    const rawPhoneDigits = formData.telefone.replace(/\D/g, '');
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Por favor, informe seu telefone com DDD.';
    } else if (rawPhoneDigits.length < 10) {
      newErrors.telefone = 'Informe um número válido com DDD (mínimo 10 dígitos).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitInscription(formData);

      if (result.success) {
        setSubmissionResult({
          success: true,
          data: { ...formData },
          recordId: result.recordId,
          isSupabaseSynced: result.mode === 'supabase',
        });
      } else {
        // Even if remote insert failed, we captured locally with warning
        setSubmissionResult({
          success: false,
          data: { ...formData },
          recordId: result.recordId,
          isSupabaseSynced: false,
          errorMessage: result.error || 'Houve uma falha momentânea ao contatar a API remota.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar envio';
      setSubmissionResult({
        success: false,
        errorMessage: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      servico_interesse: SERVICE_OPTIONS[0],
      mensagem: '',
    });
    setErrors({});
    setSubmissionResult(null);
  };

  // If successfully submitted, display the illuminated parchment confirmation receipt!
  if (submissionResult?.success && submissionResult.data && submissionResult.recordId) {
    return (
      <SuccessMessage
        data={submissionResult.data}
        recordId={submissionResult.recordId}
        isSupabaseSynced={Boolean(submissionResult.isSupabaseSynced)}
        onReset={handleResetForm}
      />
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-xl bg-stone-900/90 border border-amber-600/40 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
      {/* Corner ornamental flourishes */}
      <CornerFlourish position="top-left" className="absolute top-3 left-3" />
      <CornerFlourish position="top-right" className="absolute top-3 right-3" />
      <CornerFlourish position="bottom-left" className="absolute bottom-3 left-3" />
      <CornerFlourish position="bottom-right" className="absolute bottom-3 right-3" />

      {/* Medieval Header Banner */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-2 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-400 mb-3">
          <Feather className="w-5 h-5" />
        </div>

        <span className="text-xs tracking-[0.25em] uppercase text-amber-500 font-cinzel block">
          Livro de Registros & Encomendas
        </span>

        <h2 className="mt-1 text-2xl sm:text-3xl font-display text-amber-100 tracking-wide">
          Registro no Scriptorium
        </h2>

        <GothicDivider className="my-4" />

        <p className="font-cormorant text-base sm:text-lg text-stone-300 italic max-w-lg mx-auto leading-relaxed">
          Preencha seus dados para solicitar manuscritos solenes, orçamentos para obras originais ou vagas em nossa confraria de letras negras.
        </p>
      </div>

      {submissionResult?.errorMessage && (
        <div className="mt-6 p-4 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium block font-cinzel text-xs uppercase tracking-wide">
              Aviso de Transmissão
            </span>
            <p className="text-xs text-rose-300 mt-0.5">{submissionResult.errorMessage}</p>
          </div>
        </div>
      )}

      {/* The Inscription Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Campo: Nome Completo */}
        <div>
          <label htmlFor="nome" className="flex items-center gap-2 text-xs uppercase tracking-wider font-cinzel text-amber-200/90 mb-2">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>Nome Completo</span>
            <span className="text-amber-500 font-bold">*</span>
          </label>
          <div className="relative">
            <input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value });
                if (errors.nome) setErrors({ ...errors, nome: '' });
              }}
              placeholder="Ex: Rodrigo de Toledo ou D. Beatriz da Silva"
              className={`w-full px-4 py-3 rounded-lg bg-stone-950/80 border text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-cormorant text-lg ${
                errors.nome ? 'border-rose-500/80' : 'border-stone-700/80 focus:border-amber-500'
              }`}
            />
          </div>
          {errors.nome && (
            <p className="mt-1.5 text-xs text-rose-400 font-sans flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.nome}
            </p>
          )}
        </div>

        {/* Linha dupla: E-mail e Telefone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Campo: E-mail */}
          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-xs uppercase tracking-wider font-cinzel text-amber-200/90 mb-2">
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span>E-mail para Resposta</span>
              <span className="text-amber-500 font-bold">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="seu.email@dominio.com"
              className={`w-full px-4 py-3 rounded-lg bg-stone-950/80 border text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-sans text-sm ${
                errors.email ? 'border-rose-500/80' : 'border-stone-700/80 focus:border-amber-500'
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-400 font-sans flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Campo: Telefone */}
          <div>
            <label htmlFor="telefone" className="flex items-center gap-2 text-xs uppercase tracking-wider font-cinzel text-amber-200/90 mb-2">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Telefone / WhatsApp</span>
              <span className="text-amber-500 font-bold">*</span>
            </label>
            <input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={handlePhoneChange}
              maxLength={15}
              placeholder="(11) 99876-5432"
              className={`w-full px-4 py-3 rounded-lg bg-stone-950/80 border text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-mono text-sm tracking-wider ${
                errors.telefone ? 'border-rose-500/80' : 'border-stone-700/80 focus:border-amber-500'
              }`}
            />
            {errors.telefone && (
              <p className="mt-1.5 text-xs text-rose-400 font-sans flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.telefone}
              </p>
            )}
          </div>
        </div>

        {/* Campo: Estilo ou Tipo de Encomenda */}
        <div>
          <label htmlFor="servico_interesse" className="flex items-center gap-2 text-xs uppercase tracking-wider font-cinzel text-amber-200/90 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Obra ou Interesse Caligráfico</span>
          </label>
          <select
            id="servico_interesse"
            value={formData.servico_interesse}
            onChange={(e) => setFormData({ ...formData, servico_interesse: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-stone-950/90 border border-stone-700/80 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-cormorant text-base"
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-stone-900 text-stone-200 py-2">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Campo: Mensagem opcional */}
        <div>
          <label htmlFor="mensagem" className="flex items-center justify-between text-xs uppercase tracking-wider font-cinzel text-amber-200/90 mb-2">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Dedicatória, Dimensões ou Detalhes da Encomenda</span>
            </span>
            <span className="text-stone-500 font-normal lowercase tracking-normal font-sans">(opcional)</span>
          </label>
          <textarea
            id="mensagem"
            rows={3}
            value={formData.mensagem}
            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
            placeholder="Ex: Gostaria de orçar um texto em latim de 50 palavras em folha de pergaminho A3 com letra capitular decorada..."
            className="w-full px-4 py-2.5 rounded-lg bg-stone-950/80 border border-stone-700/80 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-cormorant text-base resize-none"
          />
        </div>

        {/* Selo de Envio / Botão de Transmissão para a API */}
        {/* IMPORTANTE: Sem botão de Supabase, apenas botão elegante de envio de dados */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-stone-950 font-cinzel font-bold text-sm sm:text-base tracking-widest uppercase shadow-xl hover:shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-3 border border-amber-400/30"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5 text-stone-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Gravando no Banco de Dados...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>Selar e Enviar Inscrição</span>
              </>
            )}
          </button>
        </div>

        {/* Security & Confidentiality Notice */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-stone-500 font-sans tracking-wide">
            Seus dados são protegidos por sigilo e transmitidos diretamente ao banco de dados com criptografia.
          </p>
        </div>
      </form>
    </div>
  );
};
