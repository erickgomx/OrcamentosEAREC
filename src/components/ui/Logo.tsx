// ============================================================================
// EAREC AUDIOVISUAL - LOGOMARCA OFICIAL VETORIAL (Logo.tsx)
// ============================================================================
// Olá, dev! 👋
// Este é o componente central da identidade visual da EAREC:
// "EA ● REC" (com o botão de REC pulsante e ondas de expansão).
//
// CARACTERÍSTICAS TÉCNICAS E VISUAIS:
// 1. Tipografia de engenharia óptica ('Microgramma' e 'Michroma/Eurostile').
// 2. Adaptação dinâmica de contraste de acordo com o tema ativo (Dark vs Light).
// 3. Ponto REC central vermelho vivo com pulsação suave e efeito de anéis concêntricos (ripple).
// 4. Easter Egg interativo: ao clicar no logo, dispara um brilho de feixe de luz
//    e exibe o slogan assinatura da marca: "Revelando seu melhor".
// ============================================================================

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string; 
  animate?: boolean;
}

/**
 * Conteúdo vetorial renderizado com alta performance (React.memo).
 * Isola o SVG para evitar repinturas desnecessárias durante animações de layout.
 */
const SvgContent = React.memo(({ shouldAnimate, textColor = "#E5E5E5" }: { shouldAnimate: boolean; textColor?: string }) => (
  <svg 
    viewBox="60 -10 240 85" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] pointer-events-none relative z-10 overflow-visible"
    aria-label="EAREC Logo"
  >
    {/* Texto "EA" inicial */}
    <motion.text 
      fontFamily="'Microgramma Extd D Bold', 'Microgramma Extended', sans-serif" 
      fontWeight="900" 
      fontSize="55" 
      fill={textColor}
       stroke={textColor}
       strokeWidth="2" 
      letterSpacing="-3"
      className="drop-shadow-sm"
      initial={shouldAnimate ? { opacity: 0, x: -10, y: 52 } : { opacity: 1, x: 65, y: 52 }}
      animate={{ opacity: 1, x: 65, y: 52 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: shouldAnimate ? 0.05 : 0 }}
    >
      EA
    </motion.text>
    
    {/* Ripple Effect Behind - Loop suave e contínuo sem piscar */}
    <motion.circle 
      cx="135" 
      cy="33" 
      r="16" 
      stroke="#DC2626"
      strokeWidth="1.5"
      fill="transparent"
      style={{ transformOrigin: "135px 33px" }}
      initial={{ scale: 1, opacity: 0 }}
      animate={{ 
        scale: [1, 1.35, 1.7], 
        opacity: [0, 0.38, 0] 
      }}
      transition={{ 
        duration: 2.4, 
        repeat: Infinity, 
        ease: "easeInOut",
        times: [0, 0.35, 1],
        delay: shouldAnimate ? 0.8 : 0 
      }}
    />
    
    {/* Pulse Circle: O ponto vermelho icônico do botão REC */}
    <motion.circle 
      cx="135" 
      cy="33" 
      r="16" 
      fill="#DC2626" 
      className="drop-shadow-[0_0_12px_rgba(220,38,38,0.7)]"
      style={{ transformOrigin: "135px 33px" }}
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

    {/* Subtle Inner Glow Breathing: respiração luminosa interna */}
    <motion.circle 
      cx="135" 
      cy="33" 
      r="16" 
      fill="transparent"
      stroke="#ffffff"
      strokeWidth="1.5"
      style={{ transformOrigin: "135px 33px", mixBlendMode: 'overlay' }}
      animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Texto "REC" final */}
    <motion.text 
      fontFamily="'Eurostile Extd Regular', 'Eurostile Extd', 'Eurostile Extended', 'Michroma', sans-serif" 
      fontWeight="400" 
      fontSize="50" 
      fill="#DC2626" 
      letterSpacing="-1"
      className="drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]"
      initial={shouldAnimate ? { opacity: 0, x: 215, y: 52 } : { opacity: 1, x: 155, y: 52 }}
      animate={{ opacity: 1, x: 155, y: 52 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: shouldAnimate ? 0.15 : 0 }}
    >
      REC
    </motion.text>
  </svg>
));

const Logo: React.FC<LogoProps> = React.memo(({ className, animate = false }) => {
  // Lê a preferência de cor com tratamento contra falha se estiver fora de Provider
  let isDark = true;
  try {
    const themeContext = useTheme();
    isDark = themeContext.isDark;
  } catch {
    isDark = true;
  }
  const textColor = isDark ? '#E5E5E5' : '#171717';
  const [isShining, setIsShining] = useState(false);
  
  // Gatilho do Easter Egg interativo de clique com animação cinematográfica
  const handleClick = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!isShining) {
        setIsShining(true);
        setTimeout(() => setIsShining(false), 2000); 
    }
  }, [isShining]);
    
  const containerVariants: Variants = {
    hidden: { 
       opacity: 0, 
       scale: 0.9,
       y: 12
     },
    visible: { 
       opacity: 1, 
       scale: 1,
       y: 0,
       transition: { 
         duration: 0.45, 
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
      className={cn("relative select-none cursor-pointer overflow-visible rounded-xl group px-2 py-2 flex items-center justify-center", className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <SvgContent shouldAnimate={animate} textColor={textColor} />
      
      {/* ELEGANT CLICK ANIMATION: GENTLE GLOW AND SOFT SWEEP */}
      <AnimatePresence>
        {isShining && (
            <>
              <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-10">
                {/* Radial glow expansion */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-DEFAULT/30 via-white/5 to-transparent blur-2xl pointer-events-none"
                />
                {/* Sharp elegant light sweep */}
                <motion.div
                    initial={{ x: '-150%', skewX: -20, opacity: 0 }}
                    animate={{ x: '150%', skewX: -20, opacity: [0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute top-0 bottom-0 w-[80%] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm pointer-events-none"
                    style={{ mixBlendMode: 'overlay' }}
                />
              </div>
              
              {/* Revelando seu melhor text: slogan revelado suavemente */}
              <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 z-30 flex justify-center pointer-events-none w-full"
              >
                  <span className="text-[10px] sm:text-[14px] uppercase tracking-[0.05em] sm:tracking-[0.1em] text-stone-900 dark:text-white/90 font-bold w-full text-center truncate drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] px-1 transition-colors duration-300">
                      Revelando seu melhor
                  </span>
              </motion.div>
            </>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default Logo;
