import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Instagram, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Images
} from 'lucide-react';
import Logo from '../components/ui/Logo';
import { AppConfig } from '../config/AppConfig';
import { pageSlideVariants, slideFadeItem } from '../lib/animations';
import instagramMediaData from '../data/instagramMedia.json';

/**
 * PortfolioView.tsx
 * -----------------
 * Página de Portfólio Clean da EAREC.
 * 
 * DIRETRIZES DO DESIGN:
 * 1. Mínimo de texto possível, destacando o visual e as mídias.
 * 2. Sem o badge de "Showreel oficial...".
 * 3. Sem botões de orçamento repetidos pela página:
 *    Apenas UM botão fixo sutil, flutuante e discreto para prosseguir para o orçamento.
 * 4. Galeria com mídias reais do Instagram (@earecmidia) salvas localmente.
 * 5. Modal / Lightbox seguro e acessível:
 *    - Tecla ESC fecha imediatamente.
 *    - Clique no fundo fecha imediatamente.
 *    - Botão "Fechar" fixo de alto contraste no canto superior.
 *    - Botão "Sair" explícito no rodapé do player.
 *    - Proporção 9:16 vertical perfeita para os Reels sem quebrar a tela.
 */

interface PortfolioViewProps {
  onBackToHome: () => void;
  onNavigateToQuote: (category?: string) => void;
}

