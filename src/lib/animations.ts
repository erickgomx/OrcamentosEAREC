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

// Transição fluida de slide lateral e fade com blur para rotas (/inicio <-> /orcamento <-> /admin)
export const pageSlideVariants: Variants = {
  initial: (direction: number = 1) => ({
    opacity: 0,
    x: direction > 0 ? 50 : -50,
    scale: 0.985,
    filter: 'blur(8px)'
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: CINE_EASE
    }
  },
  exit: (direction: number = 1) => ({
    opacity: 0,
    x: direction > 0 ? -50 : 50,
    scale: 0.985,
    filter: 'blur(8px)',
    transition: {
      duration: 0.35,
      ease: CINE_EASE_OUT
    }
  })
};

// Transição de etapas do Wizard e Configurador (passos deslizantes com direção natural)
export const wizardStepVariants: Variants = {
  enter: (direction: number = 1) => ({
    opacity: 0,
    x: direction > 0 ? 70 : -70,
    scale: 0.97,
    filter: 'blur(8px)'
  }),
  center: {
    zIndex: 1,
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: CINE_EASE
    }
  },
  exit: (direction: number = 1) => ({
    zIndex: 0,
    opacity: 0,
    x: direction > 0 ? -70 : 70,
    scale: 0.97,
    filter: 'blur(8px)',
    transition: {
      duration: 0.35,
      ease: CINE_EASE_OUT
    }
  })
};

// Fade In Up aprimorado com desfoque óptico e slide vertical suave
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 25, 
    filter: 'blur(6px)' 
  },
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
    y: -20,
    filter: 'blur(6px)',
    transition: { 
      duration: 0.3, 
      ease: CINE_EASE_OUT 
    }
  }
};

// Container escalonado para orquestração de listas e cards
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
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

// Modal com slide vertical fluido e física elástica equilibrada
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: 35, 
    filter: 'blur(10px)' 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { 
      type: "spring", 
      stiffness: 380, 
      damping: 28 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.96, 
    y: 25,
    filter: 'blur(8px)',
    transition: { 
      duration: 0.22, 
      ease: CINE_EASE_IN 
    }
  }
};

// Backdrop de modais com fade e desfoque suave
export const backdropVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { 
    opacity: 1, 
    backdropFilter: 'blur(16px)',
    transition: { duration: 0.35, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.25, ease: "easeIn" }
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
