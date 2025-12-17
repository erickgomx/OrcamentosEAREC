
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Componente SVG: Tira de Filme (Film Strip)
 * Renderiza uma tira vertical infinita usando patterns SVG.
 */
const FilmStripTexture = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 800"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    {/* Fundo sutil da tira */}
    <rect x="15" width="70" height="800" fill="currentColor" fillOpacity="0.05" />
    
    {/* Bordas da área de imagem */}
    <line x1="18" y1="0" x2="18" y2="800" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="82" y1="0" x2="82" y2="800" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />

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
    
    {/* Aplicação do padrão */}
    <rect width="100" height="800" fill="url(#film-holes)" />
  </svg>
);

const BackgroundFilmStrips: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-screen">
      {/* 
        === FILME DE CÂMERA VERMELHO (GLOBAL) === 
        Opacidade ajustada para manter visibilidade em fundo preto.
      */}
      
      {/* Tira Superior Direita */}
      <motion.div
        initial={{ opacity: 0, x: 100, rotate: -35 }}
        animate={{ 
            opacity: 1, 
            x: 0,
            y: [0, -20, 0] // Flutuação lenta
        }}
        transition={{ 
            opacity: { duration: 1.5 },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        // Opacidade aumentada para 25% para melhor contraste no preto
        className="absolute -top-20 -right-20 md:right-0 w-32 md:w-48 h-[120vh] text-brand-DEFAULT opacity-25"
      >
         <FilmStripTexture className="w-full h-full drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
      </motion.div>

      {/* Tira Inferior Esquerda */}
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -35 }}
        animate={{ 
            opacity: 1, 
            x: 0,
            y: [0, 20, 0] // Flutuação lenta inversa
        }}
        transition={{ 
            opacity: { duration: 1.5 },
            y: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
        // Opacidade aumentada para 25%
        className="absolute -bottom-20 -left-20 md:left-0 w-32 md:w-48 h-[120vh] text-brand-DEFAULT opacity-25"
      >
         <FilmStripTexture className="w-full h-full drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
      </motion.div>

      {/* Elemento de brilho central global - Reduzido para não "lavar" o preto */}
      <motion.div 
        animate={{ opacity: [0.02, 0.08, 0.02] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-brand-DEFAULT/5 rounded-full blur-[120px] pointer-events-none" 
      />
    </div>
  );
};

export default BackgroundFilmStrips;
