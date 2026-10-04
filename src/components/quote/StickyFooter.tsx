
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import AnimatedPrice from '../ui/AnimatedPrice';
import { ArrowRight, ChevronRight } from 'lucide-react';
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
    <motion.div 
      initial={{ y: 80, opacity: 0, filter: 'blur(6px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      exit={{ y: 80, opacity: 0, filter: 'blur(6px)' }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      {/* Gradiente de transição para o conteúdo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none h-12 -top-12" />
      
      <div className="bg-neutral-950/90 backdrop-blur-xl border-t border-white/10 pb-6 pt-4 px-4 md:pb-8 md:px-12 relative z-10 shadow-[0_-10px_35px_rgba(0,0,0,0.6)]">
        {/* ALTERAÇÃO: justify-center usado sempre para centralizar o bloco todo */}
        <div className={cn(
            "max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12"
        )}>
          
          <AnimatePresence mode="wait">
            {showPrice && (
              <motion.div 
                key="price"
                initial={{ opacity: 0, x: -15, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -15, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center sm:items-end w-full sm:w-auto"
              >
                <span className="text-neutral-400 text-xs uppercase tracking-wider font-semibold mb-0.5">Valor Estimado</span>
                <div className="text-2xl sm:text-3xl md:text-4xl font-price font-bold text-white flex items-baseline gap-2">
                  <AnimatedPrice value={totalPrice} />
                  <span className="text-xs sm:text-sm font-sans text-neutral-500 font-medium">BRL</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={cn("flex items-center gap-4 w-full sm:w-auto justify-center")}>
            <Button 
                variant="primary" 
                size="lg" 
                onClick={onApprove}
                disabled={disabled}
                className={cn(
                    "flex items-center justify-center gap-3 transition-all duration-300 w-full sm:w-auto", 
                    !disabled ? "shadow-[0_0_25px_rgba(220,38,38,0.4)]" : "opacity-50 cursor-not-allowed shadow-none grayscale",
                    !showPrice ? "px-10 py-4 sm:px-12 sm:py-5 text-base sm:text-lg" : "px-7 py-3.5 sm:px-9 sm:py-4"
                )}
            >
                <span className="font-bold whitespace-nowrap text-base sm:text-lg tracking-wide">{customLabel || "Continuar"}</span> 
                <div className={cn("p-1.5 rounded-full shrink-0", disabled ? "bg-white/5" : "bg-white/20")}>
                    <ChevronRight size={18} />
                </div>
            </Button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default StickyFooter;
