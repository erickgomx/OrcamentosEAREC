import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ArrowRight, 
  Sparkles, 
  Clapperboard, 
  Film, 
  Video, 
  Camera, 
  MessageCircle, 
  Instagram, 
  CheckCircle,
  Sliders,
  Compass
} from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { AppConfig } from '../config/AppConfig';
import { fadeInUp, staggerContainer } from '../lib/animations';

/**
 * HomeView.tsx
 * ------------
 * Página Inicial Cinematográfica da EAREC Produtora Audiovisual.
 * 
 * ESTRUTURA:
 * 1. Navbar: Logotipo responsivo, link oficial do Instagram e botão direto "Fazer Orçamento".
 * 2. Hero Cinematográfico:
 *    - Moldura HUD Viewfinder com timecode dinâmico e resolução 4K DCI.
 *    - Player de Vídeo em loop (com áudio mudo por padrão exigido por navegadores).
 *    - Controles de reprodução: Play/Pause, Ativar/Desativar Som e Modo Tela Cheia.
 *    - Botões de Ação: "Simular Orçamento Online" e "Falar no WhatsApp".
 * 3. Seção "O Que Produzimos":
 *    - 4 Pilares: Filmes de Casamento, Comerciais & Marcas, Eventos Sociais e Estúdio/Drone 4K.
 *    - Cada card permite ir direto ao configurador com a categoria pré-selecionada.
 * 4. Diferenciais Técnicos: Padrão DaVinci Resolve, áudio profissional e orçamento transparente.
 * 5. Banner de Conversão Final e Rodapé com links e créditos.
 * 
 * COMO ALTERAR O VÍDEO:
 * Altere a propriedade SHOWREEL.VIDEO_URL no arquivo 'src/config/AppConfig.ts'.
 * É possível usar um arquivo local em 'public/showreel.mp4' ou uma URL externa de CDN.
 */

interface HomeViewProps {
  /** Função disparada ao clicar para iniciar orçamento, podendo passar a categoria padrão */
  onNavigateToQuote: (category?: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigateToQuote }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [timecode, setTimecode] = useState("00:00:12:08");

  // Simulação de timecode cinematográfico
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
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Olá! Estava navegando no site da EAREC e gostaria de saber mais sobre a produção audiovisual.`;
    window.open(`https://api.whatsapp.com/send?phone=${AppConfig.BRAND.WHATSAPP}&text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-neutral-100 selection:bg-brand-DEFAULT selection:text-white font-sans overflow-x-hidden relative">
      
