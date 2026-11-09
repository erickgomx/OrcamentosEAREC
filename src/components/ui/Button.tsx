// ============================================================================
// EAREC AUDIOVISUAL - BOTÃO INTERATIVO REUTILIZÁVEL (Button.tsx)
// ============================================================================
// Olá, dev! 👋
// Este é o componente padrão de botão da UI da EAREC.
// 
// RECURSOS PRINCIPAIS:
// 1. Integrado com Framer Motion (`HTMLMotionProps<"button">`) com microinterações
//    nativas de escala ao passar o mouse (`whileHover`) e ao clicar (`whileTap`).
// 2. Três variantes visuais:
//    - 'primary': Vermelho oficial com glow característico da marca.
//    - 'secondary': Estilo contornado (outline) elegante com borda translúcida.
//    - 'glass': Efeito vidro fosco (glassmorphism) translúcido com `backdrop-blur-md`.
// 3. Três tamanhos padrão ('sm', 'md', 'lg') altamente responsivos.
// ============================================================================

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  // Configurações de estilo para cada variante visual
  const variants = {
    primary: "bg-[#DC2626] text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-[#DC2626] hover:bg-[#B91C1C] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] font-bold",
    secondary: "bg-transparent border border-stone-300 dark:border-white/20 text-stone-800 dark:text-white hover:bg-stone-100 dark:hover:bg-white/10 hover:border-stone-400 dark:hover:border-white/40",
    glass: "bg-stone-100/80 dark:bg-white/10 backdrop-blur-md border border-stone-200 dark:border-white/15 text-stone-800 dark:text-white hover:bg-stone-200 dark:hover:bg-white/20"
  };

  // Espaçamentos e tipografia escalonados
  const sizes = {
    sm: "px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide",
    md: "px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold tracking-wide",
    lg: "px-8 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-bold tracking-wide"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative rounded-full transition-all duration-300 flex items-center justify-center font-sans",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