export interface InstagramMediaItem {
  id: string;
  type: 'photo' | 'video';
  shortcode: string;
  instagramUrl: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  mediaUrl: string;
  coverUrl: string;
  gallery?: string[];
  tags: string[];
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ onBackToHome, onNavigateToQuote }) => {
  // Controle do Player de Vídeo Showreel Principal
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [timecode, setTimecode] = useState("01:00:12:08");

  // Filtros da Galeria
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'photo' | 'wedding' | 'commercial'>('all');

  // Modal / Lightbox do Instagram
  const [selectedItem, setSelectedItem] = useState<InstagramMediaItem | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Garante que o componente está montado no DOM antes de usar createPortal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Timecode dinâmico estilo viewfinder de cinema
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const frames = Math.floor((now.getMilliseconds() / 1000) * 24).toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimecode(`01:${minutes}:${seconds}:${frames}`);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Fechamento via Tecla ESC e trava de scroll do fundo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    if (selectedItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const openModal = (item: InstagramMediaItem) => {
    setSelectedItem(item);
    setGalleryIndex(0);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const instagramItems = (instagramMediaData as InstagramMediaItem[]).filter(item => {
    if (mediaFilter === 'all') return true;
    if (mediaFilter === 'video') return item.type === 'video';
    if (mediaFilter === 'photo') return item.type === 'photo';
    if (mediaFilter === 'wedding') return item.category === 'wedding';
    if (mediaFilter === 'commercial') return item.category === 'commercial';
    return true;
  });

  return (
    <motion.div 
      variants={pageSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-screen text-neutral-100 selection:bg-brand-DEFAULT selection:text-white font-sans overflow-x-hidden relative pb-28"
    >
      {/* 1. NAVBAR MINIMALISTA */}
      <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-all group"
            title="Voltar para o início"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-red-500" />
            <span>Início</span>
          </button>

          <div className="cursor-pointer" onClick={onBackToHome}>
            <Logo className="w-32 sm:w-40" animate={false} />
          </div>

          <div className="w-[70px]" />
        </div>
      </header>

      {/* 2. VÍDEO SHOWREEL LIMPO (SEM BADGE, MÍNIMO DE TEXTO) */}
      <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center">
        
        <motion.div 
          variants={slideFadeItem}
          className="w-full relative group rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.85)] bg-black"
        >
          {/* HUD Viewfinder */}
          <div className="absolute inset-0 pointer-events-none z-20 p-4 sm:p-6 flex flex-col justify-between opacity-60">
            <div className="flex justify-between items-start text-[10px] font-mono tracking-widest text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span>4K DCI</span>
              </div>
              <div>EAREC FILMS</div>
            </div>

            <div className="flex justify-between items-end text-[10px] font-mono tracking-widest text-neutral-400">
              <div>DAVINCI COLOR</div>
              <div>{timecode}</div>
            </div>
          </div>

          {/* Vídeo */}
          <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden">
            <video
              ref={videoRef}
              src={videoError ? AppConfig.SHOWREEL.FALLBACK_URL : AppConfig.SHOWREEL.VIDEO_URL}
              poster={AppConfig.SHOWREEL.POSTER_URL}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none z-10" />

            {/* Controles Flutuantes */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95"
                  title={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5 fill-current" />}
                </button>

                <button
                  onClick={toggleMute}
                  className={`px-3.5 py-2 rounded-full border backdrop-blur-md text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all ${
                    isMuted 
                      ? 'bg-neutral-900/80 border-white/20 text-neutral-300 hover:text-white' 
                      : 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                  }`}
                  title={isMuted ? "Ativar Áudio" : "Silenciar Áudio"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-pulse" />}
                  <span>{isMuted ? "Som" : "Ligado"}</span>
                </button>
              </div>

              <button
                onClick={handleFullscreen}
                className="p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95"
                title="Tela Cheia"
              >
                <Maximize2 size={15} />
              </button>
            </div>
          </div>
        </motion.div>

      </section>

      {/* 3. GALERIA DE TRABALHOS (MÍDIAS REAIS DO INSTAGRAM) */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        
        <motion.div variants={slideFadeItem} className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white">
            Trabalhos Recentes
          </h2>
        </motion.div>

        {/* Filtros Rápidos */}
        <motion.div variants={slideFadeItem} className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'video', label: 'Vídeos' },
            { id: 'photo', label: 'Fotos' },
            { id: 'wedding', label: 'Casamentos' },
            { id: 'commercial', label: 'Comerciais' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMediaFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                mediaFilter === tab.id
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Grade de Mídias */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {instagramItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                variants={slideFadeItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl bg-neutral-900/60 border border-white/10 overflow-hidden flex flex-col justify-between group shadow-xl hover:border-white/30 transition-colors"
              >
                {/* Capa Clicável */}
                <div 
                  onClick={() => openModal(item)}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-950 cursor-pointer"
                >
                  <img 
                    src={item.coverUrl} 
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  
                  {/* Badge de Tipo */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase text-neutral-200">
                    {item.type === 'video' ? (
                      <>
                        <Play size={10} className="text-red-500 fill-current" />
                        <span>Vídeo</span>
                      </>
                    ) : (
                      <>
                        <Images size={10} className="text-amber-400" />
                        <span>Fotos</span>
                      </>
                    )}
                  </div>

                  {/* Play Centralizado */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all backdrop-blur-sm">
                      {item.type === 'video' ? (
                        <Play size={18} className="ml-0.5 fill-current" />
                      ) : (
                        <Images size={18} />
                      )}
                    </div>
                  </div>

                  {/* Título na Base */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-serif text-white group-hover:text-red-100 transition-colors drop-shadow-md">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      {item.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Rodapé do Card */}
                <div className="p-4 flex items-center justify-between text-xs text-neutral-400 border-t border-white/5">
                  <button
                    onClick={() => openModal(item)}
                    className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
                  >
                    <span>Ver em Tela Cheia</span>
                  </button>

                  <a
                    href={item.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1 text-xs font-mono"
                    title="Ver no Instagram"
                  >
                    <Instagram size={13} />
                    <span>Instagram</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </section>

      {/* 4. SEÇÃO FINAL: INSTAGRAM OFICIAL */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-white/10">
        <motion.div 
          variants={slideFadeItem}
          className="rounded-3xl bg-neutral-900/60 border border-white/15 p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-0.5 mb-5 shadow-lg">
            <div className="w-full h-full bg-black/80 rounded-[14px] flex items-center justify-center text-white">
              <Instagram size={24} />
            </div>
          </div>

          <h2 className="text-xl sm:text-3xl font-serif text-white mb-2">
            Acompanhe Nosso Instagram
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto mb-6 font-light">
            Publicações diárias de novos filmes, ensaios e bastidores de gravação.
          </p>

          <a
            href={AppConfig.BRAND.INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-white/20 hover:border-red-500/50 text-white text-xs sm:text-sm font-medium tracking-wide transition-all shadow-lg flex items-center gap-2.5 group"
          >
            <Instagram size={16} className="text-red-400 group-hover:text-white transition-colors" />
            <span>@earecmidia</span>
            <ExternalLink size={13} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>
      </section>

      {/* ============================================================== */}
      {/* 5. MODAL / LIGHTBOX SEGURO, FLUIDO E RESILIENTE (VIA PORTAL)   */}
      {/* Renderizado diretamente no body para ficar imune a transforms */}
      {/* ============================================================== */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedItem && (
            <div 
              onClick={(e) => {
                // Clicar fora da caixa fecha imediatamente
                if (e.target === e.currentTarget) closeModal();
              }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto"
            >
              {/* BOTÃO GLOBAL FIXO DE FECHAR NO CANTO SUPERIOR (NUNCA É COBERTO) */}
              <button
                onClick={closeModal}
                className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[120] flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/90 hover:bg-red-600 border border-white/20 text-white text-xs font-mono tracking-wider shadow-2xl backdrop-blur-md transition-all active:scale-95 group cursor-pointer"
                title="Fechar (Esc)"
              >
                <X size={16} className="group-hover:rotate-90 transition-transform" />
                <span>Fechar (Esc)</span>
              </button>

              {/* CAIXA DO CONTEÚDO */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={`relative bg-neutral-950 border border-white/15 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col my-auto ${
                  selectedItem.type === 'video' 
                    ? 'w-full max-w-[380px] sm:max-w-[420px]' 
                    : 'w-full max-w-2xl'
                }`}
              >
                {/* ÁREA VISUAL */}
                <div className="relative w-full bg-black flex items-center justify-center overflow-hidden">
                  {selectedItem.type === 'video' ? (
                    /* Vídeo Reel Vertical Adaptado */
                    <div className="relative w-full flex items-center justify-center bg-black aspect-[9/16] max-h-[70vh]">
                      <video
                        src={selectedItem.mediaUrl}
                        poster={selectedItem.coverUrl}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    /* Ensaio de Fotos */
                    <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] max-h-[68vh] flex items-center justify-center bg-black">
                      {selectedItem.gallery && selectedItem.gallery.length > 0 ? (
                        <>
                          <img
                            src={selectedItem.gallery[galleryIndex]}
                            alt={selectedItem.title}
                            className="w-full h-full object-contain select-none"
                          />
                          {selectedItem.gallery.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGalleryIndex((prev) => (prev > 0 ? prev - 1 : selectedItem.gallery!.length - 1));
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all active:scale-95"
                                title="Foto anterior"
                              >
                                <ChevronLeft size={20} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGalleryIndex((prev) => (prev < selectedItem.gallery!.length - 1 ? prev + 1 : 0));
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all active:scale-95"
                                title="Próxima foto"
                              >
                                <ChevronRight size={20} />
                              </button>
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 border border-white/10 text-xs font-mono text-white">
                                {galleryIndex + 1} / {selectedItem.gallery.length}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <img
                          src={selectedItem.mediaUrl}
                          alt={selectedItem.title}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* BARRA INFERIOR COM BOTÕES CLAROS DE AÇÃO */}
                <div className="p-4 flex items-center justify-between border-t border-white/10 bg-neutral-900/95 gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-serif text-white truncate">
                      {selectedItem.title}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      {selectedItem.categoryLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={selectedItem.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-all"
                      title="Ver no Instagram"
                    >
                      <Instagram size={13} className="text-red-400" />
                      <span className="hidden sm:inline">Instagram</span>
                      <ExternalLink size={11} />
                    </a>

                    {/* Botão Sair Explícito */}
                    <button
                      onClick={closeModal}
                      className="py-1.5 px-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-mono transition-all font-medium cursor-pointer"
                    >
                      Sair
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 6. BOTÃO FLUTUANTE QUE SEGUE A NAVEGAÇÃO DO USUÁRIO NA PÁGINA  */}
      {/* Ancorado diretamente no viewport (body) via createPortal       */}
      {/* ============================================================== */}
      {mounted && createPortal(
        <AnimatePresence>
          {!selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="fixed bottom-6 right-6 z-50 pointer-events-auto"
            >
              <motion.button
                onClick={() => onNavigateToQuote()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-red-500/40 hover:border-red-500 text-white text-xs sm:text-sm font-medium tracking-wide shadow-[0_4px_25px_rgba(220,38,38,0.35)] backdrop-blur-md transition-all group cursor-pointer"
                title="Iniciar simulação de orçamento online"
              >
                <Sparkles size={14} className="text-red-500 group-hover:rotate-12 transition-transform" />
                <span>Fazer Orçamento</span>
                <ArrowRight size={13} className="text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </motion.div>
  );
};

export default PortfolioView;
