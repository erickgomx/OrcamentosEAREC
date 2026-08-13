import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Instagram, Zap, Play } from 'lucide-react';
import Logo from '../components/ui/Logo';

interface IntroViewProps {
  onContinue: () => void;
  onQuickStart: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, 
      delayChildren: 0.05    
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 }, 
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" } 
  }
};

const IntroView: React.FC<IntroViewProps> = ({ onContinue, onQuickStart }) => {
  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-6">
      
      {/* GLOWS DE FUNDO (Red Spotlights) - Intensidade Reduzida para visual mais clean */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/05 blur-[120px] rounded-full pointer-events-none mix-blend-screen translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg text-center"
      >
        {/* Logo Animada */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8 md:mb-10">
          <Logo className="w-64 md:w-80" animate />
        </motion.div>

        {/* Grupo de Ações com Sombra Difusa ao Fundo */}
        <div className="relative"> 
            {/* Sombra escura difusa atrás dos botões */}
            <div className="absolute inset-0 bg-black/80 blur-3xl rounded-full scale-110 opacity-90 pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-5 p-2">
                
                <motion.div variants={itemVariants} className="mb-4">
                    <h2 className="text-white text-lg md:text-xl font-serif leading-snug drop-shadow-md">
                        Você já conhece nosso trabalho<br/> ou deseja fazer um orçamento?
                    </h2>
                </motion.div>

                {/* Opção 1: Orçamento (Antigo Rápido) */}
                <motion.div variants={itemVariants}>
                    <p className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] mb-3 font-medium font-sans">Fazer Orçamento</p>
                    <motion.div 
                        onClick={onQuickStart} 
                        className="cursor-pointer group relative rounded-2xl overflow-hidden transition-all shadow-2xl border border-white/20 hover:border-white/60"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                         {/* Fundo Gradiente Deep Red/Black */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2a0a0a] to-[#111] opacity-90" />
                        
                        <div className="relative z-20 w-full flex items-center justify-center gap-3 py-5 px-6">
                            <Zap size={24} className="text-neutral-200 group-hover:text-white transition-colors" />
                            <span className="font-sans font-medium text-base md:text-lg text-neutral-100 group-hover:text-white transition-colors tracking-wide">
                                Iniciar Orçamento
                            </span>
                            <ArrowRight size={18} className="ml-auto opacity-50 text-neutral-400 group-hover:opacity-100 group-hover:translate-x-1 transition-all absolute right-6" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Divisor Silver */}
                <motion.div variants={itemVariants} className="flex items-center gap-4 opacity-60 my-2">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1" />
                    <span className="text-[10px] tracking-[0.2em] text-neutral-300 uppercase font-medium font-sans">Ou</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1" />
                </motion.div>

                {/* Opção 2: Instagram */}
                <motion.div variants={itemVariants}>
                    <p className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] mb-3 font-medium font-sans">Conhecer Trabalho</p>
                    <motion.a 
                        href="https://www.instagram.com/earecmidia/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative group block w-full rounded-2xl overflow-hidden border border-white/20 hover:border-white/60 transition-colors duration-500 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Background Gradiente Vinho */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a0a] via-[#330a0a] to-[#1a0a0a] opacity-100" />
                        
                        {/* Brilho Metálico Prateado no Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                        <div className="relative z-20 w-full flex items-center justify-center gap-3 py-5 px-6">
                            <Instagram size={24} className="text-neutral-200 group-hover:text-white transition-colors" />
                            <span className="font-sans font-medium text-base md:text-lg text-neutral-100 group-hover:text-white transition-colors tracking-wide">
                                Instagram EAREC
                            </span>
                            <ArrowRight size={18} className="ml-auto opacity-50 text-neutral-400 group-hover:opacity-100 group-hover:translate-x-1 transition-all absolute right-6" />
                        </div>
                    </motion.a>
                </motion.div>
            </div>
        </div>

        <motion.p variants={itemVariants} className="mt-10 text-neutral-500/50 text-[10px] tracking-[0.4em] uppercase font-medium drop-shadow-sm font-sans">
            Experiência de Cinema
        </motion.p>

      </motion.div>
    </div>
  );
};

export default IntroView;