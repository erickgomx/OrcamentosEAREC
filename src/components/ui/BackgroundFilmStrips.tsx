
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Componente SVG: Tira de Filme (Film Strip)
 * Renderiza uma tira vertical infinita com animação de rolagem contínua.
 * Refinado para realismo: Furos tipo "Kodak" e bordas de película.
 */
const FilmStripTexture = ({ className, speed = 5, direction = 1 }: { className?: string, speed?: number, direction?: number }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    {/* Definição do Padrão de Furos (Sprockets) e Quadros */}
    <defs>
      {/* 
         Padrão 35mm Realista:
         - Altura de repetição: 30 unidades.
         - Furos: Retângulos arredondados, levemente menores e mais espaçados.
      */}
      <pattern id="film-holes" x="0" y="0" width="100" height="30" patternUnits="userSpaceOnUse">
         
         {/* Furos Esquerdos (Sprockets) */}
         <rect x="6" y="8" width="8" height="12" rx="1.5" fill="currentColor" fillOpacity="0.8" />
         
         {/* Furos Direitos (Sprockets) */}
         <rect x="86" y="8" width="8" height="12" rx="1.5" fill="currentColor" fillOpacity="0.8" />
         
         {/* Linha divisória de quadro (Frame Line) - Mais sutil */}
         <line x1="22" y1="29.5" x2="78" y2="29.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      </pattern>
    </defs>

    {/* Fundo da tira (Película) - Levemente mais escuro que os furos */}
    <rect x="0" y="0" width="100" height="100%" fill="currentColor" fillOpacity="0.05" />
    
    {/* Bordas laterais sólidas para delimitar a película */}
    <line x1="2" y1="0" x2="2" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
    <line x1="98" y1="0" x2="98" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />

    {/* Área da Imagem (Zona segura central) */}
    <rect x="20" width="60" height="100%" fill="currentColor" fillOpacity="0.02" />
    <line x1="20" y1="0" x2="20" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
    <line x1="80" y1="0" x2="80" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
    
    {/* 
        ANIMAÇÃO DE ROLAGEM (Infinite Scroll)
    */}
    <motion.rect 
      x="0"
      y="-30" // Começa com offset do tamanho do padrão
      width="100" 
      height="200%" 
      fill="url(#film-holes)"
      animate={{ 
        y: direction > 0 ? [0, -30] : [-30, 0] 
      }}
      transition={{ 
        repeat: Infinity, 
        ease: "linear", 
        duration: speed 
      }}
    />
  </svg>
);

const BackgroundFilmStrips: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-screen bg-black">
      
      {/* 
        Tira Esquerda - Diagonal Descendo 
        Rotacionada -12 graus para cruzar a tela diagonalmente.
      */}
      <div className="absolute -top-[20%] left-[10%] md:left-[20%] w-24 md:w-32 h-[150vh] border-x border-white/5 bg-neutral-900/10 text-brand-DEFAULT/10 transform -rotate-12 backdrop-blur-[0.5px]">
         <FilmStripTexture className="w-full h-full opacity-70" speed={18} direction={1} />
      </div>

      {/* 
        Tira Direita - Diagonal Subindo (Contra-fluxo)
        Rotacionada -12 graus para manter o paralelismo visual (///).
      */}
      <div className="absolute -top-[20%] right-[5%] md:right-[15%] w-20 md:w-28 h-[150vh] border-x border-white/5 bg-neutral-900/10 text-brand-DEFAULT/10 transform -rotate-12 backdrop-blur-[0.5px]">
         <FilmStripTexture className="w-full h-full opacity-50" speed={22} direction={-1} />
      </div>

      {/* Vignette Global para focar no centro e suavizar as bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_90%)] pointer-events-none" />
    </div>
  );
};

export default BackgroundFilmStrips;
