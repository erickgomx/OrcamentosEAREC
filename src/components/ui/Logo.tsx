import React, { useState, useCallback } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string; 
  animate?: boolean;
}

const SvgContent = React.memo(({ shouldAnimate }: { shouldAnimate: boolean }) => (
  <svg 
    viewBox="-20 -20 380 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] pointer-events-none relative z-10"
    aria-label="EAREC Logo"
  >
    <motion.text 
      fontFamily="'Microgramma Extd D Bold', 'Microgramma Extended', sans-serif" 
      fontWeight="900" 
      fontSize="55" 
      fill="#E5E5E5" 
      letterSpacing="-3"
      className="drop-shadow-sm"
      initial={shouldAnimate ? { opacity: 0, x: -10, y: 52, filter: 'blur(8px)' } : { opacity: 1, x: 20, y: 52, filter: 'blur(0px)' }}
      animate={{ opacity: 1, x: 20, y: 52, filter: 'blur(0px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: shouldAnimate ? 0.2 : 0 }}
    >
      EA
    </motion.text>
    
    {/* Ripple Effect Behind */}
    <motion.circle 
      cx="145" 
      cy="33" 
      r="16" 
      stroke="#DC2626"
      strokeWidth="2"
      fill="transparent"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: [1, 2.5], opacity: [0, 0.3, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: shouldAnimate ? 0.8 : 0 }}
    />
    
    {/* Pulse Circle */}
    <motion.circle 
      cx="145" 
      cy="33" 
      r="16" 
      fill="#DC2626" 
      className="drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]"
      initial={shouldAnimate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
          duration: 1, 
          type: "spring", 
          stiffness: 150, 
          damping: 10, 
          delay: shouldAnimate ? 0.5 : 0 
      }}
    />

    {/* Subtle Inner Glow Breathing */}
    <motion.circle 
      cx="145" 
      cy="33" 
      r="16" 
      fill="transparent"
      stroke="#ffffff"
      strokeWidth="1.5"
      animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ mixBlendMode: 'overlay' }}
    />
    
    <motion.text 
      fontFamily="'Eurostile Extd Regular', 'Eurostile Extd', 'Eurostile Extended', 'Michroma', sans-serif" 
      fontWeight="400" 
      fontSize="50" 
      fill="#DC2626" 
      letterSpacing="-1"
      className="drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]"
      initial={shouldAnimate ? { opacity: 0, x: 215, y: 52, filter: 'blur(8px)' } : { opacity: 1, x: 185, y: 52, filter: 'blur(0px)' }}
      animate={{ opacity: 1, x: 185, y: 52, filter: 'blur(0px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: shouldAnimate ? 0.4 : 0 }}
    >
      REC
    </motion.text>
  </svg>
));

const Logo: React.FC<LogoProps> = React.memo(({ className, animate = false }) => {
  const [isShining, setIsShining] = useState(false);
  
  const handleClick = useCallback(() => {
    if (!isShining) {
        setIsShining(true);
        setTimeout(() => setIsShining(false), 2000); 
    }
  }, [isShining]);
    
  const containerVariants: Variants = {
    hidden: { 
       opacity: 0, 
       scale: 0.85, 
       filter: 'blur(10px)',
       y: 20
     },
    visible: { 
       opacity: 1, 
       scale: 1, 
       filter: 'blur(0px)',
       y: 0,
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
      className={cn("relative select-none cursor-pointer overflow-hidden rounded-xl group px-2 py-1", className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <SvgContent shouldAnimate={animate} />
      
      {/* ELEGANT CLICK ANIMATION: GENTLE GLOW AND SOFT SWEEP */}
      <AnimatePresence>
        {isShining && (
            <>
              {/* Radial glow expansion */}
              <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.4] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full h-[300%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-DEFAULT/30 via-white/5 to-transparent blur-2xl pointer-events-none"
              />
              {/* Sharp elegant light sweep */}
              <motion.div
                  initial={{ x: '-150%', skewX: -20, opacity: 0 }}
                  animate={{ x: '150%', skewX: -20, opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute top-0 bottom-0 z-20 w-[80%] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm pointer-events-none"
                  style={{ mixBlendMode: 'overlay' }}
              />
            </>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default Logo;
