import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Film, Sparkles, Play } from 'lucide-react';
import Logo from '../components/ui/Logo';
import { pageSlideVariants, slideFadeItem } from '../lib/animations';

/**
 * IntroView.tsx
 * -------------
 * Primeira tela (Tela Inicial / Escolha de Entrada) da EAREC.
 * 
 * OBJETIVO:
 * Apresentar ao visitante uma escolha clara, elegante e cinematográfica:
 * 1. "Conhecer Trabalho": Direciona para a página de Portfólio (/portfolio),
 *    onde o cliente assiste ao vídeo de apresentação (showreel) e outros trabalhos.
 * 2. "Iniciar Orçamento": Direciona para o fluxo de orçamentação online (/orcamentos),
 *    permitindo calcular valores e serviços sob medida.
 * 
 * TRANSIÇÕES:
 * Utiliza Framer Motion com deslizamento e fade suave tanto na entrada quanto na saída,
 * criando a experiência fluida solicitada pelo usuário.
 */

interface IntroViewProps {
  /** Disparado ao escolher conhecer o portfólio / trabalhos */
  onSelectPortfolio: () => void;
  /** Disparado ao escolher iniciar a simulação de orçamento */
  onSelectQuote: () => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onSelectPortfolio, onSelectQuote }) => {
  return (
    <motion.div 
      variants={pageSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 py-12"
    >
      {/* GLOWS CINEMATOGRÁFICOS DE FUNDO */}
      <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] bg-red-900/10 blur-[140px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] bg-red-950/15 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      {/* CONTAINER CENTRAL */}
      <div className="relative z-10 w-full max-w-xl text-center flex flex-col items-center">
        
        {/* LOGO EAREC */}
        <motion.div variants={slideFadeItem} className="flex justify-center mb-8 md:mb-10">
          <Logo className="w-56 sm:w-72 md:w-80" animate={true} />
        </motion.div>

        {/* PERGUNTA CENTRAL */}
        <motion.div variants={slideFadeItem} className="mb-8 sm:mb-10 px-2">
          <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-red-500 font-mono mb-3 bg-red-950/40 border border-red-900/30 px-3.5 py-1 rounded-full">
            Boas-vindas à EAREC
          </span>
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-serif font-light leading-snug drop-shadow-md">
            Você já conhece nosso trabalho<br className="hidden sm:inline" /> ou deseja fazer um orçamento?
          </h1>
        </motion.div>

        {/* GRUPO DE OPÇÕES */}
        <div className="w-full flex flex-col gap-4 sm:gap-5 px-2">
          
          {/* OPÇÃO 1: CONHECER TRABALHO / VER PORTFÓLIO */}
          <motion.div variants={slideFadeItem}>
            <motion.button 
              onClick={onSelectPortfolio}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              className="w-full text-left cursor-pointer group relative rounded-2xl overflow-hidden p-5 sm:p-6 border border-white/15 hover:border-red-500/60 bg-gradient-to-r from-neutral-900/90 via-neutral-900/80 to-[#180a0a] transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(220,38,38,0.25)] flex items-center justify-between gap-4"
            >
              {/* Efeito de brilho sutil no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shrink-0 shadow-md">
                  <Play size={22} className="ml-0.5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block mb-1">
                    Apresentação & Vídeos
                  </span>
                  <h3 className="text-lg sm:text-xl font-medium text-white group-hover:text-red-100 transition-colors">
                    Conhecer Nosso Trabalho
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light mt-0.5">
                    Assista nosso showreel oficial e projetos recentes
                  </p>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-red-500/50 group-hover:bg-red-600/20 group-hover:translate-x-1 transition-all shrink-0">
                <ArrowRight size={18} />
              </div>
            </motion.button>
          </motion.div>

          {/* DIVISOR ELEGANTE */}
          <motion.div variants={slideFadeItem} className="flex items-center gap-4 my-1 opacity-60">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
            <span className="text-[11px] tracking-[0.25em] text-neutral-400 uppercase font-mono font-medium">Ou</span>
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
          </motion.div>

          {/* OPÇÃO 2: INICIAR ORÇAMENTO */}
          <motion.div variants={slideFadeItem}>
            <motion.button 
              onClick={onSelectQuote}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              className="w-full text-left cursor-pointer group relative rounded-2xl overflow-hidden p-5 sm:p-6 border border-red-600/40 hover:border-red-500 bg-gradient-to-r from-[#200808] via-neutral-900 to-neutral-900 transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_rgba(220,38,38,0.35)] flex items-center justify-between gap-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)] shrink-0">
                  <Sparkles size={22} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-red-400 font-mono block mb-1">
                    Simulação Instantânea
                  </span>
                  <h3 className="text-lg sm:text-xl font-medium text-white group-hover:text-red-100 transition-colors">
                    Iniciar Orçamento Online
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light mt-0.5">
                    Calcule valores, pacotes e monte sua proposta na hora
                  </p>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:text-white group-hover:bg-red-600 group-hover:translate-x-1 transition-all shrink-0 relative z-10">
                <ArrowRight size={18} />
              </div>
            </motion.button>
          </motion.div>

        </div>

        {/* RODAPÉ MINIMALISTA */}
        <motion.p variants={slideFadeItem} className="mt-12 text-neutral-500/60 text-[10px] tracking-[0.35em] uppercase font-mono">
          Experiência de Cinema • EAREC Produtora
        </motion.p>

      </div>
    </motion.div>
  );
};

export default IntroView;