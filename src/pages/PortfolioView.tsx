import React, { useState, useRef, useEffect } from 'react';
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
  Clapperboard, 
  Film, 
  Video, 
  Camera, 
  MessageCircle, 
  Instagram, 
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';
import Logo from '../components/ui/Logo';
import { AppConfig } from '../config/AppConfig';
import { pageSlideVariants, slideFadeItem } from '../lib/animations';

/**
 * PortfolioView.tsx
 * -----------------
 * Página de Portfólio da EAREC Produtora Audiovisual.
 * 
 * ESTRUTURA E REQUISITOS:
 * 1. Interface limpa, minimalista e de fácil navegação (sem poluição visual).
 * 2. Top Bar com navegação ágil: botão de retorno à tela inicial e botão de orçamento.
 * 3. Vídeo de Apresentação (Showreel) em destaque:
 *    - Player de vídeo com HUD sutil (REC, Timecode, 4K DCI).
 *    - Controles de reprodução: Play/Pause, Ativar/Desativar Som e Tela Cheia.
 * 4. Grade "Outros Trabalhos":
 *    - Mostra os pilares audiovisuais (Casamentos, Comerciais, Eventos, Estúdio & Drone).
 *    - Cada item permite ir direto ao configurador com a categoria pré-selecionada.
 * 5. Seção de Fechamento com Botão de Acesso ao Instagram:
 *    - Destaque para o perfil @earecmidia no final da página para quem deseja ver mais.
 *    - Botão CTA para Simular Orçamento e contato via WhatsApp.
 * 6. Transição fluida com Framer Motion: elementos deslizam e surgem suavemente.
 */

interface PortfolioViewProps {
  /** Navega para a tela inicial */
  onBackToHome: () => void;
  /** Navega para a tela de orçamentos, opcionalmente com categoria selecionada */
  onNavigateToQuote: (category?: string) => void;
}

// Trabalhos em destaque da EAREC
const PORTFOLIO_PROJECTS = [
  {
    id: 'wedding',
    category: 'wedding',
    badge: 'Casamentos & Romances',
    title: 'Filmes de Casamento',
    description: 'Narrativas sensíveis e cinematográficas que eternizam o amor e cada emoção do dia mais importante.',
    tags: ['Pré-Wedding', 'Making Of', 'Cerimônia', 'Highlight 4K'],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    icon: Clapperboard,
    ctaText: 'Simular Casamento'
  },
  {
    id: 'commercial',
    category: 'commercial',
    badge: 'Marcas & Publicidade',
    title: 'Comerciais & Marcas',
    description: 'Filmes comerciais de alto impacto, autoridade de marca e vídeos verticais para Reels e TikTok com alta retenção.',
    tags: ['Reels / TikTok', 'Institucionais', 'Produtos', 'Alta Conversão'],
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    icon: Video,
    ctaText: 'Simular Comercial'
  },
  {
    id: 'social',
    category: 'social',
    badge: 'Celebrações & 15 Anos',
    title: 'Eventos Sociais & 15 Anos',
    description: 'Coberturas vibrantes com dinamismo, estética jovem e registros espontâneos para 15 anos, formaturas e celebrações.',
    tags: ['15 Anos', 'Formaturas', 'Festas', 'Galeria Digital'],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    icon: Camera,
    ctaText: 'Simular Evento'
  },
  {
    id: 'video_production',
    category: 'video_production',
    badge: 'Drone 4K & Estúdio',
    title: 'Estúdio & Drone 4K',
    description: 'Perspectivas aéreas arrebatadoras em 4K e estrutura de estúdio fechado com iluminação de cinema para videocasts e cursos.',
    tags: ['Drone Aéreo 4K', 'Estúdio', 'Videocasts', 'Projetos Especiais'],
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    icon: Film,
    ctaText: 'Simular Produção'
  }
];

