
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Timer, Check, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { cn, formatCurrency } from '../../lib/utils';
import { modalVariants } from '../../lib/animations';
import AnimatedPrice from '../ui/AnimatedPrice';

interface AddonUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  addDrone: boolean;
  setAddDrone: (val: boolean) => void;
  addRealTime: boolean;
  setAddRealTime: (val: boolean) => void;
  totalPrice: number;
}

const AddonUpsellModal: React.FC<AddonUpsellModalProps> = ({
  isOpen, onClose, onConfirm,
  addDrone, setAddDrone,
  addRealTime, setAddRealTime,
  totalPrice
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl w-full max-w-[340px] md:max-w-md overflow-hidden"
          >
            {/* Faixa Superior sutil */}
            <div className="h-1 w-full bg-brand-DEFAULT shadow-[0_0_10px_#DC2626]" />

            <div className="p-4 md:p-6">
              <div className="text-center mb-4 md:mb-6">
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex p-1.5 bg-brand-DEFAULT/10 rounded-full text-brand-DEFAULT mb-2"
                >
                    <Sparkles size={16} />
                </motion.div>
                <h2 className="font-serif text-xl md:text-2xl text-white mb-1">Eleve seu Projeto</h2>
                <p className="text-neutral-500 max-w-[240px] mx-auto text-[10px] md:text-xs">
                  Recursos exclusivos para uma experiência audiovisual completa.
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                {/* Cartão Drone - Compacto */}
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAddDrone(!addDrone)}
                  className={cn(
                    "cursor-pointer p-3 rounded-xl border transition-all relative group flex items-center gap-3",
                    addDrone 
                      ? "bg-brand-DEFAULT/5 border-brand-DEFAULT/40" 
                      : "bg-white/5 border-white/5"
                  )}
                >
                  <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      addDrone ? "bg-brand-DEFAULT text-white" : "bg-white/5 text-neutral-500"
                  )}>
                      <Plane size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-xs">Drone (Aéreo)</h3>
                    <p className="text-brand-DEFAULT font-bold text-[10px]">+ {formatCurrency(250)}</p>
                  </div>
                  {addDrone && (
                      <div className="bg-brand-DEFAULT text-white p-0.5 rounded-full">
                          <Check size={10} />
                      </div>
                  )}
                </motion.div>

                {/* Cartão Tempo Real - Compacto */}
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAddRealTime(!addRealTime)}
                  className={cn(
                    "cursor-pointer p-3 rounded-xl border transition-all relative group flex items-center gap-3",
                    addRealTime 
                      ? "bg-brand-DEFAULT/5 border-brand-DEFAULT/40" 
                      : "bg-white/5 border-white/5"
                  )}
                >
                  <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      addRealTime ? "bg-brand-DEFAULT text-white" : "bg-white/5 text-neutral-500"
                  )}>
                      <Timer size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-xs">Fotos em Tempo Real</h3>
                    <p className="text-brand-DEFAULT font-bold text-[10px]">+ {formatCurrency(600)}</p>
                  </div>
                  {addRealTime && (
                      <div className="bg-brand-DEFAULT text-white p-0.5 rounded-full">
                          <Check size={10} />
                      </div>
                  )}
                </motion.div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Total Estimado</p>
                    <div className="text-xl text-white font-serif">
                        <AnimatedPrice value={totalPrice} />
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <Button 
                        onClick={onConfirm}
                        className="w-full py-3 text-xs font-bold shadow-lg shadow-brand-DEFAULT/10"
                    >
                        CONFIRMAR
                        <ArrowRight size={14} className="ml-2" />
                    </Button>
                    <button 
                        onClick={onConfirm}
                        className="w-full py-2 text-neutral-500 hover:text-white transition-colors text-[9px] uppercase tracking-widest"
                    >
                        Pular e Ver Resumo
                    </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddonUpsellModal;
