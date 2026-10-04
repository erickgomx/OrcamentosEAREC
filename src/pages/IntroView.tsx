import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, Zap } from 'lucide-react';
import Logo from '../components/ui/Logo';
import { cn } from '../lib/utils';
import { organicItemVariants, pageContainerVariants } from '../lib/animations';

interface IntroViewProps {
  onContinue: () => void;
  onQuickStart: () => void;
  onOpenPortfolio?: () => void;
}

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 36, 
  delay = 250,
  className = "" 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);

    let charIndex = 0;
    let intervalId: NodeJS.Timeout | null = null;

    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        if (charIndex < text.length) {
          charIndex++;
          setDisplayedText(text.slice(0, charIndex));
        } else {
          setIsTypingComplete(true);
          if (intervalId) clearInterval(intervalId);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay]);

  return (
    <h2 className={className}>
      <span>{displayedText}</span>
      <motion.span
        animate={{ opacity: isTypingComplete ? 0 : [1, 0, 1] }}
        transition={{ 
          duration: 0.8, 
          repeat: isTypingComplete ? 0 : Infinity, 
          ease: "easeInOut" 
        }}
        className={cn(
          "inline-block w-[2.5px] h-[1.1em] ml-1.5 align-middle bg-brand-DEFAULT shadow-[0_0_8px_rgba(220,38,38,0.8)] rounded-full",
          isTypingComplete ? "opacity-0" : "opacity-100"
        )}
      />
    </h2>
  );
};

const IntroView: React.FC<IntroViewProps> = ({ onContinue, onQuickStart, onOpenPortfolio }) => {
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
        {/* Logo Animada com Glow Suave (Sem badge superior por excesso) */}
        <motion.div variants={organicItemVariants} className="flex justify-center mb-8 md:mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-DEFAULT/10 blur-2xl rounded-full scale-110 pointer-events-none" />
            <Logo className="w-64 sm:w-72 md:w-80 relative z-10" animate />
          </div>
        </motion.div>

        {/* Bloco Central de Ações */}
        <div className="relative"> 
            <div className="relative z-10 flex flex-col gap-6 p-2">
                
                {/* Texto com Efeito de Digitação Cinematográfico */}
                <motion.div variants={organicItemVariants} className="mb-2">
                    <TypewriterText 
                        text="Você já conhece nosso trabalho ou deseja fazer um orçamento?"
                        className="text-white text-xl sm:text-2xl md:text-3xl font-serif leading-snug drop-shadow-md min-h-[3.6rem] sm:min-h-[4.2rem]"
                    />
                </motion.div>

                {/* Opção 1: Iniciar Orçamento (Sólido, Elegante com Texto Rigorosamente Centralizado) */}
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
                        <div className="relative z-20 w-full flex items-center justify-between py-5 px-5 sm:py-6 sm:px-7">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-DEFAULT/20 group-hover:border-brand-DEFAULT/40 transition-colors duration-300 shrink-0">
                                <Zap size={22} className="text-neutral-200 group-hover:text-brand-DEFAULT group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <span className="flex-1 text-center font-sans font-semibold text-base sm:text-lg md:text-xl text-neutral-100 group-hover:text-white transition-colors tracking-wide px-2">
                                Iniciar Orçamento
                            </span>
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
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

                {/* Opção 2: Instagram EAREC (Sólido, Refinado com Texto Rigorosamente Centralizado) */}
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
                        <div className="relative z-20 w-full flex items-center justify-between py-5 px-5 sm:py-6 sm:px-7">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-colors duration-300 shrink-0">
                                <Instagram size={22} className="text-neutral-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <span className="flex-1 text-center font-sans font-semibold text-base sm:text-lg md:text-xl text-neutral-100 group-hover:text-white transition-colors tracking-wide px-2">
                                Instagram EAREC
                            </span>
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={20} className="text-neutral-400 group-hover:text-white group-hover:translate-x-1.5 transition-transform duration-300" />
                            </div>
                        </div>
                    </motion.a>
                </motion.div>
            </div>
        </div>

        {/* Rodapé com Link para Portfólio */}
        <motion.div variants={organicItemVariants} className="mt-10 flex items-center justify-center gap-3 text-neutral-400 text-xs sm:text-sm font-sans">
            <span className="tracking-[0.25em] uppercase font-medium">Experiência de Cinema</span>
            {onOpenPortfolio && (
              <>
                <span className="text-white/20">•</span>
                <button 
                  onClick={onOpenPortfolio}
                  className="tracking-[0.2em] uppercase font-bold text-neutral-300 hover:text-white transition-colors underline underline-offset-4 decoration-brand-DEFAULT/70 hover:decoration-brand-DEFAULT"
                >
                  Portfólio
                </button>
              </>
            )}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default IntroView;