const PortfolioView: React.FC<PortfolioViewProps> = ({ onBackToHome, onNavigateToQuote }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [timecode, setTimecode] = useState("01:00:12:08");
  const [activeFilter, setActiveFilter] = useState<'all' | 'wedding' | 'commercial' | 'social' | 'video_production'>('all');

  // Timecode dinâmico estilo viewfinder de câmera de cinema
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

  const handleWhatsApp = () => {
    const message = `Olá! Estava visualizando o portfólio da EAREC e gostaria de saber mais sobre a produção audiovisual.`;
    window.open(`https://api.whatsapp.com/send?phone=${AppConfig.BRAND.WHATSAPP}&text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filtragem dos projetos
  const filteredProjects = activeFilter === 'all' 
    ? PORTFOLIO_PROJECTS 
    : PORTFOLIO_PROJECTS.filter(p => p.category === activeFilter);

  return (
    <motion.div 
      variants={pageSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-screen bg-[#0a0a0a] text-neutral-100 selection:bg-brand-DEFAULT selection:text-white font-sans overflow-x-hidden relative"
    >
      {/* ILUMINAÇÃO DE FUNDO SUTIL (Glows escuros) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-900/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-red-950/10 blur-[180px] rounded-full pointer-events-none -z-10" />

      {/* 1. TOP NAVBAR SUPERIOR */}
      <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Botão Voltar para Tela Inicial */}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-all group"
            title="Voltar para a tela de escolha inicial"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-red-500" />
            <span className="hidden sm:inline">Início</span>
          </button>

          {/* Logo Central EAREC */}
          <div className="cursor-pointer" onClick={onBackToHome}>
            <Logo className="w-36 sm:w-44" animate={false} />
          </div>

          {/* Botão de Ação Direta para Orçamento */}
          <button
            onClick={() => onNavigateToQuote()}
            className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:shadow-[0_0_25px_rgba(220,38,38,0.55)] flex items-center gap-2"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Fazer Orçamento</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

        </div>
      </header>

      {/* 2. HERO: VÍDEO DE APRESENTAÇÃO (SHOWREEL) */}
      <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* BADGE DE APRESENTAÇÃO */}
        <motion.div 
          variants={slideFadeItem}
          className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 mb-6 backdrop-blur-md shadow-lg"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-neutral-300">
            SHOWREEL OFICIAL • APRESENTAÇÃO
          </span>
          <span className="text-[11px] font-mono text-neutral-500 pl-2 border-l border-white/10 hidden sm:inline">
            {timecode}
          </span>
        </motion.div>

        {/* TÍTULO & SUBTÍTULO */}
        <motion.div
          variants={slideFadeItem}
          className="text-center max-w-3xl mb-8"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white leading-tight tracking-tight mb-3">
            Histórias que emocionam.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-red-600 font-serif italic">
              Imagens que marcam.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
            Assista ao nosso vídeo de apresentação e confira a essência e o acabamento cinematográfico presente em cada produção da EAREC.
          </p>
        </motion.div>

        {/* PLAYER DE VÍDEO CINEMATOGRÁFICO CLEAN */}
        <motion.div 
          variants={slideFadeItem}
          className="w-full max-w-5xl relative group rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.85)] bg-black"
        >
          {/* Moldura HUD de Câmera de Cinema */}
          <div className="absolute inset-0 pointer-events-none z-20 p-4 sm:p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start opacity-70">
              <div className="text-[10px] font-mono tracking-widest text-neutral-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>4K DCI • 24FPS</span>
              </div>
              <div className="text-[10px] font-mono tracking-widest text-neutral-400">
                DAVINCI COLOR PIPELINE
              </div>
            </div>

            <div className="flex justify-between items-end opacity-70">
              <div className="text-[10px] font-mono tracking-widest text-neutral-400">
                EAREC CINEMA & FILMS
              </div>
              <div className="text-[10px] font-mono tracking-widest text-neutral-400">
                {timecode}
              </div>
            </div>
          </div>

          {/* Marcadores de cantos sutis */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/30 pointer-events-none z-20" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/30 pointer-events-none z-20" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/30 pointer-events-none z-20" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/30 pointer-events-none z-20" />

          {/* Vídeo HTML5 */}
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
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />

            {/* Vinheta escura nas bordas do vídeo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-10" />

            {/* Barra de Controles Flutuante */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-30 flex items-center justify-between gap-3">
              
              {/* Controles de Reprodução e Áudio */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                  title={isPlaying ? "Pausar Vídeo" : "Reproduzir Vídeo"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5 fill-current" />}
                </button>

                <button
                  onClick={toggleMute}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border backdrop-blur-md text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                    isMuted 
                      ? 'bg-neutral-900/80 border-white/20 text-neutral-300 hover:text-white hover:border-white/40' 
                      : 'bg-red-600/90 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                  }`}
                  title={isMuted ? "Ativar Áudio" : "Silenciar Áudio"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="animate-pulse" />}
                  <span>{isMuted ? "Ativar Som" : "Áudio Ligado"}</span>
                </button>
              </div>

              {/* Botão Tela Cheia */}
              <button
                onClick={handleFullscreen}
                className="p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                title="Modo Tela Cheia"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

        </motion.div>

        {/* AÇÕES ABAIXO DO SHOWREEL */}
        <motion.div 
          variants={slideFadeItem}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => onNavigateToQuote()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(220,38,38,0.35)] hover:shadow-[0_0_35px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2.5 group"
          >
            <Sparkles size={16} className="text-red-200" />
            <span>Simular Orçamento Online</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleWhatsApp}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-white/15 text-neutral-200 hover:text-white font-medium text-sm tracking-wide transition-all backdrop-blur-md flex items-center justify-center gap-2.5"
          >
            <MessageCircle size={16} className="text-emerald-400" />
            <span>Falar no WhatsApp</span>
          </button>
        </motion.div>

      </section>

      {/* 3. SEÇÃO: OUTROS TRABALHOS (GRADE LIMPA E MODERNA) */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        
        {/* Cabeçalho da Seção */}
        <motion.div variants={slideFadeItem} className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <div className="h-px w-8 bg-red-600" />
            <span className="text-xs uppercase tracking-[0.25em] text-red-500 font-mono font-bold">
              Galeria de Produções
            </span>
            <div className="h-px w-8 bg-red-600" />
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white leading-tight">
            Outros Trabalhos & Especialidades
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-3 font-light">
            Explore nossas frentes de atuação e simule os valores correspondentes de forma transparente.
          </p>
        </motion.div>

        {/* FILTROS RÁPIDOS */}
        <motion.div variants={slideFadeItem} className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'Todos os Trabalhos' },
            { id: 'wedding', label: 'Casamentos' },
            { id: 'commercial', label: 'Comerciais & Marcas' },
            { id: 'social', label: 'Eventos Sociais' },
            { id: 'video_production', label: 'Drone & Estúdio' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                activeFilter === tab.id
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* GRID DOS PROJETOS */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const IconComponent = project.icon;
              return (
                <motion.div
                  layout
                  key={project.id}
                  variants={slideFadeItem}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl bg-neutral-900/70 border border-white/10 overflow-hidden flex flex-col justify-between group shadow-xl hover:border-red-600/40 transition-colors"
                >
                  {/* Imagem de Capa do Trabalho */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                    
                    {/* Badge da Categoria sobreposta */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono uppercase tracking-wider text-neutral-200">
                      <IconComponent size={13} className="text-red-500" />
                      <span>{project.badge}</span>
                    </div>
                  </div>

                  {/* Informações do Trabalho */}
                  <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif text-white mb-2 group-hover:text-red-100 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-neutral-400 font-light leading-relaxed mb-5">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="text-[11px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Botão de Orçamento Específico */}
                    <button
                      onClick={() => onNavigateToQuote(project.category)}
                      className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white border border-white/15 hover:border-red-500 text-neutral-200 text-sm font-medium tracking-wide transition-all flex items-center justify-between group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] mt-auto"
                    >
                      <span>{project.ctaText}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </section>

      {/* 4. SEÇÃO FINAL: CONHECER MAIS NO INSTAGRAM + AÇÃO DE ORÇAMENTO */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-white/10">
        <motion.div 
          variants={slideFadeItem}
          className="rounded-3xl bg-gradient-to-b from-[#180a0a] via-neutral-900 to-black border border-white/15 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl"
        >
          {/* Efeito Glow Central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Ícone Instagram em Destaque */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-0.5 mb-6 shadow-xl shadow-red-950/40">
              <div className="w-full h-full bg-black/80 rounded-[14px] flex items-center justify-center text-white backdrop-blur-sm">
                <Instagram size={30} />
              </div>
            </div>

            <span className="text-xs uppercase tracking-[0.3em] font-mono text-neutral-400 mb-2">
              Quer conhecer mais sobre o nosso trabalho?
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white mb-4 max-w-2xl leading-tight">
              Siga nosso Instagram oficial e veja produções em tempo real
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light leading-relaxed">
              Publicamos diariamente bastidores de filmagem, cortes cinematográficos, fotos de ensaios e feedbacks reais de clientes que confiaram na EAREC.
            </p>

            {/* BOTÃO PRINCIPAL DE ACESSO AO INSTAGRAM (SOLICITADO PELO USUÁRIO) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-8">
              <motion.a
                href={AppConfig.BRAND.INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#200808] via-[#330a0a] to-[#200808] hover:from-red-950 hover:to-neutral-900 border border-red-500/50 hover:border-red-400 text-white font-medium text-base tracking-wide transition-all shadow-[0_0_30px_rgba(220,38,38,0.25)] hover:shadow-[0_0_40px_rgba(220,38,38,0.45)] flex items-center justify-center gap-3 group"
              >
                <Instagram size={20} className="text-red-400 group-hover:text-white transition-colors" />
                <span>Acessar Instagram @earecmidia</span>
                <ExternalLink size={16} className="text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </motion.a>

              <button
                onClick={() => onNavigateToQuote()}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-medium text-base tracking-wide transition-all shadow-[0_0_25px_rgba(220,38,38,0.35)] flex items-center justify-center gap-2.5"
              >
                <Sparkles size={18} />
                <span>Simular Orçamento Online</span>
              </button>
            </div>

            {/* Link alternativo de WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2 underline underline-offset-4"
            >
              <MessageCircle size={15} className="text-emerald-400" />
              <span>Prefere tirar dúvidas diretamente no WhatsApp? Clique aqui</span>
            </button>

          </div>

        </motion.div>
      </section>

      {/* 5. FOOTER */}
      <footer className="w-full border-t border-white/10 bg-black/90 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo className="w-32" animate={false} />
            <span className="text-neutral-600 text-xs pl-4 border-l border-white/10 font-mono">
              © {new Date().getFullYear()} EAREC. Todos os direitos reservados.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400 font-mono">
            <button 
              onClick={onBackToHome} 
              className="hover:text-white transition-colors"
            >
              Início
            </button>
            <button 
              onClick={() => onNavigateToQuote()} 
              className="hover:text-white transition-colors"
            >
              Orçamentos
            </button>
            <a 
              href={AppConfig.BRAND.INSTAGRAM_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Instagram size={13} />
              <span>@earecmidia</span>
            </a>
          </div>
        </div>
      </footer>

    </motion.div>
  );
};

export default PortfolioView;
