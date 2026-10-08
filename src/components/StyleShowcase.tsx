import React from 'react';
import { GothicDivider } from './GothicOrnament.tsx';

const GOTHIC_STYLES = [
  {
    id: 'textura',
    title: 'Textura Quadrata',
    origin: 'França & Inglaterra, Século XIV',
    description:
      'A mais rigorosa e solene das escritas góticas medievais. Caracteriza-se por hastes verticais espessas ("minims"), pés e cabeças em losango formados pelo bico quadrado da pena, compondo páginas com a densidade de uma tapeçaria tecida.',
    materials: 'Pena de ponta larga · Nanquim ferrítico de noz de galha · Pergaminho animal',
    application: 'Manuscritos litúrgicos, bíblias monumentais e diplomas canônicos.',
    image: '/src/assets/images/gothic_textura_quadrata_1791496713894.jpg',
    tag: 'Estilo Litúrgico Canônico',
  },
  {
    id: 'fraktur',
    title: 'Fraktur Imperial',
    origin: 'Sacro Império Romano Germânico, Século XVI',
    description:
      'Marcada por linhas fraturadas contrastando com arcos graciosos e elegantes floreios de filigrana ("Schnörkel"). Utilizada nas oficinas do Imperador Maximiliano I, une a disciplina gótica ao dinamismo renascentista.',
    materials: 'Bico de aço temperado · Tinta de sepia ou nanquim profundo · Papel trapo verjurado',
    application: 'Livros de oração imperiais, certidões solenes e monogramas nobres.',
    image: '/src/assets/images/gothic_fraktur_flourish_1791496723745.jpg',
    tag: 'Estilo Nobre Germânico',
  },
  {
    id: 'capitulares',
    title: 'Iluminuras & Capitulares',
    origin: 'Ateliers Monásticos, Séculos XIII a XV',
    description:
      'Letras capitulares ricamente ornadas com folha de ouro brunida 24 quilates, entrelaçados celto-germânicos, rubricas em cinábrio e pigmentos minerais de lápis-lazúli e malaquita sobre pergaminho preparado à mão.',
    materials: 'Folha de ouro 24k · Gesso de dourador · Pigmentos de pedras semipreciosas',
    application: 'Aberturas de capítulos, brasões de linhagem e peças comemorativas.',
    image: '/src/assets/images/gothic_scriptorium_hero_1791496704185.jpg',
    tag: 'Douramento Medieval Tradicional',
  },
];

export const StyleShowcase: React.FC = () => {
  return (
    <section id="estilos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-amber-500 font-cinzel">
          Tradição & Paleografia
        </span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-display text-amber-100 tracking-wide">
          As Grandes Vertentes da Caligrafia Gótica
        </h2>
        <GothicDivider className="my-4" />
        <p className="font-cormorant text-lg sm:text-xl text-stone-300 italic leading-relaxed">
          Cada escrita medieval possui seu ritmo, ângulo de pena e gravidade histórica. Conheça as formas clássicas que dominamos em nosso atelier.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
        {GOTHIC_STYLES.map((style) => (
          <article
            key={style.id}
            className="flex flex-col rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-700/60 transition-all duration-300 overflow-hidden group shadow-lg"
          >
            {/* Visual Frame */}
            <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden">
              <img
                src={style.image}
                alt={`Amostra de caligrafia ${style.title}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80" />
              <div className="absolute bottom-3 left-4 right-4 text-xs font-cinzel text-amber-300 tracking-wider">
                {style.tag}
              </div>
            </div>

            {/* Content & Typography */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Clean unboxed metadata separator */}
                <div className="flex items-center gap-2 text-xs text-amber-600/90 font-cinzel tracking-wider mb-2">
                  <span>{style.origin}</span>
                </div>

                <h3 className="text-2xl font-cinzel font-semibold text-stone-100 group-hover:text-amber-200 transition-colors">
                  {style.title}
                </h3>

                <p className="mt-3 font-cormorant text-stone-300 text-base leading-relaxed">
                  {style.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800/80 space-y-2 text-xs">
                <div>
                  <span className="text-stone-500 font-cinzel uppercase text-[10px] tracking-wider block">
                    Instrumentos & Materiais
                  </span>
                  <span className="text-stone-300 font-cormorant text-sm">{style.materials}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-cinzel uppercase text-[10px] tracking-wider block">
                    Ideal Para
                  </span>
                  <span className="text-amber-300/80 font-cormorant text-sm italic">{style.application}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
