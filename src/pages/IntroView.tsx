import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Instagram, Zap, Sparkles } from 'lucide-react';
import Logo from '../components/ui/Logo';
import { CINE_EASE, organicItemVariants, pageContainerVariants } from '../lib/animations';

interface IntroViewProps {
  onContinue: () => void;
  onQuickStart: () => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onContinue, onQuickStart }) => {
  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-6">
      
      {/* Ambient Cinema Lighting (Sutil e Imersivo) */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-red-950/20 blur-[140px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-neutral-800/25 blur-[160px] rounded-full pointer-events-none mix-blend-screen" />

      <motion.div 
        variants={pageContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 w-full max-w-lg text-center my-auto py-8"
      >
        {/* Badge de Apresentação Cinematográfica */}
        <motion.div variants={organicItemVariants} className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-lg shadow-black/40">
            <span className="w-2 h-2 rounded-full bg-brand-DEFAULT shadow-[0_0_10px_rgba(220,38,38,0.9)] animate-pulse" />
            <span className="text-xs sm:text-sm font-sans text-neutral-300 tracking-[0.2em] uppercase font-semibold">
              Cinema & Produção Audiovisual
            </span>
          </div>
        </motion.div>

        {/* Logo Animada com Glow Suave */}
        <motion.div variants={organicItemVariants} className="flex justify-center mb-8 md:mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-DEFAULT/10 blur-2xl rounded-full scale-110 pointer-events-none" />
            <Logo className="w-64 sm:w-72 md:w-80 relative z-10" animate />
          </div>
        </motion.div>

        {/* Bloco Central de Ações */}
        <div className="relative"> 
            <div className="relative z-10 flex flex-col gap-6 p-2">
                
                <motion.div variants={organicItemVariants} className="mb-2">
                    <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-serif leading-snug drop-shadow-md">
                        Você já conhece nosso trabalho<br/> ou deseja fazer um orçamento?
                    </h2>
                </motion.div>

                {/* Opção 1: Iniciar Orçamento (Sólido, Elegante e com Micro-interações) */}
                <motion.div variants={organicItemVariants}>
                    <p className="text-neutral-400 text-xs sm:text-sm uppercase tracking-[0.2em] mb-2.5 font-semibold font-sans">
                        Simulador Instantâneo
                    </p>
                    <motion.div 
                        onClick={onQuickStart} 
                        className="cursor-pointer group relative rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl border border-white/15 hover:border-white/40 bg-neutral-900/90 hover:bg-neutral-850 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] backdrop-blur-sm"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className="relative z-20 w-full flex items-center justify-center gap-4 py-5 px-6 sm:py-6 sm:px-8">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-DEFAULT/20 group-hover:border-brand-DEFAULT/40 transition-colors duration-300 shrink-0">
                                <Zap size={22} className="text-neutral-200 group-hover:text-brand-DEFAULT group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <span className="font-sans font-semibold text-base sm:text-lg md:text-xl text-neutral-100 group-hover:text-white transition-colors tracking-wide">
                                Iniciar Orçamento
                            </span>
                            <div className="ml-auto flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={20} className="text-neutral-400 group-hover:text-white group-hover:translate-x-1.5 transition-transform duration-300" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Divisor Silver Refinado */}
                <motion.div variants={organicItemVariants} className="flex items-center gap-4 opacity-50 my-1">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                    <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase font-semibold font-sans">Ou</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                </motion.div>

                {/* Opção 2: Instagram EAREC (Sólido, Refinado) */}
                <motion.div variants={organicItemVariants}>
                    <p className="text-neutral-400 text-xs sm:text-sm uppercase tracking-[0.2em] mb-2.5 font-semibold font-sans">
                        Portfólio & Bastidores
                    </p>
                    <motion.a 
                        href="https://www.instagram.com/earecmidia/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative group block w-full rounded-2xl overflow-hidden border border-white/15 hover:border-white/40 transition-all duration-300 shadow-2xl bg-neutral-900/90 hover:bg-neutral-850 hover:shadow-[0_0_25px_rgba(255,255,255,0.06)] backdrop-blur-sm"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className="relative z-20 w-full flex items-center justify-center gap-4 py-5 px-6 sm:py-6 sm:px-8">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-colors duration-300 shrink-0">
                                <Instagram size={22} className="text-neutral-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <span className="font-sans font-semibold text-base sm:text-lg md:text-xl text-neutral-100 group-hover:text-white transition-colors tracking-wide">
                                Instagram EAREC
                            </span>
                            <div className="ml-auto flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={20} className="text-neutral-400 group-hover:text-white group-hover:translate-x-1.5 transition-transform duration-300" />
                            </div>
                        </div>
                    </motion.a>
                </motion.div>
            </div>
        </div>

        <motion.p variants={organicItemVariants} className="mt-10 text-neutral-400/80 text-xs sm:text-sm tracking-[0.3em] uppercase font-medium drop-shadow-sm font-sans">
            Experiência de Cinema • EAREC Mídia
        </motion.p>

      </motion.div>
    </div>
  );
};

export default IntroView;