// ============================================================================
// EAREC AUDIOVISUAL - HERO BANNER DO ORÇAMENTO (Hero.tsx)
// ============================================================================
// Olá, dev! 👋
// Este é o topo acolhedor da página do configurador de orçamentos.
// 
// DESTAQUES VISUAIS:
// 1. Vídeo de textura cinematográfica de grão de filme 35mm em loop infinito.
// 2. Saudação calorosa personalizada com o nome do cliente.
// 3. Logotipo oficial responsivo com animação escalonada.
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, scaleIn } from '../../lib/animations';
import { QuoteData } from '../../types';
import Logo from '../ui/Logo';

interface HeroProps {
  data: QuoteData; 
}

/**
 * Componente Hero Compacto
 * ------------------------
 * Reduzido para ocupar menos espaço vertical, incentivando a interação
 * imediata com o configurador abaixo.
 */
const Hero: React.FC<HeroProps> = ({ data }) => {

  return (
    <section className="relative w-full min-h-[35vh] md:min-h-[50vh] flex items-center justify-center bg-black overflow-hidden border-b border-white/10">
      
      {/* BACKGROUND CINEMATOGRÁFICO: Vídeo de película analógica com filtro sépia/quente */}
      <motion.div 
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
          style={{ 
            filter: 'sepia(100%) saturate(500%) hue-rotate(-50deg) contrast(120%) brightness(0.6)' 
          }}
        >
          <source src="https://cdn.coverr.co/videos/coverr-film-grain-texture-overlay-5675/1080p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10" />
      </motion.div>

      {/* CONTEÚDO CENTRAL: Logo EAREC + Saudação personalizada */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-20 text-center px-6 max-w-5xl py-8 md:py-12"
      >
        <motion.div variants={fadeInUp} className="mb-4 flex justify-center">
            <Logo className="w-40 md:w-64" />
        </motion.div>
        
        {/* Cumprimento personalizado dinâmico */}
        <motion.h1 variants={fadeInUp} className="text-xl md:text-4xl text-white font-light mb-2 tracking-wide leading-tight">
          Olá, <span className="font-semibold">{data.client.name}</span>.
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-sm md:text-lg text-neutral-400 font-light max-w-2xl mx-auto">
            Configure seu orçamento gratuitamente!
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Hero;
