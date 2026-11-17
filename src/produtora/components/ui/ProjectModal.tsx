import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Camera,
  Clock,
  Film,
  Loader2,
  Palette,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  BRAND_CONTACT,
  buildWhatsAppBudgetUrl,
  navigateToBudgetCategories,
} from '../../data/portfolioData';
import {
  setIsAudioMuted,
  setModalCase,
  useExperienceStore,
} from '../../hooks/useExperienceStore';

export function ProjectModal() {
  const { modalCase, isAudioMuted } = useExperienceStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    setVideoError(false);
    setIsBuffering(true);
  }, [modalCase]);

  useEffect(() => {
    if (!modalCase) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalCase(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalCase]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !modalCase) return;
    if (video.readyState >= 2) {
      setIsBuffering(false);
    }
    video.muted = isAudioMuted;
    video.play().catch(() => {
      video.muted = true;
      setIsAudioMuted(true);
      video.play().catch(() => {});
    });

    return () => {
      video.pause();
    };
  }, [modalCase, isAudioMuted]);

  if (!modalCase) return null;

  const isHorizontal = modalCase.aspect === '16:9';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-case-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
      onClick={() => setModalCase(null)}
    >
      <div
        className={`relative w-full ${
          isHorizontal ? 'max-w-6xl' : 'max-w-5xl'
        } bg-[#0E0D0C] border border-white/15 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(255,8,41,0.18)] grid grid-cols-1 md:grid-cols-12 max-h-[92vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setModalCase(null)}
          aria-label="Fechar player do projeto"
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/75 border border-white/15 text-white hover:bg-[#FF0829] hover:border-[#FF0829] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Container: adapts between 16:9 widescreen and 9:16 vertical */}
        <div
          className={`${
            isHorizontal ? 'md:col-span-7' : 'md:col-span-5'
          } bg-[#030303] flex items-center justify-center relative min-h-[260px] sm:min-h-[380px] max-h-[62vh] md:max-h-[88vh] p-4 border-b md:border-b-0 md:border-r border-white/10`}
        >
          {!videoError ? (
            <div
              className={`relative ${
                isHorizontal
                  ? 'w-full aspect-video max-h-[75vh]'
                  : 'h-full max-h-[78vh] aspect-[9/16]'
              } rounded-xl overflow-hidden border border-white/10 bg-black`}
            >
              <video
                ref={videoRef}
                key={modalCase.videoUrl}
                src={modalCase.videoUrl}
                controls
                loop
                playsInline
                muted={isAudioMuted}
                onLoadStart={() => setIsBuffering(true)}
                onLoadedData={() => setIsBuffering(false)}
                onCanPlay={() => setIsBuffering(false)}
                onPlaying={() => setIsBuffering(false)}
                onWaiting={() => setIsBuffering(true)}
                onError={() => {
                  setIsBuffering(false);
                  setVideoError(true);
                }}
                className="w-full h-full object-contain bg-black"
              />

              {isBuffering && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/65 backdrop-blur-sm pointer-events-none">
                  <Loader2 className="w-7 h-7 text-[#FF0829] animate-spin" />
                  <span className="mt-2.5 font-mono text-[11px] tracking-widest text-[#F5F3F1] uppercase">
                    Carregando Stream HD...
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                aria-label={isAudioMuted ? 'Ativar áudio' : 'Silenciar áudio'}
                className="absolute top-3 left-3 z-20 p-2 rounded-lg bg-black/75 border border-white/15 text-white hover:border-[#FF0829] transition-colors"
              >
                {isAudioMuted ? (
                  <VolumeX className="w-4 h-4 text-[#B3ADA3]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#FF0829]" />
                )}
              </button>
            </div>
          ) : (
            <div
              className={`${
                isHorizontal ? 'w-full aspect-video' : 'aspect-[9/16] h-full max-h-[70vh]'
              } rounded-xl border border-[#FF0829]/40 bg-gradient-to-b from-[#160508] to-[#050505] flex flex-col items-center justify-center p-6 text-center`}
            >
              <span className="w-3 h-3 rounded-full bg-[#FF0829] animate-rec-pulse mb-3" />
              <p className="font-mono text-xs tracking-widest text-[#FF0829] uppercase">
                {modalCase.code}
              </p>
              <p className="mt-2 font-display text-lg font-bold text-white">
                {modalCase.title}
              </p>
              <p className="mt-2 text-xs text-[#B3ADA3]">
                Preview offline indisponível. Solicite o showreel completo via WhatsApp.
              </p>
            </div>
          )}
        </div>

        {/* Metadata & Conversion */}
        <div
          className={`${
            isHorizontal ? 'md:col-span-5' : 'md:col-span-7'
          } p-6 sm:p-8 flex flex-col justify-between overflow-y-auto`}
        >
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-[#FF0829] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF0829] animate-rec-pulse" />
              <span>{modalCase.code}</span>
              <span className="text-[#8A847A]">/</span>
              <span className="text-[#B3ADA3]">{modalCase.category}</span>
            </div>

            <h3
              id="modal-case-title"
              className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
            >
              {modalCase.title}
            </h3>

            <p className="mt-1 font-mono text-xs text-[#B3ADA3]">
              CLIENTE: <span className="text-[#F5F3F1]">{modalCase.client}</span>
            </p>

            <p className="mt-4 text-sm text-[#B3ADA3] leading-relaxed">
              {modalCase.synopsis}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-[#8A847A] uppercase">
                  <Camera className="w-3.5 h-3.5 text-[#FF0829]" />
                  <span>Captação &amp; Rig</span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#F5F3F1]">
                  {modalCase.cameraUsed}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-[#8A847A] uppercase">
                  <Palette className="w-3.5 h-3.5 text-[#FF0829]" />
                  <span>Color Science</span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#F5F3F1]">
                  {modalCase.colorProfile}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-[#8A847A] uppercase">
                  <Film className="w-3.5 h-3.5 text-[#FF0829]" />
                  <span>Entregável</span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#F5F3F1]">
                  {modalCase.deliverable}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-[#8A847A] uppercase">
                  <Clock className="w-3.5 h-3.5 text-[#FF0829]" />
                  <span>Duração Master</span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#F5F3F1]">
                  {modalCase.duration}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <a
              href={buildWhatsAppBudgetUrl(modalCase.title)}
              onClick={(e) => {
                e.preventDefault();
                setModalCase(null);
                navigateToBudgetCategories();
              }}
              className="rec-glow-surface inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF0829] text-white font-mono text-xs font-semibold tracking-widest uppercase transition-transform duration-200 hover:scale-[1.02]"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-rec-pulse" />
              <span>Solicitar Orçamento Similar</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={BRAND_CONTACT.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#B3ADA3] hover:text-white hover:border-white/30 transition-colors"
            >
              <span>{BRAND_CONTACT.websiteLabel}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
