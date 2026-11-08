// ============================================================================
// EAREC AUDIOVISUAL - SISTEMA DE ANIMAÇÕES CINEMATOGRÁFICAS (animations.ts)
// ============================================================================
// Olá, dev criativo! 🎬✨
// Este arquivo é o motor de física e movimento da experiência visual da EAREC.
// Toda a estética foi pensada para transmitir fluidez de estúdio de cinema:
// - Curvas cúbicas refinadas (`CINE_EASE`) com aceleração e desaceleração orgânicas.
// - Efeitos de desfoque de lente (`blur filter`) simulando abertura e foco óptico.
// - Orquestração em cascata (`staggerChildren`) para que listas entrem como peças de dominó.
// - Modais e gavetas que sobem com peso e suavidade sem causar flickers na GPU.
// ============================================================================

import { Variants } from 'framer-motion';

/**
 * animations.ts
 * -------------
 * Biblioteca centralizada de variantes e curvas de física cinematográficas para o Framer Motion.
 * Implementa curvas de desaceleração suave (Cubic Bezier [0.16, 1, 0.3, 1]) e física de molas (Spring)
 * com transições bidirecionais fluidas de slide, fade e desfoque óptico (blur filter).
 */

// Curvas cinematográficas de alta fidelidade
export const CINE_EASE = [0.16, 1, 0.3, 1] as const;
export const CINE_EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const CINE_EASE_IN = [0.7, 0, 0.84, 0] as const;
export const CINE_EASE_ORGANIC = [0.32, 0, 0.67, 0] as const;

// Transição orquestrada de página: o container não apaga como bloco único;
// ele orquestra a saída e entrada fluida individual de cada elemento filho
export const pageContainerVariants: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.02,
    }
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      staggerDirection: -1, // Os últimos elementos saem primeiro, efeito cascata orgânico
    }
  }
};

// pageSlideVariants compatível: orquestra a saída individual de cada elemento da rota
export const pageSlideVariants: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.02,
    }
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      staggerDirection: -1,
    }
  }
};

// Item individual orgânico com física cinematográfica, deslizamento e desfoque óptico
export const organicItemVariants: Variants = {
  initial: (direction: number = 1) => ({
    opacity: 0,
    y: direction >= 0 ? 32 : -32,
    scale: 0.98,
    filter: 'blur(8px)',
  }),
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.52,
      ease: CINE_EASE,
    }
  },
  exit: (direction: number = 1) => ({
    opacity: 0,
    y: direction >= 0 ? -24 : 24,
    scale: 0.97,
    filter: 'blur(6px)',
    transition: {
      duration: 0.3,
      ease: CINE_EASE_ORGANIC,
    }
  })
};

// Card individual para listas e grids com suporte total a enter/center e hidden/visible (elimina conflitos de animação e flickering de GPU)
export const cardItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.96 
  },
  enter: { 
    opacity: 0, 
    y: 20, 
    scale: 0.96 
  },
  visible: (i: number = 0) => ({ 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      delay: (typeof i === 'number' ? i : 0) * 0.05, 
      duration: 0.4, 
      ease: CINE_EASE 
    } 
  }),
  center: (i: number = 0) => ({ 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      delay: (typeof i === 'number' ? i : 0) * 0.05, 
      duration: 0.4, 
      ease: CINE_EASE 
    } 
  }),
  exit: (i: number = 0) => ({ 
    opacity: 0, 
    y: -16, 
    scale: 0.97, 
    transition: { 
      delay: (6 - Math.min(typeof i === 'number' ? i : 0, 6)) * 0.02, 
      duration: 0.22, 
      ease: CINE_EASE_ORGANIC 
    } 
  })
};

export const organicCardVariants: Variants = cardItemVariants;

// Transição de etapas do Wizard e Configurador (passos deslizantes com direção natural)
export const wizardStepVariants: Variants = {
  enter: (direction: number = 1) => ({
    opacity: 0,
    x: direction > 0 ? 50 : -50,
    scale: 0.98,
    filter: 'blur(8px)',
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.03,
      duration: 0.45,
      ease: CINE_EASE
    }
  }),
  center: {
    zIndex: 1,
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: CINE_EASE,
      staggerChildren: 0.045,
      delayChildren: 0.03
    }
  },
  exit: (direction: number = 1) => ({
    zIndex: 0,
    opacity: 0,
    x: direction > 0 ? -50 : 50,
    scale: 0.98,
    filter: 'blur(8px)',
    transition: {
      duration: 0.32,
      ease: CINE_EASE_OUT,
      staggerChildren: 0.035,
      staggerDirection: -1
    }
  })
};

// Fade In Up aprimorado com desfoque óptico e slide vertical suave
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 26, 
    filter: 'blur(6px)',
    scale: 0.98
  },
  enter: { 
    opacity: 0, 
    y: 26, 
    filter: 'blur(6px)',
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: { 
      duration: 0.48, 
      ease: CINE_EASE 
    }
  },
  center: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: { 
      duration: 0.48, 
      ease: CINE_EASE 
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(6px)',
    scale: 0.98,
    transition: { 
      duration: 0.28, 
      ease: CINE_EASE_ORGANIC 
    }
  }
};

// Container escalonado para orquestração de listas e cards
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  enter: { opacity: 1 },
  center: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      staggerDirection: -1
    }
  }
};

// Efeito de Scale sutil com curva refinada
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, filter: 'blur(6px)' },
  visible: { 
    opacity: 1, 
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: CINE_EASE }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    filter: 'blur(6px)',
    transition: { duration: 0.3, ease: CINE_EASE_OUT }
  }
};

// Modal com slide vertical fluido e física elástica equilibrada (sem blur filter para evitar piscar de renderização)
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.96, 
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.25,
      ease: CINE_EASE
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.96, 
    y: 15,
    transition: { 
      duration: 0.2, 
      ease: CINE_EASE_OUT 
    }
  }
};

// Backdrop de modais com fade suave
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.25, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

// Rodapé fixo deslizando de baixo para cima com firmeza
export const footerSlideUpVariants: Variants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(6px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.45, 
      ease: CINE_EASE 
    } 
  },
  exit: { 
    opacity: 0, 
    y: 50, 
    filter: 'blur(6px)',
    transition: { 
      duration: 0.3, 
      ease: CINE_EASE_OUT 
    } 
  }
};
