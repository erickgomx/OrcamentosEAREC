
import React, { useState, useCallback } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string; 
  animate?: boolean;  
}

// Movido para fora para evitar recriação
const SvgContent = React.memo(() => (
  <svg 
    viewBox="0 0 250 70" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] pointer-events-none relative z-10"
    aria-label="EAREC Logo"
  >
    <text 
      x="10" 
      y="52" 
      fontFamily="'Inter', sans-serif" 
      fontWeight="900" 
      fontSize="55" 
      fill="#E5E5E5" 
      letterSpacing="-3"
      className="drop-shadow-sm"
    >
      EA
    </text>

    <motion.circle 
      cx="105" 
      cy="33" 
      r="16" 
      fill="#DC2626" 
      className="drop-shadow-[0_0_10px_rgba(220,38,38,0.9)]"
      animate={{ opacity: [1, 0.6, 1] }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    />

    <text 
      x="132" 
      y="52" 
      fontFamily="'Inter', sans-serif" 
      fontWeight="300" 
      fontSize="55" 
      fill="#DC2626" 
      letterSpacing="-3"
      className="drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]"
    >
      REC
    </text>
  </svg>
));

const Logo: React.FC<LogoProps> = React.memo(({ className, animate = false }) => {
  const [isShining, setIsShining] = useState(false);

  const handleClick = useCallback(() => {
    if (!isShining) {
        setIsShining(true);
        setTimeout(() => setIsShining(false), 1000); // Tempo da animação
    }
  }, [isShining]);
  
  const containerVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      filter: 'blur(10px)' 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  return (
    <motion.div 
      initial={animate ? "hidden" : "visible"}
      animate="visible"
      variants={containerVariants}
      onClick={handleClick}
      className={cn("relative select-none cursor-pointer overflow-hidden rounded-lg group", className)}
      whileTap={{ scale: 0.95 }}
    >
      <SvgContent />

      {/* SHINE EFFECT OVERLAY */}
      <AnimatePresence>
        {isShining && (
            <motion.div
                initial={{ x: '-150%', opacity: 0 }}
                animate={{ x: '150%', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 z-20 w-1/2 h-full -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-md"
                style={{ mixBlendMode: 'overlay' }}
            />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default Logo;
