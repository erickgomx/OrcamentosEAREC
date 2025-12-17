
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Componente SVG: Tira de Filme (Film Strip)
 * Renderiza uma tira vertical infinita usando patterns SVG.
 */
const FilmStripTexture = ({ className, speed = 2, direction = 1 }: { className?: string, speed?: number, direction?: number }) => (
  <svg
    viewBox="0 0 100 800"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    {/* Definição do Padrão de Furos (Sprockets) e Quadros */}
    <defs>
      <pattern id="film-holes" x="0" y="0" width="100" height="60" patternUnits="userSpaceOnUse">
         {/* Furos Esquerdos */}
         <rect x="2" y="15" width="12" height="20" rx="2" fill="currentColor" fillOpacity="0.4" />
         {/* Furos Direitos */}
         <rect x="86" y="15" width="12" height="20" rx="2" fill="currentColor" fillOpacity="0.4" />
         {/* Linha divisória de quadro (Frame Line) */}
         <line x1="18" y1="59" x2="82" y2="59" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      </pattern>
    </defs>

    {/* Fundo sutil da tira (Estático relativo ao container) */}
    <rect x="15" width="70" height="800" fill="currentColor" fillOpacity="0.05" />
    
    {/* Bordas da área de imagem */}
    <line x1="18" y1="0" x2="18" y2="800" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="82" y1="0" x2="82" y2="800" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    
    {/* 
        ANIMAÇÃO DE ROLAGEM (Rolling Effect)
        O rect preenchido com o padrão move-se de 0 a -60 (altura do padrão).
    */}
    <motion.rect 
      x="0"
      width="100" 
      height="1000" 
      fill="url(#film-holes)"
      animate={{ y: direction > 0 ? [0, -60] : [-60, 0] }}
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-screen">
      {/* 
        === FILME DE CÂMERA VERMELHO (GLOBAL) === 
        Opacidade reduzida em 30% (de 1.0 para 0.7) para maior sutileza.
      */}
      
      {/* Tira Superior Direita */}
      <motion.div
        initial={{ opacity: 0, x: 100, rotate: -35 }}
        animate={{ 
            opacity: 0.7, // Reduzido de 1.0 para 0.7
            x: 0,
            y: [0, -20, 0] 
        }}
        transition={{ 
            opacity: { duration: 1.5 },
            y: { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute -top-20 -right-20 md:right-0 w-32 md:w-48 h-[120vh] text-brand-DEFAULT"
      >
         <FilmStripTexture className="w-full h-full drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]" speed={45} direction={1} />
      </motion.div>

      {/* Tira Inferior Esquerda */}
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -35 }}
        animate={{ 
            opacity: 0.7, // Reduzido de 1.0 para 0.7
            x: 0,
            y: [0, 20, 0] 
        }}
        transition={{ 
            opacity: { duration: 1.5 },
            y: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
        className="absolute -bottom-20 -left-20 md:left-0 w-32 md:w-48 h-[120vh] text-brand-DEFAULT"
      >
         <FilmStripTexture className="w-full h-full drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]" speed={60} direction={-1} />
      </motion.div>

      {/* CAMADA DE ESCURECIMENTO */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
    </div>
  );
};

export default BackgroundFilmStrips;
