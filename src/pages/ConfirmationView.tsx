// ============================================================================
// EAREC AUDIOVISUAL - GUIA INTERATIVO "COMO FUNCIONA" (ConfirmationView.tsx)
// ============================================================================
// Olá, dev! 👋
// Esta tela funciona como um mini-onboarding interativo em 3 passos para ensinar
// ao cliente como ele monta e contrata o serviço com a EAREC:
// 
// PASSO 1 - Iniciar: Simulação dos valores na hora.
// PASSO 2 - Configure: Escolha das categorias e pacotes personalizados.
// PASSO 3 - Finalize no WhatsApp: Redirecionamento direto com a proposta pré-formatada.
// ============================================================================

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
  // Estado local para avançar os 3 passos da timeline
  const [step, setStep] = useState(1);

  const handleNext = () => {
      if (step < 3) {
          setStep(step + 1);
      } else {
          onContinue();
      }
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto px-6 py-12 bg-[#F7F7F5] dark:bg-[#080808] transition-colors duration-300">
      
      {/* Container Principal */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg my-auto"
      >
        
        {/* Card Estilizado com glassmorphism e bordas refinadas */}
        <div className="bg-white/95 dark:bg-[#121212]/80 backdrop-blur-xl border border-stone-200/90 dark:border-white/[0.08] p-6 md:p-8 rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden min-h-[550px] md:min-h-[600px] flex flex-col transition-colors duration-300">
            
            {/* Efeito de luz sutil no topo */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-800 via-brand-DEFAULT to-neutral-800 opacity-50" />

            {/* Cabeçalho */}
            <motion.div variants={fadeInUp} className="text-center mb-6 md:mb-8">
                {/* Logo no Topo (Substituindo o Ícone) */}
                <div className="flex justify-center mb-4 md:mb-6"> 
                    <Logo className="w-44 md:w-56 h-auto" animate />
                </div>
                <h1 className="font-serif text-2xl md:text-4xl text-stone-900 dark:text-neutral-100 leading-tight">
                    COMO <span className="text-brand-DEFAULT font-medium">FUNCIONA?</span>
                </h1>
                <p className="text-stone-600 dark:text-neutral-400 text-sm mt-2">Entenda seu caminho até a contratação</p>
            </motion.div>

            {/* Timeline de Passos */}
            <div className="relative mb-6 pl-1 md:pl-2 h-[350px] sm:h-[320px] md:h-[380px] flex-grow">
                
                {/* Linha Conectora Vertical */}
                <div className="absolute left-[28px] md:left-[32px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-DEFAULT via-brand-DEFAULT/30 to-transparent opacity-30" />

                <AnimatePresence mode="popLayout">
                    {/* Passo 1: Iniciar */}
                    {step >= 1 && (
                        <motion.div 
                            key="step-1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative flex gap-4 md:gap-6 items-center md:items-start group mb-5 md:mb-6"
                        >
                            <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-stone-50 dark:bg-[#181818] border border-brand-DEFAULT/40 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)] shrink-0">
                                <MousePointerClick size={24} className="text-stone-900 dark:text-neutral-100 md:w-8 md:h-8" />
                            </div>
                            <div className="pt-0">
                                <h2 className="text-stone-900 dark:text-neutral-100 font-bold text-sm md:text-base uppercase tracking-wide flex items-baseline mb-1">
                                    <span className="text-[#DC2626] text-xl md:text-3xl mr-2 md:mr-3 font-serif font-bold translate-y-0.5">1.</span>
                                    Iniciar
                                </h2>
                                <p className="text-stone-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed mt-1">
                                    Acesse o menu inicial e inicie seu <span className="text-stone-950 dark:text-white font-medium">Orçamento</span> para simular valores na hora.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Passo 2: Configure */}
                    {step >= 2 && (
                        <motion.div 
                            key="step-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative flex gap-4 md:gap-6 items-center md:items-start group mb-5 md:mb-6"
                        >
                            <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-stone-50 dark:bg-[#181818] border border-brand-DEFAULT/40 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)] shrink-0">
                                <SlidersHorizontal size={24} className="text-stone-900 dark:text-neutral-100 md:w-8 md:h-8" />
                            </div>
                            <div className="pt-0">
                                <h2 className="text-stone-900 dark:text-neutral-100 font-bold text-sm md:text-base uppercase tracking-wide flex items-baseline mb-1">
                                    <span className="text-[#DC2626] text-xl md:text-3xl mr-2 md:mr-3 font-serif font-bold translate-y-0.5">2.</span>
                                    Configure
                                </h2>
                                <p className="text-stone-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed mt-1">
                                    Navegue por <span className="text-stone-950 dark:text-white font-medium">Categorias</span>, adicione serviços extras e revise o <span className="text-stone-950 dark:text-white font-medium">Resumo</span> completo.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Passo 3: Finalize no WhatsApp */}
                    {step >= 3 && (
                        <motion.div 
                            key="step-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative flex gap-4 md:gap-6 items-center md:items-start group"
                        >
                            <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-stone-50 dark:bg-[#181818] border border-brand-DEFAULT/40 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)] shrink-0">
                                <MessageCircle size={24} className="text-stone-900 dark:text-neutral-100 md:w-8 md:h-8" />
                            </div>
                            <div className="pt-0">
                                <h2 className="text-stone-900 dark:text-neutral-100 font-bold text-sm md:text-base uppercase tracking-wide flex items-baseline mb-1">
                                    <span className="text-[#DC2626] text-xl md:text-3xl mr-2 md:mr-3 font-serif font-bold translate-y-0.5">3.</span>
                                    Finalize no WhatsApp
                                </h2>
                                <p className="text-stone-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed mt-1">
                                    Você será redirecionado ao WhatsApp para confirmar a disponibilidade da data com a equipe.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Botão de Ação: Avança o passo da timeline */}
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

      {/* Background Decorativo com glow circular suave */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-DEFAULT/5 blur-[150px] rounded-full" />
      </div>
    </div>
  );
};

export default ConfirmationView;
