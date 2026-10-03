import { Variants } from 'framer-motion';

// Animação de entrada suave de baixo para cima - Velocidade aumentada
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

// Container que orquestra filhos com delay - Velocidade aumentada
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Efeito de "Scale" sutil para imagens - Velocidade aumentada
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1.0, ease: "easeOut" }
  }
};

// Modal slide in - Mantido elástico mas snappier
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 400, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20, 
    transition: { duration: 0.15 }
  }
};

/**
 * pageSlideVariants
 * -----------------
 * Transição cinematográfica fluida entre telas completas.
 * Ao entrar: desliza suavemente para o centro com fade in e orquestra filhos com stagger.
 * Ao sair: desliza suavemente para o lado oposto com fade out, permitindo que a próxima tela surja.
 */
export const pageSlideVariants: Variants = {
  initial: { 
    opacity: 0, 
    x: 40,
    filter: 'blur(4px)'
  },
  animate: { 
    opacity: 1, 
    x: 0,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.45, 
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.05
    } 
  },
  exit: { 
    opacity: 0, 
    x: -40,
    filter: 'blur(4px)',
    transition: { 
      duration: 0.35, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

/**
 * slideFadeItem
 * -------------
 * Variante para elementos individuais (títulos, botões, cards)
 * dentro das páginas para criar o efeito de deslizamento em cascata.
 */
export const slideFadeItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 25, 
    x: 10 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    x: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  },
  exit: {
    opacity: 0,
    y: -20,
    x: -10,
    transition: { 
      duration: 0.25, 
      ease: "easeIn" 
    }
  }
};
