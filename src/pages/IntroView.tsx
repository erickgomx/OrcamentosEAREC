
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Instagram, MousePointerClick } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

interface IntroViewProps {
  onContinue: () => void;
}

// Reutilizando variantes para consistência visual
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, 
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const IntroView: React.FC<IntroViewProps> = ({ onContinue }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      
      {/* 
        REMOVIDO: Vignette/Overlays 
        Fundo transparente para mostrar o bg-black e filmstrips do App.tsx 
      */}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg text-center"
      >
        {/* Logo Animada */}
        <motion.div variants={itemVariants} className="flex justify-center mb-16">
          <Logo className="w-72 md:w-96" animate />
        </motion.div>

        <div className="flex flex-col gap-6">
            
            {/* Opção 1: Instagram */}
            <motion.div variants={itemVariants}>
                <p className="text-neutral-400 text-sm uppercase tracking-widest mb-3">Primeira vez aqui?</p>
                <a 
                    href="https://www.instagram.com/earecmidia/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block w-full"
                >
                    <Button variant="glass" className="w-full justify-center hover:border-brand-DEFAULT/50 transition-colors gap-4 py-6 bg-black/40 backdrop-blur-sm">
                        <span className="flex items-center gap-3">
                            <Instagram size={20} className="text-brand-DEFAULT" />
                            <span className="font-serif italic text-lg">Conheça a EAREC</span>
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-brand-DEFAULT transition-colors flex items-center gap-2">
                            CLIQUE AQUI <ArrowRight size={14} />
                        </span>
                    </Button>
                </a>
            </motion.div>

            {/* Divisor */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 opacity-30">
                <div className="h-px bg-white flex-1" />
                <span className="text-xs">OU</span>
                <div className="h-px bg-white flex-1" />
            </motion.div>

            {/* Opção 2: Orçamento (Animação Aprimorada) */}
            <motion.div variants={itemVariants}>
                 <p className="text-neutral-400 text-sm uppercase tracking-widest mb-3">Já sabe o que quer?</p>
                 <div onClick={onContinue} className="cursor-pointer relative group/btn">
                    
                    {/* Animação de Pulso/Halo Atrás do Botão */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-brand-DEFAULT/20"
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    <Button 
                        variant="primary" 
                        className="w-full justify-center items-center gap-4 py-6 group relative overflow-hidden z-10 shadow-[0_0_20px_rgba(220,38,38,0.4)] bg-brand-DEFAULT/80 backdrop-blur-sm"
                    >
                        <span className="font-serif italic text-lg text-center">Faça seu orçamento gratuitamente!</span>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                CLIQUE AQUI <ArrowRight size={28} /> {/* Aumentado de 24 para 28 */}
                            </span>

                            {/* ANIMAÇÃO DE CLIQUE APERFEIÇOADA */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: 10, y: 10 }}
                                animate={{ 
                                    opacity: [0, 1, 1, 0], 
                                    x: [10, 0, 0, 10],
                                    y: [10, 0, 0, 10],
                                    scale: [1, 0.9, 0.9, 1]
                                }}
                                transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity, 
                                    ease: "easeInOut",
                                    repeatDelay: 0.5
                                }}
                            >
                                <MousePointerClick 
                                    size={24}
                                    className="text-white fill-white/20 drop-shadow-lg rotate-[-12deg]" 
                                />
                                {/* Onda de clique (Ripple) saindo da ponta do mouse */}
                                <motion.div 
                                    className="absolute top-0 left-0 w-6 h-6 rounded-full border border-white/50"
                                    animate={{ scale: [0, 2], opacity: [1, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                                />
                            </motion.div>
                        </div>
                    </Button>
                 </div>
            </motion.div>

        </div>

        <motion.p variants={itemVariants} className="mt-12 text-neutral-600 text-xs tracking-[0.2em]">
            CINEMATIC EXPERIENCE
        </motion.p>

      </motion.div>
    </div>
  );
};

export default IntroView;
