
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MousePointerClick, SlidersHorizontal, MessageCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { fadeInUp, staggerContainer } from '../lib/animations';

interface ConfirmationViewProps {
  onContinue: () => void;
}

const ConfirmationView: React.FC<ConfirmationViewProps> = ({ onContinue }) => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
      if (step < 3) {
          setStep(step + 1);
      } else {
          onContinue();
      }
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto px-6 py-12 bg-[#0a0a0a]">
      
      {/* Container Principal */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg my-auto"
      >
        
        {/* Card Estilizado */}
        <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden min-h-[480px] flex flex-col">
            
            {/* Efeito de luz sutil no topo */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-800 via-brand-DEFAULT to-neutral-800 opacity-50" />

            {/* Cabeçalho */}
            <motion.div variants={fadeInUp} className="text-center mb-6 md:mb-8">
                {/* Logo no Topo (Substituindo o Ícone) */}
                <div className="flex justify-center mb-6"> 
                    <Logo className="w-32 md:w-40" animate />
                </div>
                <h1 className="font-serif text-2xl md:text-4xl text-white leading-tight">
                    COMO <span className="text-brand-DEFAULT font-medium">FUNCIONA?</span>
                </h1>
                <p className="text-neutral-400 text-sm mt-2">Entenda seu caminho até a contratação</p>
            </motion.div>

            {/* Timeline de Passos */}
            <div className="relative mb-8 pl-1 md:pl-2 flex-grow">
                
                {/* Linha Conectora Vertical - Centralizada no quadrado w-16 (64px/2 = 32px) / md:w-20 (80px/2 = 40px) */}
                <div className="absolute left-[36px] md:left-[46px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-DEFAULT via-brand-DEFAULT/30 to-transparent opacity-30" />

                <AnimatePresence mode="popLayout">
                    {step >= 1 && (
                        <motion.div 
                            key="step-1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative flex gap-5 md:gap-7 items-center md:items-start group mb-8 md:mb-10"
                        >
                            <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-black border border-brand-DEFAULT/50 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)] shrink-0">
                                <MousePointerClick size={28} className="text-white md:w-10 md:h-10" />
                            </div>
                            <div className="pt-1">
                                <h3 className="text-white font-bold text-base md:text-lg uppercase tracking-wide flex items-center mb-1">
                                    <span className="text-[#DC2626] text-2xl md:text-4xl mr-3 md:mr-4 font-serif font-bold leading-none">1.</span>
                                    Iniciar
                                </h3>
                                <p className="text-neutral-400 text-sm md:text-base leading-relaxed mt-1">
                                    Acesse o menu inicial e inicie seu <span className="text-white font-medium">Orçamento</span> para simular valores na hora.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step >= 2 && (
                        <motion.div 
                            key="step-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative flex gap-5 md:gap-7 items-center md:items-start group mb-8 md:mb-10"
                        >
                            <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-black border border-brand-DEFAULT/50 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)] shrink-0">
                                <SlidersHorizontal size={28} className="text-white md:w-10 md:h-10" />
                            </div>
                            <div className="pt-1">
                                <h3 className="text-white font-bold text-base md:text-lg uppercase tracking-wide flex items-center mb-1">
                                    <span className="text-[#DC2626] text-2xl md:text-4xl mr-3 md:mr-4 font-serif font-bold leading-none">2.</span>
                                    Configure
                                </h3>
                                <p className="text-neutral-400 text-sm md:text-base leading-relaxed mt-1">
                                    Navegue por <span className="text-white font-medium">Categorias</span>, adicione serviços extras e revise o <span className="text-white font-medium">Resumo</span> completo.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step >= 3 && (
                        <motion.div 
                            key="step-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative flex gap-5 md:gap-7 items-center md:items-start group"
                        >
                            <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-black border border-brand-DEFAULT/50 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)] shrink-0">
                                <MessageCircle size={28} className="text-white md:w-10 md:h-10" />
                            </div>
                            <div className="pt-1">
                                <h3 className="text-white font-bold text-base md:text-lg uppercase tracking-wide flex items-center mb-1">
                                    <span className="text-[#DC2626] text-2xl md:text-4xl mr-3 md:mr-4 font-serif font-bold leading-none">3.</span>
                                    Finalize no WhatsApp
                                </h3>
                                <p className="text-neutral-400 text-sm md:text-base leading-relaxed mt-1">
                                    Você será redirecionado ao WhatsApp para confirmar a disponibilidade da data com a equipe.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Botão de Ação */}
            <motion.div variants={fadeInUp} className="mt-auto">
                <Button 
                    onClick={handleNext} 
                    size="lg"
                    className="w-full shadow-[0_0_25px_rgba(220,38,38,0.25)] group font-medium tracking-wide"
                >
                    {step < 3 ? 'PRÓXIMO PASSO' : 'ENTENDI, VAMOS LÁ'}
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </motion.div>

        </div>
      </motion.div>

      {/* Background Decorativo */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-DEFAULT/5 blur-[150px] rounded-full" />
      </div>
    </div>
  );
};

export default ConfirmationView;
