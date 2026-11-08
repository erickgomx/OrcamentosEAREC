// ============================================================================
// EAREC AUDIOVISUAL - BOTÃO DE ALTERNÂNCIA DE TEMA (ThemeToggle.tsx)
// ============================================================================
// Olá, dev! 👋
// Este componente é o botão flutuante elegante que permite ao cliente alternar
// entre o modo escuro (Dark) e o modo claro (Light).
//
// DESTAQUES VISUAIS:
// 1. Efeito glassmorphism translúcido com `backdrop-blur-xl`.
// 2. Animação de rotação e escala com `Framer Motion` e `AnimatePresence`.
// 3. Indicador luminoso pulsante com a cor da marca (vermelho no escuro, âmbar no claro).
// 4. Adaptabilidade responsiva (texto completo em telas grandes e abreviação em mobile).
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, showLabel = true }) => {
  // Consome o tema atual e a função de alternância do ThemeContext
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
      title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
      className={cn(
        "group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full",
        "border backdrop-blur-xl transition-all duration-300 select-none",
        "cursor-pointer shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-DEFAULT",
        isDark
          ? "bg-neutral-900/80 hover:bg-neutral-800/90 border-white/10 hover:border-brand-DEFAULT/40 text-neutral-300 hover:text-white shadow-black/40"
          : "bg-white/90 hover:bg-white border-neutral-200 hover:border-brand-DEFAULT/40 text-neutral-700 hover:text-neutral-950 shadow-neutral-300/40",
        className
      )}
    >
      {/* Glow de fundo sutil com a cor da marca */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-md -z-10",
          isDark ? "bg-brand-DEFAULT/15" : "bg-brand-DEFAULT/10"
        )} 
      />

      {/* Ícone Animado com AnimatePresence e Framer Motion */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="dark-icon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center text-amber-200"
            >
              <Moon size={18} strokeWidth={2} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]" />
            </motion.div>
          ) : (
            <motion.div
              key="light-icon"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center text-amber-500"
            >
              <Sun size={18} strokeWidth={2} className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label Elegante e Responsivo */}
      {showLabel && (
        <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
          <span className="hidden sm:inline-block">
            {isDark ? "Modo Escuro" : "Modo Claro"}
          </span>
          <span className="sm:hidden font-mono uppercase text-[10px]">
            {isDark ? "Dark" : "Light"}
          </span>
          {/* Ponto indicador de status */}
          <span 
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors duration-300",
              isDark ? "bg-brand-DEFAULT shadow-[0_0_6px_var(--brand-glow)]" : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]"
            )} 
          />
        </div>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
