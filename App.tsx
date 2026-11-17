// ============================================================================
// EAREC AUDIOVISUAL - ENTRY WRAPPER APP (App.tsx)
// ============================================================================
// Olá, dev! 👋
// Este arquivo é o ponto de montagem principal importado pelo index.tsx.
// Ele provê a casca do app, garantindo compatibilidade com o ThemeProvider,
// BackgroundFilmStrips, ThemeToggle no topo direito e renderização das views.
// ============================================================================
import React, { useState, useEffect, useLayoutEffect, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ConfirmationView from './src/pages/ConfirmationView';
import Loading from './src/components/ui/Loading';
import Logo from './src/components/ui/Logo';
import BackgroundFilmStrips from './src/components/ui/BackgroundFilmStrips';
import ThemeToggle from './src/components/ui/ThemeToggle';

const QuoteView = React.lazy(() => import('./src/pages/QuoteView'));
const WelcomeView = React.lazy(() => import('./src/pages/WelcomeView'));
const IntroView = React.lazy(() => import('./src/pages/IntroView'));
import { ClientData, QuoteData, QuoteState, ViewState } from './src/types';
import { mockQuote } from './src/data/mock';
import { delay } from './src/lib/utils';
import { AppConfig } from './src/config/AppConfig';

const App: React.FC = () => {
  // Splash inicia true
  const [showSplash, setShowSplash] = useState(true);
  
  // View inicia em 'confirmation', mas só aparece após o splash sair
  const [view, setView] = useState<ViewState>('confirmation');
  
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<QuoteData>(mockQuote);
  const [isQuoteSuccess, setIsQuoteSuccess] = useState(false);
  
  // Novo estado: Modo Rápido
  const [isQuickMode, setIsQuickMode] = useState(false);

  const [clientData, setClientData] = useState<ClientData | null>(() => {
    const saved = localStorage.getItem('earec_client_data');
    return saved ? JSON.parse(saved) : null;
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
    
    // Animação de entrada (Logo + Texto)
    const timer = setTimeout(() => setShowSplash(false), 900); 
    return () => clearTimeout(timer);
  }, []);

  const handleStart = async (data: ClientData) => {
    setClientData(data);
    setIsLoading(true);
    setIsQuoteSuccess(false);
    setQuoteState(prev => ({ ...prev, category: null }));
    await delay(2000); 
    setIsLoading(false);
    setView('quote');
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
    setView('quote');
    window.scrollTo(0, 0);
  };


  const handleRequestForm = () => {
    setView('welcome');
    window.scrollTo(0, 0);
  };

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
                    onContinue={() => setView('intro')}
                />
            )}

            {/* 2. MENU PRINCIPAL (INTRO) */}
            {view === 'intro' && (
                <IntroView 
                    onContinue={() => {
                        setIsQuickMode(false);
                        setView('welcome');
                    }}
                    onQuickStart={handleQuickStart}
                />
            )}

            {/* 3. WIZARD (WELCOME) */}
            {view === 'welcome' && (
                <WelcomeView 
                  onStart={handleStart} 
                  onBack={() => setView(isQuickMode ? 'quote' : 'intro')} 
                />
            )}

            {/* 4. CONFIGURADOR (QUOTE) */}
            {view === 'quote' && clientData && (
                <QuoteView 
                  clientData={clientData} 
                  onUpdateClientData={setClientData}
                  config={config}
                  onBack={() => setView(isQuickMode ? 'intro' : 'welcome')}
                  quoteState={quoteState}
                  setQuoteState={setQuoteState}
                  onSuccess={() => setIsQuoteSuccess(true)}
                  isQuickMode={isQuickMode}
                  onRequestForm={handleRequestForm}
                />
            )}
            </Suspense>
        )}
      </div>
    </main>
  );
};

export default App;
