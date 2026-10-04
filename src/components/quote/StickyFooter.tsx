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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative z-30 mt-8 sm:mt-12 pb-10 sm:pb-14 px-4"
    >
      <div className="max-w-3xl mx-auto bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.7)] relative overflow-hidden">
        {/* Glow de Borda Superior */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/60 to-transparent" />
        
        <div className={cn(
            "flex flex-col sm:flex-row items-center gap-5 sm:gap-8",
            showPrice ? "justify-between" : "justify-center"
        )}>
          
          <AnimatePresence mode="wait">
            {showPrice && (
              <motion.div 
                key="price"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center sm:items-start w-full sm:w-auto text-center sm:text-left"
              >
                <span className="text-neutral-400 text-xs uppercase tracking-wider font-semibold mb-0.5">
                  Valor Estimado
                </span>
                <div className="text-3xl sm:text-4xl font-price font-bold text-white flex items-baseline gap-2">
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
                    !showPrice ? "px-10 py-4 sm:px-12 sm:py-5 text-base sm:text-lg" : "px-8 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg"
                )}
            >
                <span className="font-bold whitespace-nowrap tracking-wide">{customLabel || "Continuar"}</span> 
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
