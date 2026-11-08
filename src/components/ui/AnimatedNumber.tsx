// ============================================================================
// EAREC AUDIOVISUAL - NÚMERO ANIMADO COM FÍSICA SUAVE (AnimatedNumber.tsx)
// ============================================================================
// Olá, dev! 👋
// Este componente anima a contagem de números inteiros (como quantidade de fotos,
// horas de cobertura, etc.) com interpolação suave da física do Framer Motion (`useSpring`).
//
// CARACTERÍSTICAS:
// 1. Só dispara quando entra no viewport do usuário (`useInView`).
// 2. Utiliza `tabular-nums` para que a largura dos números não oscile durante a transição.
// ============================================================================

import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { cn } from '../../lib/utils';

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

/**
 * Componente que anima números inteiros.
 * A animação inicia somente quando o usuário rola a página até o elemento.
 * Utiliza font-price para alinhar perfeitamente os dígitos tabulares.
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

  return <motion.span ref={ref} className={cn("font-price tabular-nums", className)}>{display}</motion.span>;
};

export default AnimatedNumber;
