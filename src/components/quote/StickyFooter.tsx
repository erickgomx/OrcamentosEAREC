
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import AnimatedPrice from '../ui/AnimatedPrice';
import { ArrowRight } from 'lucide-react';

interface StickyFooterProps {
  totalPrice: number;
  onApprove: () => void;
  isApproved: boolean;
  highlight?: boolean;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ totalPrice, onApprove, isApproved, highlight = false }) => {
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ duration: 0.5, type: "spring", damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      {/* 
         GRADIENTE REDUZIDO DRASTICAMENTE 
         Antes: h-32 -top-32 (muito alto e invasivo)
         Agora: h-12 -top-12 (sutil, apenas para separar visualmente)
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none h-12 -top-12" />
      
      <div className="bg-neutral-950/90 backdrop-blur-xl border-t border-white/10 pb-6 pt-4 px-4 md:pb-8 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
            <span className="text-neutral-400 text-[10px] md:text-xs uppercase tracking-widest mb-0.5">Total Estimado</span>
            <div className="text-2xl md:text-4xl font-serif text-white flex items-baseline gap-2">
              <AnimatedPrice value={totalPrice} />
              <span className="text-xs md:text-sm font-sans text-neutral-500 font-normal">/ BRL</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto justify-center sm:justify-end">
            <div className="hidden lg:block text-right text-xs text-neutral-500 leading-relaxed">
              Válido por 7 dias.<br/>
              Termos e condições aplicáveis.
            </div>
            
            <AnimatePresence mode="wait">
              {!isApproved ? (
                <motion.div
                  key="action-btn"
                  className="rounded-full w-full sm:w-auto"
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
                    className="w-full sm:min-w-[200px] flex items-center justify-center gap-2 py-3 md:py-4 text-sm md:text-base"
                  >
                    Revisar Contrato <ArrowRight size={18} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="success-msg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-500 px-6 py-3 bg-green-500/10 rounded-full border border-green-500/20 w-full sm:w-auto justify-center"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="font-medium whitespace-nowrap">Proposta Aprovada</span>
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
