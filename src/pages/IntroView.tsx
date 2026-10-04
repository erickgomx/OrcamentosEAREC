import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Instagram, Zap, Sparkles } from 'lucide-react';
import Logo from '../components/ui/Logo';
import { CINE_EASE } from '../lib/animations';

interface IntroViewProps {
  onContinue: () => void;
  onQuickStart: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09, 
      delayChildren: 0.05    
    }
  },
  exit: {
    opacity: 0,
    y: -30,
    filter: 'blur(10px)',
    transition: { duration: 0.35, ease: "easeIn" }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25, filter: 'blur(6px)' }, 
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: CINE_EASE } 
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: 'blur(6px)',
    transition: { duration: 0.25 }
  }
};

const IntroView: React.FC<IntroViewProps> = ({ onContinue, onQuickStart }) => {
  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-6">
      
      {/* Ambient Cinema Lighting (Sutil e Imersivo) */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-red-950/20 blur-[140px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-neutral-800/25 blur-[160px] rounded-full pointer-events-none mix-blend-screen" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative z-10 w-full max-w-lg text-center my-auto py-8"
      >
        {/* Badge de Apresentação Cinematográfica */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-lg shadow-black/40">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-DEFAULT shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-sans text-neutral-400 tracking-[0.25em] uppercase font-medium">
              Cinema & Produção Audiovisual
            </span>
          </div>
        </motion.div>

        {/* Logo Animada com Glow Suave */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8 md:mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-DEFAULT/10 blur-2xl rounded-full scale-110 pointer-events-none" />
            <Logo className="w-64 md:w-80 relative z-10" animate />
          </div>
        </motion.div>

        {/* Bloco Central de Ações */}
        <div className="relative"> 
            <div className="relative z-10 flex flex-col gap-5 p-2">
                
                <motion.div variants={itemVariants} className="mb-2">
                    <h2 className="text-white text-lg md:text-xl font-serif leading-snug drop-shadow-md">
                        Você já conhece nosso trabalho<br/> ou deseja fazer um orçamento?
                    </h2>
                </motion.div>

                {/* Opção 1: Iniciar Orçamento (Sólido, Elegante e com Micro-interações) */}
                <motion.div variants={itemVariants}>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-[0.25em] mb-2.5 font-medium font-sans">
                        Simulador Instantâneo
                    </p>
                    <motion.div 
                        onClick={onQuickStart} 
                        className="cursor-pointer group relative rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl border border-white/15 hover:border-white/40 bg-neutral-900/90 hover:bg-neutral-850 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] backdrop-blur-sm"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className="relative z-20 w-full flex items-center justify-center gap-3 py-5 px-6">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-DEFAULT/20 group-hover:border-brand-DEFAULT/40 transition-colors duration-300">
                                <Zap size={20} className="text-neutral-200 group-hover:text-brand-DEFAULT group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <span className="font-sans font-semibold text-base md:text-lg text-neutral-100 group-hover:text-white transition-colors tracking-wide">
                                Iniciar Orçamento
                            </span>
                            <div className="ml-auto flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={18} className="text-neutral-400 group-hover:text-white group-hover:translate-x-1.5 transition-transform duration-300" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Divisor Silver Refinado */}
                <motion.div variants={itemVariants} className="flex items-center gap-4 opacity-50 my-1">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                    <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-medium font-sans">Ou</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                </motion.div>

                {/* Opção 2: Instagram EAREC (Sólido, Refinado) */}
                <motion.div variants={itemVariants}>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-[0.25em] mb-2.5 font-medium font-sans">
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
                        <div className="relative z-20 w-full flex items-center justify-center gap-3 py-5 px-6">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-colors duration-300">
                                <Instagram size={20} className="text-neutral-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <span className="font-sans font-semibold text-base md:text-lg text-neutral-100 group-hover:text-white transition-colors tracking-wide">
                                Instagram EAREC
                            </span>
                            <div className="ml-auto flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={18} className="text-neutral-400 group-hover:text-white group-hover:translate-x-1.5 transition-transform duration-300" />
                            </div>
                        </div>
                    </motion.a>
                </motion.div>
            </div>
        </div>

        <motion.p variants={itemVariants} className="mt-10 text-neutral-500/60 text-[10px] tracking-[0.4em] uppercase font-medium drop-shadow-sm font-sans">
            Experiência de Cinema • EAREC Mídia
        </motion.p>

      </motion.div>
    </div>
  );
};

export default IntroView;