import { Component, ReactNode, useEffect } from 'react';
import { SceneContainer } from './components/canvas/SceneContainer';
import { FooterCTA } from './components/ui/FooterCTA';
import { Header } from './components/ui/Header';
import { NarrativeTexts } from './components/ui/NarrativeTexts';
import { PhotoShowcaseSection } from './components/ui/PhotoShowcaseSection';
import { PostProductionScrubber } from './components/ui/PostProductionScrubber';
import { PreloaderScreen } from './components/ui/PreloaderScreen';
import { ProjectModal } from './components/ui/ProjectModal';
import { ReelsShowcaseSection } from './components/ui/ReelsShowcaseSection';
import { ScrollIndicator } from './components/ui/ScrollIndicator';
import { TeamShowcaseSection } from './components/ui/TeamShowcaseSection';
import { useRevealOnScroll } from './hooks/useRevealOnScroll';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { setBudgetNavigationHandler } from './data/portfolioData';
import { PERF_TIER } from './utils/devicePerf';
import './produtora.css';

const PRODUTORA_FONTS_ID = 'earec-produtora-fonts';
const PRODUTORA_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap';
const PRODUTORA_TITLE =
  'EA REC — Produtora Audiovisual & Fotografia de Alto Padrão | @earecmidia';

interface ErrorBoundaryState {
  hasWebGLError: boolean;
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasWebGLError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasWebGLError: true };
  }

  render() {
    if (this.state.hasWebGLError) {
      return (
        <div className="fixed inset-0 z-0 bg-[#030303] hud-grid-bg flex items-center justify-center">
          <div className="w-72 h-72 rounded-full bg-[#FF0829]/15 blur-3xl pointer-events-none" />
        </div>
      );
    }
    return this.props.children;
  }
}

interface ProdutoraAppProps {
  onRequestQuote?: () => void;
}

export function ProdutoraApp({ onRequestQuote }: ProdutoraAppProps) {
  useSmoothScroll();
  useRevealOnScroll();

  useEffect(() => {
    setBudgetNavigationHandler(onRequestQuote ?? null);
    return () => {
      setBudgetNavigationHandler(null);
    };
  }, [onRequestQuote]);

  useEffect(() => {
    const html = document.documentElement;
    const prevTitle = document.title;

    html.dataset.perf = PERF_TIER;
    html.classList.add('route-produtora');
    document.title = PRODUTORA_TITLE;
    window.scrollTo(0, 0);

    if (!document.getElementById(PRODUTORA_FONTS_ID)) {
      const link = document.createElement('link');
      link.id = PRODUTORA_FONTS_ID;
      link.rel = 'stylesheet';
      link.href = PRODUTORA_FONTS_HREF;
      document.head.appendChild(link);
    }

    return () => {
      html.classList.remove('route-produtora');
      delete html.dataset.perf;
      document.title = prevTitle;
      html.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <div className="produtora-root relative bg-[#030303] text-white min-h-screen selection:bg-[#FF0829] selection:text-white overflow-x-hidden">
      {/* Full-screen Preloader Gate waiting for all 3D GLBs before reveal */}
      <PreloaderScreen />

      {/* Persistent 3D WebGL Background traveling vertically along Y */}
      <CanvasErrorBoundary>
        <SceneContainer />
      </CanvasErrorBoundary>

      {/* Fixed Navigation HUD & Fullscreen Video Modal */}
      <Header />
      <ScrollIndicator />
      <ProjectModal />

      {/* Natural Vertical Scrolling Journey through all 7 Acts */}
      <main aria-label="Jornada interativa EA REC" className="relative z-10 pointer-events-none">
        <NarrativeTexts />
        <PostProductionScrubber />
        <ReelsShowcaseSection />
        <PhotoShowcaseSection />
        <TeamShowcaseSection />
        <FooterCTA />
      </main>
    </div>
  );
}

export default ProdutoraApp;
