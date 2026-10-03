import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import Logo from '../components/ui/Logo';
import { pageSlideVariants, slideFadeItem } from '../lib/animations';

/**
 * IntroView.tsx
 * -------------
 * Primeira tela minimalista da EAREC.
 * Foco visual cinematográfico com o mínimo de texto possível.
 */

interface IntroViewProps {
  onSelectPortfolio: () => void;
  onSelectQuote: () => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onSelectPortfolio, onSelectQuote }) => {
  return (
    <motion.div 
      variants={pageSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 py-12"
    >
      {/* Glows de Fundo Sutis */}
      <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] bg-red-900/10 blur-[140px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] bg-red-950/15 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      {/* Container Central com Mínimo de Texto */}
      <div className="relative z-10 w-full max-w-md text-center flex flex-col items-center">
        
        {/* Logo EAREC */}
        <motion.div variants={slideFadeItem} className="flex justify-center mb-8 sm:mb-10">
          <Logo className="w-56 sm:w-72" animate={true} />
        </motion.div>

        {/* Pergunta Direta */}
        <motion.div variants={slideFadeItem} className="mb-8 sm:mb-10 px-2">
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-serif font-light leading-snug drop-shadow-md">
            Você já conhece nosso trabalho<br className="hidden sm:inline" /> ou deseja um orçamento?
          </h1>
        </motion.div>

        {/* Duas Opções Minimalistas */}
        <div className="w-full flex flex-col gap-3.5 px-2">
          
          {/* Opção 1: Conhecer Trabalho */}
          <motion.div variants={slideFadeItem}>
            <motion.button 
              onClick={onSelectPortfolio}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full cursor-pointer group relative rounded-2xl overflow-hidden py-4 px-6 border border-white/15 hover:border-white/40 bg-neutral-900/80 hover:bg-neutral-800/90 transition-all duration-300 shadow-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-red-600 transition-colors shrink-0">
                  <Play size={18} className="ml-0.5 fill-current" />
                </div>
                <span className="text-base sm:text-lg font-medium text-white group-hover:text-red-100 transition-colors">
                  Conhecer Trabalho
                </span>
              </div>
              <ArrowRight size={18} className="text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </motion.button>
          </motion.div>

          {/* Divisor */}
          <motion.div variants={slideFadeItem} className="flex items-center gap-4 my-0.5 opacity-40">
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1" />
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase font-mono">Ou</span>
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1" />
          </motion.div>

          {/* Opção 2: Iniciar Orçamento */}
          <motion.div variants={slideFadeItem}>
            <motion.button 
              onClick={onSelectQuote}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full cursor-pointer group relative rounded-2xl overflow-hidden py-4 px-6 border border-red-600/40 hover:border-red-500 bg-gradient-to-r from-[#200808] to-neutral-900 transition-all duration-300 shadow-xl shadow-red-950/20 hover:shadow-[0_0_25px_rgba(220,38,38,0.3)] flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles size={18} />
                </div>
                <span className="text-base sm:text-lg font-medium text-white group-hover:text-red-100 transition-colors">
                  Iniciar Orçamento
                </span>
              </div>
              <ArrowRight size={18} className="text-red-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </motion.button>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
};

export default IntroView;