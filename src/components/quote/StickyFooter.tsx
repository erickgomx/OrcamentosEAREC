
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
  showPrice?: boolean; // Nova prop
}

const StickyFooter: React.FC<StickyFooterProps> = ({ 
  totalPrice, onApprove, isApproved, highlight = false, showPrice = true 
}) => {
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ duration: 0.5, type: "spring", damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      {/* 
         GRADIENTE REDUZIDO
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none h-24 -top-24" />
      
      <div className="bg-neutral-950 border-t border-white/10 pb-8 pt-4 px-6 md:pb-8 md:px-12 relative z-10">
        <div className={cn(
            "max-w-4xl mx-auto flex items-center gap-4",
            showPrice ? "justify-between" : "justify-center"
        )}>
          
          <AnimatePresence mode="wait">
            {showPrice && (
              <motion.div 
                key="price"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col"
              >
                <span className="text-neutral-500 text-[10px] uppercase tracking-widest mb-0.5">Valor Estimado</span>
                <div className="text-3xl font-serif text-white flex items-baseline gap-2">
                  <AnimatedPrice value={totalPrice} />
                  <span className="text-xs font-sans text-neutral-600 font-normal">BRL</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Oculta a hint e mantém apenas o botão centralizado se showPrice for false */}
          {showPrice && (
             <motion.div 
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden sm:block text-neutral-500 text-xs italic ml-auto mr-4"
             >
                {/* Espaço para dica se necessário */}
             </motion.div>
          )}

          <div className="flex items-center gap-4">
            <Button 
                variant="primary" 
                size="lg" 
                onClick={onApprove}
                className={cn(
                    "flex items-center gap-3 px-8 py-4 shadow-[0_0_25px_rgba(220,38,38,0.4)]",
                    !showPrice && "px-12 py-5 text-lg" // Botão maior quando centralizado na intro
                )}
            >
                <span className="font-medium">Continuar</span> 
                <div className="bg-white/20 p-1 rounded-full">
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
