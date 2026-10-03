
import { Variants } from 'framer-motion';

// Animação de entrada suave de baixo para cima - Velocidade aumentada
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } // Reduzido de 0.8 para 0.4
  }
};

// Container que orquestra filhos com delay - Velocidade aumentada
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Reduzido de 0.15 para 0.08
      delayChildren: 0.1     // Reduzido de 0.3 para 0.1
    }
  }
};

// Efeito de "Scale" sutil para imagens - Velocidade aumentada
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1.0, ease: "easeOut" } // Reduzido de 1.5 para 1.0
  }
};

// Modal slide in - Mantido elástico mas snappier
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 } // Aumentado stiffness de 300 para 400
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.15 } // Reduzido de 0.2 para 0.15
  }
};
