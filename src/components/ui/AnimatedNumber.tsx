
import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

/**
 * Componente que anima números inteiros.
 * A animação inicia somente quando o usuário rola a página até o elemento.
 */
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className }) => {
  const ref = useRef(null);
  
  // 'once: true' garante que a animação rode apenas uma vez ao aparecer.
  // 'margin: -50px' garante que o elemento esteja um pouco dentro da tela antes de disparar.
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Configuração "High-End Smooth" (Mantida da iteração anterior)
  // Iniciamos em 0 para criar o efeito de contagem ao chegar no card.
  const spring = useSpring(0, { 
    mass: 1, 
    stiffness: 40, 
    damping: 25 
  });
  
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    // Só atualiza o spring para o valor final se o elemento estiver visível
    if (isInView) {
      spring.set(value);
    }
  }, [value, spring, isInView]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
};

export default AnimatedNumber;
