
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { formatCurrency } from '../../lib/utils';

interface AnimatedPriceProps {
  value: number;
  className?: string;
}

/**
 * Componente que anima o valor numérico usando Motion Values.
 * Cria o efeito de "rolagem" de números de cassino/banco.
 */
const AnimatedPrice: React.FC<AnimatedPriceProps> = ({ value, className }) => {
  // Física ajustada para VELOCIDADE (Snappy/Responsive)
  // Mass 0.5 (Leve) + Stiffness 250 (Alta tensão) = Mudança rápida
  const spring = useSpring(value, { 
    mass: 0.5, 
    stiffness: 250, 
    damping: 25 
  });
  
  const display = useTransform(spring, (current) => formatCurrency(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={className}>{display}</motion.span>;
};

export default AnimatedPrice;
