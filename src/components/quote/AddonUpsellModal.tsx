
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Timer, Check, X, ArrowRight, Sparkles, Zap } from 'lucide-react';
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            {/* Faixa Superior Decorativa */}
            <div className="h-2 w-full bg-gradient-to-r from-brand-DEFAULT via-red-500 to-brand-DEFAULT" />

            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex p-3 bg-brand-DEFAULT/10 rounded-full text-brand-DEFAULT mb-4"
                >
                    <Sparkles size={28} />
                </motion.div>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">Eleve seu Projeto</h2>
                <p className="text-neutral-400 max-w-md mx-auto text-sm md:text-base">
                  Deseja adicionar estes recursos exclusivos para uma experiência audiovisual completa?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Cartão Drone */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => setAddDrone(!addDrone)}
                  className={cn(
                    "cursor-pointer p-6 rounded-2xl border-2 transition-all relative overflow-hidden group",
                    addDrone 
                      ? "bg-brand-DEFAULT/10 border-brand-DEFAULT shadow-[0_0_30px_rgba(220,38,38,0.2)]" 
                      : "bg-white/5 border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                        "p-3 rounded-xl",
                        addDrone ? "bg-brand-DEFAULT text-white" : "bg-white/10 text-neutral-400"
                    )}>
                        <Plane size={24} />
                    </div>
                    {addDrone && (
                        <div className="bg-brand-DEFAULT text-white p-1 rounded-full">
                            <Check size={14} />
                        </div>
                    )}
                  </div>
                  <h3 className="text-white font-medium text-lg mb-1">Drone (Aéreo)</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed mb-4">
                    Imagens aéreas cinematográficas em 4K para perspectivas épicas.
                  </p>
                  <p className="text-brand-DEFAULT font-bold text-sm">+ {formatCurrency(250)}</p>
                </motion.div>

                {/* Cartão Tempo Real */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => setAddRealTime(!addRealTime)}
                  className={cn(
                    "cursor-pointer p-6 rounded-2xl border-2 transition-all relative overflow-hidden group",
                    addRealTime 
                      ? "bg-brand-DEFAULT/10 border-brand-DEFAULT shadow-[0_0_30px_rgba(220,38,38,0.2)]" 
                      : "bg-white/5 border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                        "p-3 rounded-xl",
                        addRealTime ? "bg-brand-DEFAULT text-white" : "bg-white/10 text-neutral-400"
                    )}>
                        <Timer size={24} />
                    </div>
                    {addRealTime && (
                        <div className="bg-brand-DEFAULT text-white p-1 rounded-full">
                            <Check size={14} />
                        </div>
                    )}
                  </div>
                  <h3 className="text-white font-medium text-lg mb-1">Tempo Real</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed mb-4">
                    Fotos tratadas e enviadas instantaneamente durante o evento.
                  </p>
                  <p className="text-brand-DEFAULT font-bold text-sm">+ {formatCurrency(600)}</p>
                </motion.div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="text-center">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-1">Novo Total Estimado</p>
                    <div className="text-3xl text-white font-serif">
                        <AnimatedPrice value={totalPrice} />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <button 
                        onClick={onConfirm}
                        className="flex-1 px-8 py-4 bg-transparent border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all text-sm font-medium uppercase tracking-widest"
                    >
                        Pular e Ver Resumo
                    </button>
                    <Button 
                        onClick={onConfirm}
                        className="flex-1 py-4 text-sm font-bold shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                    >
                        CONFIRMAR E CONTINUAR
                        <ArrowRight size={18} className="ml-2" />
                    </Button>
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
