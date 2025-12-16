
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string; // Classes CSS opcionais para ajustar tamanho (ex: w-32, h-auto)
  animate?: boolean;  // Se 'true', ativa a animação de entrada (fade-in + scale)
}

/**
 * Componente: Logo
 * ----------------
 * Renderiza a marca EAREC vetorialmente (SVG).
 * Design: "EA" (Branco/Cinza) + Dot (Vermelho) + "REC" (Vermelho).
 * Elimina dependência de arquivos de imagem externos.
 */
const Logo: React.FC<LogoProps> = ({ className, animate = false }) => {
  
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

  const SvgContent = () => (
    <svg 
      viewBox="0 0 250 70" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
      aria-label="EAREC Logo"
    >
      {/* Texto EA - Cinza Claro/Branco */}
      <text 
        x="10" 
        y="52" 
        fontFamily="'Inter', sans-serif" 
        fontWeight="800" 
        fontSize="55" 
        fill="#E5E5E5" 
        letterSpacing="-3"
        className="drop-shadow-sm"
      >
        EA
      </text>

      {/* Ponto Central - Vermelho Marca - Aumentado r=16. Ajustado CY para 30 (centralizado com o texto) */}
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

      {/* Texto REC - Vermelho Marca */}
      <text 
        x="132" 
        y="52" 
        fontFamily="'Inter', sans-serif" 
        fontWeight="800" 
        fontSize="55" 
        fill="#DC2626" 
        letterSpacing="-3"
        className="drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]"
      >
        REC
      </text>
    </svg>
  );

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
};

export default Logo;