      {/* GLOWS CINEMATOGRÁFICOS DE FUNDO */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-900/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-red-950/10 blur-[180px] rounded-full pointer-events-none -z-10" />

      {/* NAVBAR SUPERIOR */}
      <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo EAREC */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo className="w-40 sm:w-48" animate={false} />
          </div>

          {/* Links e Botão de Ação */}
          <div className="flex items-center gap-3 sm:gap-6">
            <a 
              href={AppConfig.BRAND.INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
            >
              <Instagram size={15} />
              <span>@earecmidia</span>
            </a>

            <button
              onClick={() => onNavigateToQuote()}
              className="relative group overflow-hidden px-4 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:shadow-[0_0_28px_rgba(220,38,38,0.55)] flex items-center gap-2"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>Fazer Orçamento</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </header>

      {/* HERO CINEMATOGRÁFICO COM VÍDEO SHOWREEL */}
      <section className="relative pt-8 pb-20 md:pt-14 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* BADGE DE GRAVAÇÃO (REC) */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 mb-6 backdrop-blur-md shadow-lg"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-neutral-300">
            REC • SHOWREEL OFICIAL
          </span>
          <span className="text-[11px] font-mono text-neutral-500 pl-2 border-l border-white/10 hidden sm:inline">
            {timecode}
          </span>
        </motion.div>

        {/* HEADLINE PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center max-w-4xl mb-8"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-tight tracking-tight mb-4">
            Histórias que emocionam.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-red-600 font-serif italic">
              Imagens que marcam.
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
            Do conceito à pós-produção cinematográfica: criamos comerciais de alto impacto, filmes de casamento inesquecíveis, eventos e produções aéreas com estética de cinema.
          </p>
        </motion.div>

        {/* PLAYER DE VÍDEO CINEMATOGRÁFICO COM INTERFACE VIEWFINDER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-5xl relative group rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.8)] bg-black"
        >
          {/* Efeito Moldura de Câmera de Cinema (HUD Viewfinder) */}
          <div className="absolute inset-0 pointer-events-none z-20 p-4 sm:p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start opacity-70">
              <div className="text-[10px] font-mono tracking-widest text-neutral-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>4K DCI • 24FPS</span>
              </div>
              <div className="text-[10px] font-mono tracking-widest text-neutral-400">
                LOG / DAVINCI WIDE GAMUT
              </div>
            </div>

            <div className="flex justify-between items-end opacity-70">
              <div className="text-[10px] font-mono tracking-widest text-neutral-400">
                PROD: EAREC FILMS
              </div>
              <div className="text-[10px] font-mono tracking-widest text-neutral-400">
                {timecode}
              </div>
            </div>
          </div>

          {/* Marcadores de cantos da tela */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/40 pointer-events-none z-20" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/40 pointer-events-none z-20" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/40 pointer-events-none z-20" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/40 pointer-events-none z-20" />

          {/* Tag central de foco sutil */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 rounded-full pointer-events-none z-20 opacity-30 group-hover:opacity-60 transition-opacity" />

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
              
              {/* Play/Pause e Som */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                  title={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>

                <button
                  onClick={toggleMute}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border backdrop-blur-md text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
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

              {/* Modo Tela Cheia */}
              <button
                onClick={handleFullscreen}
                className="p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                title="Tela Cheia"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

        </motion.div>

        {/* BOTÕES DE AÇÃO PRINCIPAL ABAIXO DO VÍDEO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => onNavigateToQuote()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium text-base tracking-wide transition-all shadow-[0_0_35px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
          >
            <Sparkles size={18} className="text-red-200" />
            <span>Simular Orçamento Online</span>
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={handleWhatsApp}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-white/15 text-neutral-200 hover:text-white font-medium text-base tracking-wide transition-all backdrop-blur-md flex items-center justify-center gap-3 hover:-translate-y-0.5"
          >
            <MessageCircle size={18} className="text-emerald-400" />
            <span>Falar no WhatsApp</span>
          </button>
        </motion.div>

      </section>

      {/* SEÇÃO: SERVIÇOS & ESPECIALIDADES AUDIOVISUAIS */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-red-600" />
            <span className="text-xs uppercase tracking-[0.25em] text-red-500 font-bold">O Que Produzimos</span>
            <div className="h-px w-8 bg-red-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight">
            Soluções completas para cada momento e objetivo
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-4 font-light">
            Selecione uma especialidade abaixo para simular valores instantaneamente em nosso configurador online.
          </p>
        </div>

        {/* GRID DOS 4 PILARES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: Casamentos & Romances */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-neutral-900/60 border border-white/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl hover:border-red-600/40"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-3xl pointer-events-none group-hover:bg-red-600/10 transition-colors" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-red-500 mb-6 shadow-md">
                <Clapperboard size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">Filmes de Casamento</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-light">
                Narrativas sensíveis e cinematográficas para eternizar o dia mais especial da sua vida. Cobertura completa da cerimônia, making-of e filmes highlight em 4K.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Pré-Wedding', 'Making Of', 'Cerimônia', 'Highlight 4K', 'Teaser Reels'].map((tag) => (
                  <span key={tag} className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onNavigateToQuote('wedding')}
              className="w-full py-3.5 px-5 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white border border-white/15 hover:border-red-500 text-neutral-200 text-sm font-medium tracking-wide transition-all flex items-center justify-between group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <span>Simular Orçamento de Casamento</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Card 2: Vídeos Comerciais & Publicidade */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-neutral-900/60 border border-white/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl hover:border-red-600/40"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-3xl pointer-events-none group-hover:bg-red-600/10 transition-colors" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-red-500 mb-6 shadow-md">
                <Video size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">Comerciais & Marcas</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-light">
                Filmes comerciais de alto impacto e autoridade visual. Vídeos verticais para Reels e TikTok, vídeos institucionais, lançamentos de produtos e gastronomia.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Reels / TikTok', 'Vídeos Institucionais', 'Catálogo de Produtos', 'Alta Conversão'].map((tag) => (
                  <span key={tag} className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onNavigateToQuote('commercial')}
              className="w-full py-3.5 px-5 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white border border-white/15 hover:border-red-500 text-neutral-200 text-sm font-medium tracking-wide transition-all flex items-center justify-between group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <span>Simular Vídeo Comercial</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Card 3: Eventos Sociais & Formaturas */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-neutral-900/60 border border-white/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl hover:border-red-600/40"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-3xl pointer-events-none group-hover:bg-red-600/10 transition-colors" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-red-500 mb-6 shadow-md">
                <Camera size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">Eventos Sociais & 15 Anos</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-light">
                Celebrações vibrantes capturadas com espontaneidade e energia. Coberturas completas para 15 anos, formaturas, batizados e eventos com entrega ágil.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['15 Anos', 'Formaturas & Bailes', 'Aniversários', 'Galeria Digital'].map((tag) => (
                  <span key={tag} className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onNavigateToQuote('social')}
              className="w-full py-3.5 px-5 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white border border-white/15 hover:border-red-500 text-neutral-200 text-sm font-medium tracking-wide transition-all flex items-center justify-between group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <span>Simular Cobertura de Evento</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Card 4: Estúdio & Imagens Aéreas */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-neutral-900/60 border border-white/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl hover:border-red-600/40"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-3xl pointer-events-none group-hover:bg-red-600/10 transition-colors" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-red-500 mb-6 shadow-md">
                <Film size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">Estúdio & Drone 4K</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-light">
                Tomadas aéreas estabilizadas para valorizar qualquer produção e estrutura de estúdio com iluminação controlada para videocasts e cursos online.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Drone Aéreo 4K', 'Estúdio Privado', 'Videocasts', 'Pacotes Personalizados'].map((tag) => (
                  <span key={tag} className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onNavigateToQuote('video_production')}
              className="w-full py-3.5 px-5 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white border border-white/15 hover:border-red-500 text-neutral-200 text-sm font-medium tracking-wide transition-all flex items-center justify-between group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <span>Personalizar Produção</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

        </div>

      </section>

      {/* DIFERENCIAIS TÉCNICOS & CINEMA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 bg-neutral-950/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-black border border-red-600/30 flex items-center justify-center text-red-500 shrink-0 shadow-lg">
              <Film size={22} />
            </div>
            <div>
              <h4 className="text-white font-serif text-lg mb-1">Color Grading Padrão Cinema</h4>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">
                Tratamento de cor profissional no DaVinci Resolve para dar textura, contraste e elegância cinematográfica única a cada cena.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-black border border-red-600/30 flex items-center justify-center text-red-500 shrink-0 shadow-lg">
              <Sliders size={22} />
            </div>
            <div>
              <h4 className="text-white font-serif text-lg mb-1">Orçamento Transparente</h4>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">
                Simule pacotes, horas, adicionais de drone e frete com total autonomia e clareza de valores antes mesmo de agendar.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-black border border-red-600/30 flex items-center justify-center text-red-500 shrink-0 shadow-lg">
              <Compass size={22} />
            </div>
            <div>
              <h4 className="text-white font-serif text-lg mb-1">Direção & Roteiro</h4>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">
                Acompanhamento completo desde o briefing e roteirização até a direção em cena para que o resultado supere as expectativas.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* BANNER FINAL DE CONVERSÃO */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-black border border-white/15 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4 relative z-10">
            Pronto para dar vida ao seu próximo projeto?
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto mb-8 relative z-10 font-light">
            Monte agora mesmo uma proposta sob medida com preços detalhados e envie diretamente para nossa equipe via WhatsApp.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => onNavigateToQuote()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-medium text-base tracking-wide transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_45px_rgba(220,38,38,0.6)] flex items-center justify-center gap-3"
            >
              <span>INICIAR ORÇAMENTO ONLINE</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 hover:text-white font-medium text-base transition-colors"
            >
              Tirar Dúvidas
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/10 bg-black/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo className="w-36" animate={false} />
            <span className="text-neutral-600 text-xs pl-4 border-l border-white/10">
              © {new Date().getFullYear()} EAREC. Todos os direitos reservados.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400">
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
              <Instagram size={14} />
              <span>Instagram</span>
            </a>
            <button 
              onClick={handleWhatsApp} 
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomeView;
