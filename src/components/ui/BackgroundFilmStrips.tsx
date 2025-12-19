
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Componente SVG: Tira de Filme (Film Strip)
 * Renderiza uma tira vertical infinita com animação de rolagem contínua.
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
         Ajuste Visual: Reduzido de 60 para 30 para criar mais quadros (maior densidade).
         Isso faz parecer que tem "mais frames" visíveis na tira.
      */}
      <pattern id="film-holes" x="0" y="0" width="100" height="30" patternUnits="userSpaceOnUse">
         {/* Furos Esquerdos */}
         <rect x="5" y="8" width="10" height="14" rx="2" fill="currentColor" fillOpacity="0.6" />
         {/* Furos Direitos */}
         <rect x="85" y="8" width="10" height="14" rx="2" fill="currentColor" fillOpacity="0.6" />
         {/* Linha divisória de quadro (Frame Line) */}
         <line x1="20" y1="29" x2="80" y2="29" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      </pattern>
    </defs>

    {/* Fundo sutil da tira */}
    <rect x="18" width="64" height="100%" fill="currentColor" fillOpacity="0.03" />
    
    {/* Bordas da área de imagem */}
    <line x1="20" y1="0" x2="20" y2="100%" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="80" y1="0" x2="80" y2="100%" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    
    {/* 
        ANIMAÇÃO DE ROLAGEM (Infinite Scroll)
        O rect é preenchido com o padrão. Movemos o Y do rect
        ciclando a cada 30 unidades (altura do padrão) para um loop perfeito.
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
      <div className="absolute -top-[20%] left-[10%] md:left-[20%] w-24 md:w-32 h-[150vh] border-x border-white/5 bg-neutral-900/20 text-brand-DEFAULT/10 transform -rotate-12 backdrop-blur-[1px]">
         <FilmStripTexture className="w-full h-full opacity-60" speed={18} direction={1} />
      </div>

      {/* 
        Tira Direita - Diagonal Subindo (Contra-fluxo)
        Rotacionada -12 graus para manter o paralelismo visual (///).
      */}
      <div className="absolute -top-[20%] right-[5%] md:right-[15%] w-20 md:w-28 h-[150vh] border-x border-white/5 bg-neutral-900/20 text-brand-DEFAULT/10 transform -rotate-12 backdrop-blur-[1px]">
         <FilmStripTexture className="w-full h-full opacity-40" speed={22} direction={-1} />
      </div>

      {/* Vignette Global para focar no centro e suavizar as bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_90%)] pointer-events-none" />
    </div>
  );
};

export default BackgroundFilmStrips;
