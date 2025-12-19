
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string; // Classes CSS opcionais para ajustar tamanho (ex: w-32, h-auto)
  animate?: boolean;  // Se 'true', ativa a animação de entrada (fade-in + scale)
}

// Movido para fora para evitar recriação e reset de animação a cada render do pai
const SvgContent = React.memo(() => (
  <svg 
    viewBox="0 0 250 70" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
    aria-label="EAREC Logo"
  >
    {/* Texto EA - Cinza Claro/Branco - Ajustado para Negrito Extra (900) */}
    <text 
      x="10" 
      y="52" 
      fontFamily="'Inter', sans-serif" 
      fontWeight="900" 
      fontSize="55" 
      fill="#E5E5E5" 
      letterSpacing="-3"
      className="drop-shadow-sm"
    >
      EA
    </text>

    {/* Ponto Central - Vermelho Marca */}
    <motion.circle 
      cx="105" 
      cy="33" 
      r="16" 
      fill="#DC2626" 
      className="drop-shadow-[0_0_10px_rgba(220,38,38,0.9)]"
      animate={{ opacity: [1, 0.6, 1] }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    />

    {/* Texto REC - Vermelho Marca - Ajustado para Fino (300) conforme solicitado */}
    <text 
      x="132" 
      y="52" 
      fontFamily="'Inter', sans-serif" 
      fontWeight="300" 
      fontSize="55" 
      fill="#DC2626" 
      letterSpacing="-3"
      className="drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]"
    >
      REC
    </text>
  </svg>
));

/**
 * Componente: Logo
 * ----------------
 * Renderiza a marca EAREC vetorialmente (SVG).
 * Design: "EA" (Branco/Cinza) + Dot (Vermelho) + "REC" (Vermelho).
 * Elimina dependência de arquivos de imagem externos.
 * 
 * ATENÇÃO: Memoizado para evitar reinício de animação em re-renders do pai.
 */
const Logo: React.FC<LogoProps> = React.memo(({ className, animate = false }) => {
  
  const containerVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      filter: 'blur(10px)' 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  if (!animate) {
    return (
      <div className={cn("relative select-none", className)}>
        <SvgContent />
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn("relative select-none", className)}
    >
      <SvgContent />
    </motion.div>
  );
});

export default Logo;
