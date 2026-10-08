import React, { useState } from 'react';
import { RegistrationForm } from './components/RegistrationForm.tsx';
import { StyleShowcase } from './components/StyleShowcase.tsx';
import { GothicDivider, CornerFlourish, WaxSealEmblem } from './components/GothicOrnament.tsx';
import { DatabaseConfigModal } from './components/DatabaseConfigModal.tsx';
import { getSupabaseCredentials } from './lib/supabase.ts';
import { Feather, Shield, Sparkles, BookOpen, Database, ArrowDown } from 'lucide-react';

export default function App() {
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const { isConfigured } = getSupabaseCredentials();

  const scrollToRegistration = () => {
    const el = document.getElementById('inscricao');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-900 selection:text-amber-100 relative overflow-x-hidden">
      {/* Background Subtle Gothic Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* 1. TOP BAR CONTRACT */}
      {/* Zone 1: Wordmark | Zone 2: Nav Links | Zone 3: Primary Action */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark (Single text element in display face) */}
          <a
            href="/"
            className="text-xl sm:text-2xl font-display font-bold tracking-wider text-amber-200 hover:text-amber-100 transition-colors flex items-center gap-3 shrink-0"
          >
            <WaxSealEmblem size="sm" />
            <span className="font-display tracking-widest text-amber-100">Scriptorium Gothicus</span>
          </a>

          {/* Zone 2: Clean text nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-cinzel text-stone-300">
            <a href="#tradicao" className="hover:text-amber-300 transition-colors">
              A Tradição
            </a>
            <a href="#estilos" className="hover:text-amber-300 transition-colors">
              Estilos Góticos
            </a>
            <a href="#processo" className="hover:text-amber-300 transition-colors">
              O Ofício
            </a>
            <a href="#inscricao" className="hover:text-amber-300 transition-colors">
              Inscrição
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToRegistration}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border border-amber-600/40 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-100 text-xs sm:text-sm font-cinzel font-semibold tracking-wider uppercase transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Registrar Encomenda
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* 2. HERO SECTION: Classical Medieval Scriptorium Presence */}
        <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Calligraphy Manifesto */}
            <div className="lg:col-span-7 space-y-6">
              {/* Clean unboxed metadata with typographic separators */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-cinzel tracking-widest text-amber-500 uppercase">
                <span>Arte Medieval das Letras Negras</span>
                <span aria-hidden="true">·</span>
                <span>Atelier Secular</span>
                <span aria-hidden="true">·</span>
                <span>Obras Sob Encomenda</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-stone-100 tracking-tight leading-[1.15] text-balance">
                A Alma da Caligrafia Gótica &amp; Manuscritos Iluminados
              </h1>

              <p className="font-cormorant text-xl sm:text-2xl text-stone-300 leading-relaxed italic">
                Resgatamos a dignidade das penas medievais, do nanquim de galha de ferro e das folhas de ouro 24k para criar peças caligráficas imperecíveis, certidões nobres e monogramas históricos.
              </p>

              {/* Adjacency proof points */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-6 border-t border-stone-800/80 text-xs text-stone-400 font-cinzel">
                <div className="flex items-center gap-2">
                  <Feather className="w-4 h-4 text-amber-500" />
                  <span>Penas de Ganso & Bicos de Aço Temperado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Douramento com Ouro Autêntico</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Pergaminhos Feitos à Mão</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={scrollToRegistration}
                  className="px-6 py-3.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 font-cinzel font-bold text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Preencher Livro de Inscrições</span>
                  <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                </button>
                <a
                  href="#estilos"
                  className="px-6 py-3.5 rounded-lg border border-stone-700 hover:border-amber-600/50 bg-stone-900/60 text-stone-300 font-cinzel text-sm tracking-wider uppercase text-center transition-colors"
                >
                  Explorar Estilos Históricos
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual Artwork */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden border border-amber-800/40 shadow-2xl bg-stone-900">
                <CornerFlourish position="top-left" className="absolute top-2 left-2 z-10 text-amber-400/80" />
                <CornerFlourish position="top-right" className="absolute top-2 right-2 z-10 text-amber-400/80" />
                <CornerFlourish position="bottom-left" className="absolute bottom-2 left-2 z-10 text-amber-400/80" />
                <CornerFlourish position="bottom-right" className="absolute bottom-2 right-2 z-10 text-amber-400/80" />

                <img
                  src="/src/assets/images/gothic_scriptorium_hero_1791496704185.jpg"
                  alt="Mesa de scriptorium medieval com caligrafia gótica e penas de caligrafia"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-[1.05]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-xs font-cormorant italic text-stone-300">
                  Folio manuscrito em Textura Quadrata com letra capitular iluminada a pigmento e ouro.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SECTION: THE SACRED TRADITION & PALEOGRAPHY ESSAY */}
        <section id="tradicao" className="py-16 bg-stone-900/30 border-y border-stone-800/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.25em] text-amber-500 font-cinzel">
                A Filosofia das Formas
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-display text-amber-100">
                O Legado Secular dos Manuscritos Medievais
              </h2>
              <GothicDivider className="my-4" />
            </div>

            <div className="mt-8 font-cormorant text-stone-300 text-lg sm:text-xl leading-relaxed space-y-6">
              <p className="first-letter:text-6xl first-letter:font-gothic first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-amber-400">
                A caligrafia gótica nasceu no norte da Europa durante o apogeu do século XII, quando as catedrais de pedra erguiam-se em busca do infinito e as bibliotecas monásticas exigiam uma escrita compacta, monumental e rítmica. Ao contrário das formas arredondadas anteriores, o traço gótico quebrou a linha circular, originando a venerável família das <em>Letras Negras</em> (Blackletter).
              </p>
              <p>
                Cada palavra executada em nosso atelier obedece à mesma regra geométrica estipulada pelos grandes escribas medievais: a largura do traço da pena define o compasso exato entre letras e linhas, garantindo a solene textura têxtil que confere à página uma presença quase arquitetônica.
              </p>
            </div>
          </div>
        </section>

        {/* 4. SHOWCASE OF GOTHIC STYLES */}
        <StyleShowcase />

        {/* 5. CRAFTSMANSHIP & ATELIER PROCESS */}
        <section id="processo" className="py-20 bg-stone-900/20 border-t border-stone-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs uppercase tracking-[0.25em] text-amber-500 font-cinzel">
                Método & Disciplina
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-display text-amber-100">
                O Ritual Artesanal do Scriptorium
              </h2>
              <GothicDivider className="my-4" />
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-lg bg-stone-900/50 border border-stone-800 space-y-3">
                <span className="text-amber-500 font-cinzel text-xs tracking-widest block uppercase">
                  01. Preparação da Pauta
                </span>
                <h3 className="font-cinzel text-base text-stone-100 font-medium">
                  Traçado & Pontalete
                </h3>
                <p className="font-cormorant text-base text-stone-300 leading-relaxed">
                  Definição matemática das alturas de x, ascendentes e descendentes com ponta seca de prata sobre o pergaminho.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-stone-900/50 border border-stone-800 space-y-3">
                <span className="text-amber-500 font-cinzel text-xs tracking-widest block uppercase">
                  02. Tintas & Nanquim
                </span>
                <h3 className="font-cinzel text-base text-stone-100 font-medium">
                  Pigmentação Natural
                </h3>
                <p className="font-cormorant text-base text-stone-300 leading-relaxed">
                  Tinta ferrítica tradicional produzida com nozes de galha, sulfato de ferro e goma arábica para preto aveludado e permanente.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-stone-900/50 border border-stone-800 space-y-3">
                <span className="text-amber-500 font-cinzel text-xs tracking-widest block uppercase">
                  03. Execução Caligráfica
                </span>
                <h3 className="font-cinzel text-base text-stone-100 font-medium">
                  Ângulo de 45 Graus
                </h3>
                <p className="font-cormorant text-base text-stone-300 leading-relaxed">
                  Escrita compassada com controle milimétrico de respiração, traço por traço, segundo o ducto histórico de cada estilo.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-stone-900/50 border border-stone-800 space-y-3">
                <span className="text-amber-500 font-cinzel text-xs tracking-widest block uppercase">
                  04. Douramento & Selo
                </span>
                <h3 className="font-cinzel text-base text-stone-100 font-medium">
                  Iluminura com Ouro
                </h3>
                <p className="font-cormorant text-base text-stone-300 leading-relaxed">
                  Aplicação de mordente, assentamento de folha de ouro puro 24k, brunimento com pedra de ágata e selagem em cera nobre.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. PRIMARY REGISTRATION CHAMBER */}
        <section id="inscricao" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-stone-950 via-stone-900/40 to-stone-950">
          <div className="max-w-4xl mx-auto">
            {/* The Inscription Form Component (integrated directly with Supabase API) */}
            <RegistrationForm />
          </div>
        </section>
      </main>

      {/* 7. FOOTER: Classical Colophon with Database Connection Inspector */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-12 px-4 sm:px-6 lg:px-8 relative z-10 text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-cinzel">
          <div className="flex items-center gap-3">
            <span className="text-stone-300 font-medium tracking-wider">
              Scriptorium Gothicus
            </span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-500 font-sans">
              Oficina de Letras Negras &amp; Iluminuras Medievais
            </span>
          </div>

          {/* Database Integration Status Trigger (No public Supabase login button, but an administrative status toggle) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDbModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 transition-colors hover:border-amber-700/60 text-xs"
              title="Configuração e status do banco de dados Supabase"
            >
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {isConfigured ? 'Banco de Dados: Supabase Ativo' : 'Banco de Dados: Configurar Supabase'}
              </span>
            </button>
          </div>

          <div className="text-stone-500 text-[11px] font-sans">
            © {new Date().getFullYear()} Scriptorium Gothicus. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Database Connection & SQL Drawer Modal */}
      <DatabaseConfigModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />
    </div>
  );
}
