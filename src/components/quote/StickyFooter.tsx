// ============================================================================
// EAREC AUDIOVISUAL - BARRA DE RODAPÉ FLUTUANTE DE CONVERSÃO (StickyFooter.tsx)
// ============================================================================
// Olá, dev! 👋
// Este é o rodapé fixo inferior que acompanha o usuário ao longo de toda a navegação.
//
// CARACTERÍSTICAS PRINCIPAIS:
// 1. Exibição em tempo real do preço total estimado (`AnimatedPrice`).
// 2. Botão de Call to Action (CTA) em destaque para avançar no funil ("Continuar" / "Avançar").
// 3. Suporte a SafeArea do iOS (`pb-[max(0.75rem,env(safe-area-inset-bottom))]`).
// 4. Efeito de Glassmorphism translúcido adaptável aos modos Dark e Light.
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import AnimatedPrice from '../ui/AnimatedPrice';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StickyFooterProps {
  totalPrice: number;
  onApprove: () => void;
  isApproved: boolean;
  highlight?: boolean;
  showPrice?: boolean; 
  disabled?: boolean;
  customLabel?: string;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ 
  totalPrice, onApprove, isApproved, highlight = false, showPrice = true, disabled = false, customLabel
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none p-3 sm:p-5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {/* Sombra / Gradiente para contraste suave com o conteúdo ao fundo */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F7F7F5]/95 via-[#F7F7F5]/70 to-transparent dark:from-[#080808] dark:via-[#080808]/75 dark:to-transparent -z-10 pointer-events-none" />

      {/* Caixa Flutuante com backdrop-blur */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl mx-auto pointer-events-auto"
      >
        <div className="bg-white/95 dark:bg-[#121212]/95 backdrop-blur-2xl border border-stone-200/90 dark:border-white/[0.08] rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_12px_45px_-5px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.85)] relative overflow-hidden transition-colors duration-300">
          {/* Glow de Borda Superior */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/60 to-transparent" />
          
          <div className={cn(
              "flex items-center gap-3 sm:gap-6",
              showPrice ? "justify-between" : "justify-center"
          )}>
            
            {/* Lado Esquerdo: Valor Estimado com Odômetro Animado */}
            <AnimatePresence mode="wait">
              {showPrice && (
                <motion.div 
                  key="price"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col min-w-0 pr-1 text-left"
                >
                  <span className="text-stone-500 dark:text-neutral-400 text-[10px] sm:text-xs uppercase tracking-wider font-semibold truncate">
                    Valor Estimado
                  </span>
                  <div className="text-xl sm:text-3xl font-price font-bold text-stone-900 dark:text-neutral-100 flex items-baseline gap-1 sm:gap-1.5 leading-tight mt-0.5">
                    <AnimatedPrice value={totalPrice} />
                    <span className="text-[10px] sm:text-xs font-sans text-neutral-500 dark:text-neutral-400 font-medium">BRL</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lado Direito: Botão de Avanço / CTA */}
            <div className={cn("flex items-center gap-3 shrink-0", !showPrice && "w-full justify-center")}>
              <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={onApprove}
                  disabled={disabled}
                  className={cn(
                      "flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300", 
                      !disabled 
                        ? "shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]" 
                        : "opacity-50 cursor-not-allowed shadow-none grayscale",
                      !showPrice 
                        ? "w-full sm:w-auto px-6 py-3 sm:px-10 sm:py-4 text-sm sm:text-base font-bold max-w-md" 
                        : "px-4 py-2.5 sm:px-7 sm:py-3.5 text-xs sm:text-base font-bold whitespace-nowrap"
                  )}
              >
                  <span className="tracking-wide">{customLabel || "Continuar"}</span> 
                  <div className={cn("p-1 sm:p-1.5 rounded-full shrink-0", disabled ? "bg-white/5" : "bg-white/20")}>
                      <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
              </Button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StickyFooter;
