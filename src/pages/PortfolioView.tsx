// ============================================================================
// EAREC AUDIOVISUAL - VITRINE E PORTFÓLIO CINEMATOGRÁFICO (PortfolioView.tsx)
// ============================================================================
// Olá, dev! 👋
// Esta página apresenta os cases de sucesso e o estilo visual característico da EAREC:
// 1. Casamento (Wedding Films com multicâmera 4K e drone).
// 2. Comercial (Campanhas institucionais e vídeos com alta conversão para Reels/TikTok).
// 3. Social & Eventos (15 anos, formaturas e cobertura em tempo real).
// 4. Estúdio & Moda (Editoriais com iluminação técnica controlada).
//
// Ao final da navegação pela vitrine, o cliente é convidado por um CTA
// de alta conversão para simular seu próprio orçamento de forma instantânea.
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, Sparkles, Video, Film, Camera, Heart, Building2, CheckCircle2 } from 'lucide-react';
import Logo from '../components/ui/Logo';
import { pageContainerVariants, organicItemVariants, cardItemVariants, staggerContainer } from '../lib/animations';

interface PortfolioViewProps {
  onNavigateHome: () => void;
  onStartQuote: () => void;
}

// Lista curada de produções e cases do portfólio EAREC
const portfolioProjects = [
  {
    id: 1,
    category: 'Casamento',
    title: 'Ana & Lucas • Wedding Film',
    desc: 'Cobertura cinematográfica completa com captação multicâmera 4K, gravação de votos com áudio direto e cenas aéreas ao pôr do sol.',
    tag: 'Cinema 4K • Drone • Áudio Direto',
    icon: Heart,
    accent: '#DC2626'
  },
  {
    id: 2,
    category: 'Comercial',
    title: 'Campanha Institucional • Alfa Prime',
    desc: 'Filme publicitário focado em branding corporativo, color grading de cinema e dinamismo visual para anúncios digitais.',
    tag: 'Comercial • Color Grading • Reels',
    icon: Building2,
    accent: '#EA580C'
  },
  {
    id: 3,
    category: 'Social & Eventos',
    title: 'Gala 15 Anos • Noite das Estrelas',
    desc: 'Experiência imersiva em tempo real com entrega expressa para redes sociais durante o evento e aftermovie emocional.',
    tag: 'Tempo Real • Aftermovie • Multicâmera',
    icon: Sparkles,
    accent: '#DC2626'
  },
  {
    id: 4,
    category: 'Estúdio & Moda',
    title: 'Editorial de Marca • Coleção Origens',
    desc: 'Iluminação técnica de estúdio, direção de modelos e ensaio híbrido de fotos em alta resolução combinadas com vídeos curtos.',
    tag: 'Estúdio • Foto & Vídeo • Retratos',
    icon: Camera,
    accent: '#B91C1C'
  }
];

const PortfolioView: React.FC<PortfolioViewProps> = ({ onNavigateHome, onStartQuote }) => {
  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-start relative overflow-x-hidden px-4 md:px-6 py-8 md:py-12">
      
      {/* Ambient Cinema Lighting: Luzes volumétricas vermelhas e neutras */}
      <div className="fixed top-1/4 -left-32 w-[500px] h-[500px] bg-red-950/20 blur-[140px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-1/4 -right-32 w-[500px] h-[500px] bg-neutral-800/25 blur-[160px] rounded-full pointer-events-none mix-blend-screen" />

      {/* Header com Navegação: Voltar ao Início / Logo / Iniciar Orçamento */}
      <header className="relative z-20 w-full max-w-5xl flex items-center justify-between mb-8 md:mb-12">
        <button 
          onClick={onNavigateHome}
          className="p-2.5 rounded-full bg-white/80 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all flex items-center gap-2 group shadow-sm dark:shadow-none"
          title="Voltar ao Início"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-semibold pr-1 hidden sm:inline">Início</span>
        </button>

        <Logo className="w-48 sm:w-56 md:w-64 opacity-95" />

        <button 
          onClick={onStartQuote}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-brand-DEFAULT hover:bg-brand-hover text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center gap-2"
        >
          <span>Orçamento</span>
          <ArrowRight className="w-4 h-4 hidden sm:inline" />
        </button>
      </header>

      {/* Conteúdo Principal do Portfólio */}
      <motion.main 
        variants={pageContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center pb-20"
      >
        {/* Título de Apresentação da Vitrine */}
        <motion.div variants={organicItemVariants} className="max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="text-neutral-400 text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold mb-2">
            Vitrine Cinematográfica
          </p>
          <h1 className="text-neutral-900 dark:text-white text-2xl sm:text-3xl md:text-5xl font-serif leading-tight">
            Produções que Revelam o Seu Melhor
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-4 font-light leading-relaxed">
            Cada filme é planejado e executado com rigor estético, captação 4K com câmeras de cinema, color grading profissional e mixagem de som envolvente.
          </p>
        </motion.div>

        {/* Grid de Projetos do Portfólio */}
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full text-left"
        >
          {portfolioProjects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.article 
                key={project.id}
                custom={index}
                variants={cardItemVariants}
                whileHover={{ y: -3, scale: 1.015 }}
                className="group relative rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-neutral-900/80 border border-neutral-200 dark:border-white/10 hover:border-brand-DEFAULT/40 transition-all duration-300 shadow-lg dark:shadow-xl backdrop-blur-md overflow-hidden flex flex-col justify-between min-h-[220px]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-DEFAULT/5 group-hover:bg-brand-DEFAULT/15 blur-2xl rounded-full transition-all duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-neutral-300 group-hover:text-white transition-colors">
                      <Icon size={14} className="text-brand-DEFAULT" />
                      {project.category}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-medium">
                      #0{project.id}
                    </span>
                  </div>

                  <h2 className="text-neutral-900 dark:text-white font-serif text-lg sm:text-xl font-bold mb-2 group-hover:text-brand-DEFAULT transition-colors leading-snug">
                    {project.title}
                  </h2>

                  <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                    {project.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs text-neutral-500 uppercase tracking-widest font-mono">
                    {project.tag}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-brand-DEFAULT group-hover:border-brand-DEFAULT transition-all">
                    <Play size={14} className="ml-0.5" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Call to Action Final para Iniciar Orçamento */}
        <motion.div 
          variants={organicItemVariants}
          className="mt-14 sm:mt-18 w-full max-w-2xl p-8 rounded-3xl bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-white/10 text-center shadow-xl dark:shadow-2xl relative overflow-hidden backdrop-blur-md"
        >
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-brand-DEFAULT to-transparent" />
          <h3 className="text-neutral-900 dark:text-white text-xl sm:text-2xl font-serif font-bold mb-3">
            Deseja uma produção como esta para seu projeto?
          </h3>
          <p className="text-neutral-400 text-xs sm:text-sm mb-6 max-w-md mx-auto">
            Simule valores em tempo real no nosso configurador e receba a proposta pronta no seu WhatsApp.
          </p>
          <button 
            onClick={onStartQuote}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-DEFAULT hover:bg-brand-hover text-white text-sm sm:text-base font-bold tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)] inline-flex items-center justify-center gap-3"
          >
            <span>Iniciar Orçamento Online</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>

      </motion.main>
    </div>
  );
};

export default PortfolioView;
