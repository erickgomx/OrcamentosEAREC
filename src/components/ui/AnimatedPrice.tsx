// ============================================================================
// EAREC AUDIOVISUAL - PREÇO ANIMADO EM TEMPO REAL (AnimatedPrice.tsx)
// ============================================================================
// Olá, dev! 👋
// Este componente é o responsável pelo efeito "odômetro / ticker" nos preços
// da aplicação. Conforme o usuário adiciona horas, fotos extras ou drone,
// o número rola fluidamente até o novo total com formatação monetária (R$).
//
// CARACTERÍSTICAS:
// 1. `useSpring` com física ágil (`stiffness: 250`) para dar sensação de imediatismo ao toque.
// 2. `useTransform` que roda a cada frame formatando em tempo real com `formatCurrency`.
// ============================================================================

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { formatCurrency, cn } from '../../lib/utils';

interface AnimatedPriceProps {
  value: number;
  className?: string;
}

/**
 * Componente que anima o valor numérico usando Motion Values.
 * Aplica a tipografia font-price (Plus Jakarta Sans alinhada) com números tabulares.
 */
const AnimatedPrice: React.FC<AnimatedPriceProps> = ({ value, className }) => {
  // Física ajustada para VELOCIDADE (Snappy/Responsive)
  const spring = useSpring(value, { 
    mass: 0.5, 
    stiffness: 250, 
    damping: 25 
  });
  
  const display = useTransform(spring, (current: any) => formatCurrency(current as number));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={cn("font-price tabular-nums tracking-tight", className)}>{display}</motion.span>;
};

export default AnimatedPrice;
