import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import AnimatedPrice from '../ui/AnimatedPrice';

interface StickyFooterProps {
  totalPrice: number;
  onApprove: () => void;
  isApproved: boolean;
  highlight?: boolean; // Nova prop para incentivar o clique
}

const StickyFooter: React.FC<StickyFooterProps> = ({ totalPrice, onApprove, isApproved, highlight = false }) => {
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 2, duration: 0.8, type: "spring" }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none h-32 -top-32" />
      
      <div className="bg-neutral-950/80 backdrop-blur-xl border-t border-white/10 pb-6 pt-4 px-6 md:pb-8 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-col">
            <span className="text-neutral-400 text-xs uppercase tracking-widest mb-1">Total Estimated Investment</span>
            <div className="text-3xl md:text-4xl font-serif text-white flex items-baseline gap-2">
              <AnimatedPrice value={totalPrice} />
              <span className="text-sm font-sans text-neutral-500 font-normal">/ BRL</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right text-xs text-neutral-500 leading-relaxed">
              Válido por 7 dias.<br/>
              Termos e condições aplicáveis.
            </div>
            
            <AnimatePresence mode="wait">
              {!isApproved ? (
                <motion.div
                  key="action-btn"
                  className="rounded-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={highlight ? {
                    opacity: 1, 
                    scale: 1,
                    boxShadow: [
                      "0 0 0px rgba(220, 38, 38, 0)",
                      "0 0 30px rgba(220, 38, 38, 0.6)",
                      "0 0 0px rgba(220, 38, 38, 0)"
                    ]
                  } : { 
                    opacity: 1, 
                    scale: 1,
                    boxShadow: "0 0 0px rgba(0,0,0,0)"
                  }}
                  transition={{
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                    boxShadow: highlight ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } : { duration: 0.3 }
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={onApprove}
                    className="min-w-[200px]"
                  >
                    Aprovar Proposta
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="success-msg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  // Adicionado pr-6 e mr-4 para evitar que encoste na borda em telas menores
                  className="flex items-center gap-2 text-green-500 px-8 py-3 bg-green-500/10 rounded-full border border-green-500/20 mr-4 md:mr-0"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="font-medium">Proposta Aprovada</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default StickyFooter;