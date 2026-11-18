// ============================================================================
// EAREC AUDIOVISUAL - ENTRY WRAPPER APP (App.tsx)
// ============================================================================
// Olá, dev! 👋
// Este arquivo é o ponto de montagem principal importado pelo index.tsx.
// Ele provê a casca do app, garantindo compatibilidade com o ThemeProvider,
// BackgroundFilmStrips, ThemeToggle no topo direito e renderização das views
// com roteamento SPA e carregamento sob demanda (lazy) para /produtora.
// ============================================================================
import React, { useState, useEffect, useLayoutEffect, useCallback, useRef, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ConfirmationView from './src/pages/ConfirmationView';
import Loading from './src/components/ui/Loading';
import Logo from './src/components/ui/Logo';
import BackgroundFilmStrips from './src/components/ui/BackgroundFilmStrips';
import ThemeToggle from './src/components/ui/ThemeToggle';

const QuoteView = React.lazy(() => import('./src/pages/QuoteView'));
const WelcomeView = React.lazy(() => import('./src/pages/WelcomeView'));
const IntroView = React.lazy(() => import('./src/pages/IntroView'));
const PortfolioView = React.lazy(() => import('./src/pages/PortfolioView'));
const ProdutoraView = React.lazy(() => import('./src/produtora/ProdutoraApp'));

import { ClientData, QuoteData, QuoteState, ViewState } from './src/types';
import { mockQuote } from './src/data/mock';
import { delay } from './src/lib/utils';
import { AppConfig } from './src/config/AppConfig';

const EMPTY_CLIENT_DATA: ClientData = {
  name: '',
  location: '',
  date: '',
  contact: ''
};

const getNormalizedLocationPath = (): string => {
  if (typeof window === 'undefined') return '/';
  let raw = window.location.pathname || '/';
  if (window.location.hash) {
    const hashClean = window.location.hash.replace(/^#\/?/, '/');
    if (hashClean && hashClean !== '/') raw = hashClean;
  }
  try {
    const decoded = decodeURIComponent(raw);
    return (decoded.replace(/\/+$/, '') || '/').toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
};

const resolveViewFromLocation = (): ViewState => {
  const p = getNormalizedLocationPath();
  if (p === '/produtora' || p.startsWith('/produtora/')) {
    return 'produtora';
  }
  if (p === '/portfolio' || p === '/portfólio') {
    return 'portfolio';
  }
  if (
    p === '/orcamento' ||
    p === '/orçamento' ||
    p === '/orcamentos' ||
    p === '/orçamentos' ||
    p.startsWith('/orcamento/') ||
    p.startsWith('/orçamento/') ||
    p === '/quote' ||
    p === '/resumo' ||
    p === '/sucesso'
  ) {
    return 'quote';
  }
  if (p === '/inicio' || p === '/início' || p === '/home') {
    return 'intro';
  }
  if (p === '/welcome' || p === '/cadastro') {
    return 'welcome';
  }
  return 'confirmation';
};

const App: React.FC = () => {
  const [initialView] = useState<ViewState>(() => resolveViewFromLocation());

  // Splash inicia true, exceto em /produtora que possui seu próprio preloader
  const [showSplash, setShowSplash] = useState(() => initialView !== 'produtora');

  // View inicial sincronizada com a URL acessada
  const [view, setView] = useState<ViewState>(initialView);
  const viewRef = useRef<ViewState>(initialView);
  viewRef.current = view;

  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<QuoteData>(mockQuote);
  const [isQuoteSuccess, setIsQuoteSuccess] = useState(false);

  // Novo estado: Modo Rápido
  const [isQuickMode, setIsQuickMode] = useState(() => initialView === 'quote');

  const [clientData, setClientData] = useState<ClientData | null>(() => {
    try {
      const saved = localStorage.getItem('earec_client_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialView === 'quote' ? EMPTY_CLIENT_DATA : null;
  });

  const [quoteState, setQuoteState] = useState<QuoteState>({
    category: null,
    serviceId: 'wedding_base',
    hours: 2,
    qty: 10,
    videoQty: 1,
    addDrone: false,
    addRealTime: false,
    selectionMode: 'duration'
  });

  const changeView = useCallback((nextView: ViewState, urlPath?: string) => {
    setView(nextView);
    if (typeof window !== 'undefined' && urlPath) {
      const current = getNormalizedLocationPath();
      if (current !== urlPath.toLowerCase()) {
        window.history.pushState({}, '', urlPath);
      }
    }
  }, []);

  // === DESIGN SYSTEM INJECTION ===
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-color', AppConfig.BRAND.COLORS.PRIMARY);
    root.style.setProperty('--brand-glow', `${AppConfig.BRAND.COLORS.PRIMARY}80`);
  }, []);

  useEffect(() => {
    if (clientData) {
      localStorage.setItem('earec_client_data', JSON.stringify(clientData));
    }
  }, [clientData]);

  // Controle do Splash Screen
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    if (!showSplash) return;

    // Animação de entrada (Logo + Texto)
    const timer = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // Pré-carrega as rotas lazy em segundo plano após a splash sair (transições instantâneas)
  useEffect(() => {
    if (showSplash) return;
    const prefetch = () => {
      import('./src/pages/IntroView');
      import('./src/pages/WelcomeView');
      import('./src/pages/QuoteView');
    };
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(prefetch);
      return () => w.cancelIdleCallback?.(id);
    }
    const id = setTimeout(prefetch, 400);
    return () => clearTimeout(id);
  }, [showSplash]);

  // Sincronização com botões Voltar/Avançar do navegador (popstate / hashchange)
  useEffect(() => {
    const handlePopState = () => {
      const nextView = resolveViewFromLocation();
      if (nextView === 'produtora') {
        setShowSplash(false);
        setIsLoading(false);
      }
      if (nextView === 'quote') {
        setClientData((prev) => prev ?? EMPTY_CLIENT_DATA);
        if (viewRef.current !== 'quote') {
          setQuoteState((prev) => ({ ...prev, category: null }));
        }
        setIsQuickMode(true);
      }
      setView(nextView);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleStart = async (data: ClientData) => {
    setClientData(data);
    setIsLoading(true);
    setIsQuoteSuccess(false);
    setQuoteState(prev => ({ ...prev, category: null }));
    await delay(2000);
    setIsLoading(false);
    changeView('quote', '/orcamento');
    window.scrollTo(0, 0);
  };

  const handleQuickStart = async () => {
    setClientData({
      name: '',
      location: '',
      date: '',
      contact: ''
    });
    setQuoteState(prev => ({ ...prev, category: null }));
    setIsQuickMode(true);
    setIsLoading(true);
    setIsQuoteSuccess(false);
    await delay(800);
    setIsLoading(false);
    changeView('quote', '/orcamento');
    window.scrollTo(0, 0);
  };

  const handleRequestForm = () => {
    changeView('welcome', '/orcamento');
    window.scrollTo(0, 0);
  };

  const handleStartQuoteFromProdutora = useCallback(() => {
    setClientData((prev) => prev ?? EMPTY_CLIENT_DATA);
    setQuoteState((prev) => ({ ...prev, category: null }));
    setIsQuickMode(true);
    setIsQuoteSuccess(false);
    setShowSplash(false);
    setIsLoading(false);
    changeView('quote', '/orcamento');
    window.scrollTo(0, 0);
  }, [changeView]);

  if (view === 'produtora') {
    return (
      <Suspense fallback={<Loading text="Carregando experiência..." />}>
        <ProdutoraView onRequestQuote={handleStartQuoteFromProdutora} />
      </Suspense>
    );
  }

  return (
    <main className="w-full min-h-[100dvh] bg-white dark:bg-[#080808] text-[#18181B] dark:text-[#F4F4F5] selection:bg-brand-DEFAULT selection:text-white overflow-x-hidden font-sans relative transition-colors duration-300">
      {(!showSplash && (view !== 'quote' || isQuoteSuccess)) && <BackgroundFilmStrips />}
      {/* Botao Elegante de Modo Escuro / Claro na parte superior */}
      {!showSplash && (
        <div className="fixed top-3 right-3 sm:top-5 sm:right-6 md:top-6 md:right-8 z-[70]">
          <ThemeToggle />
        </div>
      )}

      {/* Cinematic Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-transparent dark:bg-[radial-gradient(circle_at_center,_transparent_0%,_#080808_120%)] z-0 opacity-80 transition-colors duration-300" />

      {/* SPLASH SCREEN */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-[#080808]"
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mb-4"
              >
                <Logo className="w-64 md:w-96" animate={true} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="flex flex-col items-center"
              >
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#DC2626] to-transparent mb-4 opacity-80" />
                <p className="text-stone-900 dark:text-neutral-300 font-sans font-bold text-sm md:text-base tracking-[0.4em] uppercase">
                  Orçamento Facilitado
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && <Loading key="loader" />}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Renderiza o conteúdo apenas quando o Splash sai e não está carregando */}
        {!showSplash && !isLoading && (
          <Suspense fallback={<Loading />}>
            {/* 1. TELA DE CONFIRMAÇÃO (INTERSTICIAL) */}
            {view === 'confirmation' && (
              <ConfirmationView
                onContinue={() => changeView('intro', '/inicio')}
              />
            )}

            {/* 2. MENU PRINCIPAL (INTRO) */}
            {view === 'intro' && (
              <IntroView
                onContinue={() => {
                  setIsQuickMode(false);
                  changeView('welcome', '/orcamento');
                }}
                onQuickStart={handleQuickStart}
                onOpenProdutora={() => changeView('produtora', '/produtora')}
              />
            )}

            {/* 3. WIZARD (WELCOME) */}
            {view === 'welcome' && (
              <WelcomeView
                onStart={handleStart}
                onBack={() =>
                  isQuickMode
                    ? changeView('quote', '/orcamento')
                    : changeView('intro', '/inicio')
                }
              />
            )}

            {/* 4. CONFIGURADOR (QUOTE) */}
            {view === 'quote' && (clientData ?? EMPTY_CLIENT_DATA) && (
              <QuoteView
                clientData={clientData ?? EMPTY_CLIENT_DATA}
                onUpdateClientData={setClientData}
                config={config}
                onBack={() =>
                  changeView(
                    isQuickMode ? 'intro' : 'welcome',
                    isQuickMode ? '/inicio' : '/orcamento'
                  )
                }
                onNavigateHome={() => changeView('intro', '/inicio')}
                quoteState={quoteState}
                setQuoteState={setQuoteState}
                onSuccess={() => setIsQuoteSuccess(true)}
                isQuickMode={isQuickMode}
                onRequestForm={handleRequestForm}
              />
            )}

            {/* 5. ROTA /PORTFOLIO */}
            {view === 'portfolio' && (
              <PortfolioView
                onNavigateHome={() => changeView('intro', '/inicio')}
                onStartQuote={handleQuickStart}
              />
            )}
          </Suspense>
        )}
      </div>
    </main>
  );
};

export default App;
