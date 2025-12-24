
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Instagram, Zap, Play } from 'lucide-react';
import Logo from '../components/ui/Logo';

interface IntroViewProps {
  onContinue: () => void;
  onQuickStart: () => void;
}

// OTIMIZAÇÃO: Delays reduzidos para sensação de "instantaneidade"
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Mais rápido entre itens
      delayChildren: 0.05    // Começa quase imediatamente
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 }, // Distância menor
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" } // Duração menor
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
            
            {/* Opção 1: Instagram - Renderização Otimizada */}
            <motion.div variants={itemVariants}>
                <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-2">Conheça nosso trabalho</p>
                <motion.a 
                    href="https://www.instagram.com/earecmidia/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative group block w-full rounded-full overflow-hidden border border-white/10 hover:border-brand-DEFAULT/60 transition-colors duration-300 shadow-lg bg-neutral-900/60"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Conteúdo do Botão Simplificado */}
                    <div className="relative z-20 w-full flex items-center justify-center gap-3 py-4">
                        <Instagram size={20} className="text-brand-DEFAULT group-hover:text-white transition-colors" />
                        <span className="font-serif italic text-lg text-white group-hover:text-brand-DEFAULT transition-colors">Instagram EAREC</span>
                        <ArrowRight size={16} className="ml-auto opacity-50 text-white group-hover:opacity-100 group-hover:translate-x-1 transition-all mr-6 absolute right-0" />
                    </div>
                </motion.a>
            </motion.div>

            {/* Divisor */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 opacity-20 my-2">
                <div className="h-px bg-white flex-1" />
                <span className="text-[10px] tracking-widest">INICIAR ORÇAMENTO</span>
                <div className="h-px bg-white flex-1" />
            </motion.div>

            {/* Grid de Opções */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 md:gap-4">
                 
                 {/* Opção 2: Personalizado */}
                 <motion.div 
                    onClick={onContinue} 
                    className="cursor-pointer group relative h-48 md:h-56 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-brand-DEFAULT/50 rounded-2xl overflow-hidden transition-all shadow-2xl"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.6)" }}
                    whileTap={{ scale: 0.98 }}
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
                    
                    <div className="p-4 md:p-6 h-full flex flex-col justify-between relative z-10 text-left">
                        <div className="p-2.5 bg-white/5 border border-white/10 w-fit rounded-xl text-brand-DEFAULT group-hover:bg-brand-DEFAULT/20 transition-colors">
                             <Play size={24} fill="currentColor" className="ml-0.5" />
                        </div>
                        <div>
                            <h3 className="font-serif text-xl md:text-2xl text-white mb-1 leading-none drop-shadow-md">Personalizado</h3>
                            <p className="text-[11px] md:text-xs text-neutral-300 leading-tight font-medium opacity-80">Experiência guiada</p>
                        </div>
                    </div>
                 </motion.div>

                 {/* Opção 3: Rápido */}
                 <motion.div 
                    onClick={onQuickStart} 
                    className="cursor-pointer group relative h-48 md:h-56 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-brand-DEFAULT/50 rounded-2xl overflow-hidden transition-all shadow-2xl"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.6)" }}
                    whileTap={{ scale: 0.98 }}
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
                    
                    <div className="absolute -top-4 -right-4 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity rotate-12 text-brand-DEFAULT">
                         <Zap size={80} />
                    </div>

                    <div className="p-4 md:p-6 h-full flex flex-col justify-between relative z-10 text-left">
                        <div className="p-2.5 bg-white/5 border border-white/10 w-fit rounded-xl text-brand-DEFAULT group-hover:bg-brand-DEFAULT/20 transition-colors">
                             <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h3 className="font-serif text-xl md:text-2xl text-white mb-1 leading-none drop-shadow-md">Rápido</h3>
                            <p className="text-[11px] md:text-xs text-neutral-300 leading-tight font-medium opacity-80">Orçamento Flash</p>
                        </div>
                    </div>
                 </motion.div>

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
