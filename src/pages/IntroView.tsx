
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
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const IntroView: React.FC<IntroViewProps> = ({ onContinue, onQuickStart }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-6">
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg text-center"
      >
        {/* Logo Animada */}
        <motion.div variants={itemVariants} className="flex justify-center mb-10 md:mb-12">
          <Logo className="w-64 md:w-96" animate />
        </motion.div>

        <div className="flex flex-col gap-6">
            
            {/* Opção 1: Instagram (Botão com Animação Reforçada) */}
            <motion.div variants={itemVariants}>
                <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-2">Conheça nosso trabalho</p>
                <motion.a 
                    href="https://www.instagram.com/earecmidia/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative group block w-full rounded-full overflow-hidden border border-white/20 hover:border-brand-DEFAULT/60 transition-colors duration-500"
                    whileHover="hover"
                    whileTap="tap"
                    initial="idle"
                >
                    {/* Background Glass Darker */}
                    <div className="absolute inset-0 bg-neutral-900/90 backdrop-blur-md z-0" />
                    
                    {/* Efeito de Brilho Contínuo (Shimmer) - Mais visível */}
                    <motion.div
                        className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                        variants={{
                            idle: { x: '-150%' },
                            hover: { 
                                x: '150%', 
                                transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity } 
                            }
                        }}
                    />

                    {/* Conteúdo do Botão */}
                    <motion.div 
                        className="relative z-20 w-full flex items-center justify-center gap-3 py-4"
                        variants={{
                            tap: { scale: 0.96 }
                        }}
                    >
                        <Instagram size={20} className="text-brand-DEFAULT transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
                        <span className="font-serif italic text-lg text-white group-hover:text-brand-DEFAULT transition-colors">Instagram EAREC</span>
                        <ArrowRight size={16} className="ml-auto opacity-50 text-white group-hover:opacity-100 group-hover:translate-x-1 transition-all mr-6 absolute right-0" />
                    </motion.div>

                    {/* Flash de Luz Branco ao Clicar (Feedback Tátil) */}
                    <motion.div 
                        className="absolute inset-0 z-30 bg-white pointer-events-none"
                        variants={{
                            idle: { opacity: 0 },
                            tap: { opacity: 0.25, transition: { duration: 0.05 } }
                        }}
                    />
                </motion.a>
            </motion.div>

            {/* Divisor */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 opacity-20 my-2">
                <div className="h-px bg-white flex-1" />
                <span className="text-[10px] tracking-widest">INICIAR ORÇAMENTO</span>
                <div className="h-px bg-white flex-1" />
            </motion.div>

            {/* Grid de Opções de Orçamento - Lado a Lado no Mobile (grid-cols-2) */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 md:gap-4">
                 
                 {/* Opção 2: Personalizado (Esquerda) */}
                 <div onClick={onContinue} className="cursor-pointer group relative h-48 md:h-56">
                    <motion.div
                        className="absolute inset-0 rounded-2xl bg-brand-DEFAULT/20"
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="bg-brand-DEFAULT/80 hover:bg-brand-DEFAULT border border-brand-DEFAULT/50 rounded-2xl p-4 md:p-6 text-left transition-all h-full flex flex-col justify-between backdrop-blur-sm shadow-[0_0_20px_rgba(220,38,38,0.15)] hover:scale-[1.02] active:scale-[0.98]">
                        <div className="mb-2 p-2.5 bg-white/20 w-fit rounded-xl text-white">
                             <Play size={24} fill="currentColor" className="ml-0.5" />
                        </div>
                        <div>
                            <h3 className="font-serif text-xl md:text-2xl text-white mb-1 leading-none">Personalizado</h3>
                            <p className="text-[11px] md:text-xs text-white/90 leading-tight font-medium opacity-90">Vamos Começar</p>
                            <p className="text-[9px] text-white/70 mt-1 leading-tight hidden md:block">Experiência guiada passo a passo.</p>
                        </div>
                    </div>
                 </div>

                 {/* Opção 3: Rápido (Direita) */}
                 <div onClick={onQuickStart} className="cursor-pointer group h-48 md:h-56">
                    <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-DEFAULT/50 rounded-2xl p-4 md:p-6 text-left transition-all h-full flex flex-col justify-between relative overflow-hidden hover:scale-[1.02] active:scale-[0.98]">
                        <div className="absolute -top-4 -right-4 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity rotate-12">
                            <Zap size={80} />
                        </div>
                        
                        <div className="mb-2 p-2.5 bg-yellow-500/10 border border-yellow-500/20 w-fit rounded-xl text-yellow-500">
                             <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h3 className="font-serif text-xl md:text-2xl text-white mb-1 leading-none">Rápido</h3>
                            <p className="text-[11px] md:text-xs text-neutral-400 leading-tight font-medium">Orçamento Flash</p>
                            <p className="text-[9px] text-neutral-600 mt-1 leading-tight hidden md:block">Pule a apresentação e vá direto aos valores.</p>
                        </div>
                    </div>
                 </div>

            </motion.div>

        </div>

        <motion.p variants={itemVariants} className="mt-12 md:mt-16 text-neutral-600 text-[10px] tracking-[0.4em] uppercase font-medium">
            Experiência de Cinema
        </motion.p>

      </motion.div>
    </div>
  );
};

export default IntroView;
