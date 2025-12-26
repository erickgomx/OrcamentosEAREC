
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
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ duration: 0.5, type: "spring", damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      {/* Gradiente de transição para o conteúdo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none h-12 -top-12" />
      
      <div className="bg-neutral-950 border-t border-white/10 pb-6 pt-4 px-4 md:pb-8 md:px-12 relative z-10">
        {/* ALTERAÇÃO: justify-center usado sempre para centralizar o bloco todo */}
        <div className={cn(
            "max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12"
        )}>
          
          <AnimatePresence mode="wait">
            {showPrice && (
              <motion.div 
                key="price"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center sm:items-end w-full sm:w-auto"
              >
                <span className="text-neutral-500 text-[10px] uppercase tracking-widest mb-0.5">Valor Estimado</span>
                <div className="text-2xl md:text-3xl font-serif text-white flex items-baseline gap-2">
                  <AnimatedPrice value={totalPrice} />
                  <span className="text-xs font-sans text-neutral-600 font-normal">BRL</span>
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
                    "flex items-center justify-center gap-3 transition-all duration-300 w-full sm:w-auto", // Full width on mobile
                    !disabled ? "shadow-[0_0_25px_rgba(220,38,38,0.4)]" : "opacity-50 cursor-not-allowed shadow-none grayscale",
                    !showPrice ? "px-12 py-5 text-lg" : "px-6 py-3.5 md:px-8 md:py-4"
                )}
            >
                <span className="font-medium whitespace-nowrap text-sm md:text-base">{customLabel || "Continuar"}</span> 
                <div className={cn("p-1 rounded-full shrink-0", disabled ? "bg-white/5" : "bg-white/20")}>
                    <ChevronRight size={16} />
                </div>
            </Button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default StickyFooter;
