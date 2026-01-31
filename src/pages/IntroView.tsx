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
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-6">
      
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
                
                {/* Opção 1: Instagram (Atualizado: Fonte Sans Clean) */}
                <motion.div variants={itemVariants}>
                    <p className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] mb-3 font-medium font-sans">Conheça nosso trabalho</p>
                    <motion.a 
                        href="https://www.instagram.com/earecmidia/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative group block w-full rounded-full overflow-hidden border border-white/20 hover:border-white/60 transition-colors duration-500 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Background Gradiente Vinho (Reduzido saturação) */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a0a] via-[#330a0a] to-[#1a0a0a] opacity-100" />
                        
                        {/* Brilho Metálico Prateado no Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                        <div className="relative z-20 w-full flex items-center justify-center gap-3 py-4 px-6">
                            <Instagram size={20} className="text-neutral-200 group-hover:text-white transition-colors" />
                            {/* Fonte Sans para modernidade */}
                            <span className="font-sans font-medium text-base md:text-lg text-neutral-100 group-hover:text-white transition-colors tracking-wide">
                                Instagram EAREC
                            </span>
                            <ArrowRight size={18} className="ml-auto opacity-50 text-neutral-400 group-hover:opacity-100 group-hover:translate-x-1 transition-all absolute right-6" />
                        </div>
                    </motion.a>
                </motion.div>

                {/* Divisor Silver */}
                <motion.div variants={itemVariants} className="flex items-center gap-4 opacity-60 my-2">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1" />
                    <span className="text-[10px] tracking-[0.2em] text-neutral-300 uppercase font-medium font-sans">Iniciar Orçamento</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1" />
                </motion.div>

                {/* Grid de Opções */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 md:gap-4">
                    
                    {/* Opção 2: Personalizado */}
                    <motion.div 
                        onClick={onContinue} 
                        className="cursor-pointer group relative h-48 md:h-52 rounded-2xl overflow-hidden transition-all shadow-2xl border border-white/10 hover:border-white/40"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Fundo Gradiente Deep Red/Black (Saturação reduzida) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2a0a0a] to-black opacity-90" />
                        
                        {/* Brilho Prateado no Hover */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="p-5 h-full flex flex-col justify-between relative z-10 text-left">
                            <div className="p-3 bg-gradient-to-br from-white/10 to-transparent border border-white/10 w-fit rounded-xl text-neutral-300 group-hover:text-white group-hover:border-white/30 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                <Play size={24} fill="currentColor" className="ml-0.5 text-neutral-200" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl md:text-2xl text-neutral-100 mb-1 leading-none drop-shadow-md group-hover:text-white transition-colors">Personalizado</h3>
                                <p className="text-[11px] md:text-xs text-neutral-400 leading-tight font-sans font-normal opacity-80">Experiência guiada</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Opção 3: Rápido */}
                    <motion.div 
                        onClick={onQuickStart} 
                        className="cursor-pointer group relative h-48 md:h-52 rounded-2xl overflow-hidden transition-all shadow-2xl border border-white/10 hover:border-white/40"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                         {/* Fundo Gradiente Deep Red/Black (Saturação reduzida) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2a0a0a] to-black opacity-90" />
                        
                        {/* Watermark Icon - Silver */}
                        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 text-white">
                            <Zap size={90} />
                        </div>

                        <div className="p-5 h-full flex flex-col justify-between relative z-10 text-left">
                            <div className="p-3 bg-gradient-to-br from-white/10 to-transparent border border-white/10 w-fit rounded-xl text-neutral-300 group-hover:text-white group-hover:border-white/30 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                <Zap size={24} fill="currentColor" className="text-neutral-200" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl md:text-2xl text-neutral-100 mb-1 leading-none drop-shadow-md group-hover:text-white transition-colors">Rápido</h3>
                                <p className="text-[11px] md:text-xs text-neutral-400 leading-tight font-sans font-normal opacity-80">Orçamento Flash</p>
                            </div>
                        </div>
                    </motion.div>

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