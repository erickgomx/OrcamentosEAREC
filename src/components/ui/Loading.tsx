// ============================================================================
// EAREC AUDIOVISUAL - TELA DE CARREGAMENTO CINEMATOGRÁFICA (Loading.tsx)
// ============================================================================
// Olá, dev! 👋
// Este componente é a tela de transição e carregamento em tela cheia (Splash/Loading).
//
// CARACTERÍSTICAS:
// 1. Pulso radial com atmosfera cinematográfica escura.
// 2. Logotipo EAREC respirando suavemente com animação contínua.
// 3. Barra de progresso infinita com gradiente brilhante vermelho (brand-DEFAULT).
// 4. Texto informativo customizável em caixa alta e espaçamento tipográfico aberto.
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = "Gerando Proposta..." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]"
    >
      {/* Background Pulse: luz ambiente que pulsa sutilmente */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-[#0a0a0a] to-black animate-pulse-slow" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Logomarca com efeito de pulsação suave */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="mb-8"
        >
          <Logo className="w-48 opacity-80" />
        </motion.div>

        {/* Loading Bar: linha de laser de progresso contínuo */}
        <div className="w-64 h-0.5 bg-neutral-800 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-DEFAULT to-transparent w-1/2"
          />
        </div>

        {/* Mensagem descritiva de estado (ex: "Gerando Proposta...") */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-xs tracking-[0.2em] text-neutral-500 uppercase font-medium"
        >
          {text}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loading;
