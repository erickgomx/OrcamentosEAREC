import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Instagram } from 'lucide-react';
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
    <div className="w-full h-screen flex flex-col items-center justify-center bg-neutral-950 relative overflow-hidden px-6">
      
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black z-0" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-DEFAULT/5 to-transparent pointer-events-none" />

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
                    <Button variant="glass" className="w-full justify-between hover:border-brand-DEFAULT/50 transition-colors py-6">
                        <span className="flex items-center gap-3">
                            <Instagram size={20} className="text-brand-DEFAULT" />
                            <span className="font-serif italic text-lg">Você não conhece a EAREC?</span>
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

            {/* Opção 2: Orçamento */}
            <motion.div variants={itemVariants}>
                 <p className="text-neutral-400 text-sm uppercase tracking-widest mb-3">Já sabe o que quer?</p>
                 <div onClick={onContinue} className="cursor-pointer">
                    <motion.div
                        className="rounded-full"
                        animate={{
                            boxShadow: [
                            "0 0 0px rgba(220, 38, 38, 0)",
                            "0 0 25px rgba(220, 38, 38, 0.5)",
                            "0 0 0px rgba(220, 38, 38, 0)"
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Button variant="primary" className="w-full justify-between py-6 group">
                            <span className="font-serif italic text-lg">Faça seu orçamento gratuitamente!</span>
                            <span className="text-xs font-bold text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                CLIQUE AQUI <ArrowRight size={14} />
                            </span>
                        </Button>
                    </motion.div>
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