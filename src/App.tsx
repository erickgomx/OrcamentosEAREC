import React, { useState, useEffect, useLayoutEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Home as HomeIcon } from 'lucide-react';

const QuoteView = lazy(() => import('./pages/QuoteView'));
const WelcomeView = lazy(() => import('./pages/WelcomeView'));
const IntroView = lazy(() => import('./pages/IntroView'));
const ConfirmationView = lazy(() => import('./pages/ConfirmationView'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const HomeView = lazy(() => import('./pages/HomeView'));

import Loading from './components/ui/Loading';
import Logo from './components/ui/Logo';
import BackgroundFilmStrips from './components/ui/BackgroundFilmStrips';
import { ClientData, QuoteData, QuoteState, ViewState, ServiceCategory } from './types';
import { mockQuote } from './data/mock';
import { delay } from './lib/utils';
import { AppConfig } from './config/AppConfig';
import { useRouter } from './hooks/useRouter';

const App: React.FC = () => {
  const router = useRouter();

  // Splash Screen aparece apenas no fluxo do orçamentador ou na primeira carga de /orcamentos
  const [showSplash, setShowSplash] = useState(() => {
    return router.activeRoute === 'orcamentos';
  });
  
  // Controle de views internas do orçamentador
  const [view, setView] = useState<ViewState>('confirmation');
  
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<QuoteData>(mockQuote);
  const [isQuoteSuccess, setIsQuoteSuccess] = useState(false);
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
    droneQty: 0,
    addRealTime: false,
    selectionMode: 'duration',
    projectType: 'personal'
  });

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

  // Atualiza o título da página de acordo com a rota ativa
  useEffect(() => {
    if (router.activeRoute === 'home') {
      document.title = "EAREC | Produtora Audiovisual & Cinema";
    } else if (router.activeRoute === 'orcamentos') {
      document.title = "EAREC | Orçamento Facilitado";
    } else if (router.activeRoute === 'admin') {
      document.title = "EAREC | Painel Administrativo";
    }
  }, [router.activeRoute]);

  // Se rota mudar e tiver parâmetro ?cat=...
  useEffect(() => {
    const cat = router.params.get('cat');
    if (cat && ['wedding', 'social', 'commercial', 'studio', 'video_production', 'custom'].includes(cat)) {
      setQuoteState(prev => ({ ...prev, category: cat as ServiceCategory }));
    }
  }, [router.params]);

  // Controle do Splash Screen quando entra em /orcamentos
  useEffect(() => {
    if (router.activeRoute === 'orcamentos' && showSplash) {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
      
      const timer = setTimeout(() => setShowSplash(false), 2200); 
      return () => clearTimeout(timer);
    }
  }, [router.activeRoute, showSplash]);

  const handleNavigateToQuote = (category?: string) => {
    if (category) {
      setQuoteState(prev => ({ ...prev, category: category as ServiceCategory }));
      router.navigate(`/orcamentos?cat=${category}`);
    } else {
      router.navigate('/orcamentos');
    }
    setShowSplash(false);
    setView('confirmation');
  };

  const handleStart = async (data: ClientData) => {
    setClientData(data);
    setIsLoading(true);
    setIsQuoteSuccess(false);
    await delay(1500); 
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
    setIsQuickMode(true);
    setIsLoading(true);
    setIsQuoteSuccess(false);
    await delay(800);
    setIsLoading(false);
    setView('quote');
    window.scrollTo(0, 0);
  };

  const handleAdminUpdate = (newConfig: QuoteData) => {
    setConfig(newConfig);
  };

  const handleRequestForm = () => {
    setView('welcome');
    window.scrollTo(0, 0);
  };

  const handleGoHome = () => {
    router.navigate('/');
    setView('confirmation');
  };

  return (
    <main className="w-full min-h-screen bg-[#0a0a0a] text-neutral-100 selection:bg-brand-DEFAULT selection:text-white overflow-x-hidden font-sans relative">
      
      {/* Background Decorativo Film Strips (no Orçamentador) */}
      {router.activeRoute === 'orcamentos' && (view !== 'quote' || isQuoteSuccess) && (
        <BackgroundFilmStrips />
      )}

      {/* ROTA 1: HOME (Landing Page Cinematográfica com Vídeo de Apresentação) */}
      {router.activeRoute === 'home' && (
        <Suspense fallback={<Loading text="Carregando EAREC Cinema..." />}>
          <HomeView onNavigateToQuote={handleNavigateToQuote} />
        </Suspense>
      )}

      {/* ROTA 2: ADMIN */}
      {router.activeRoute === 'admin' && (
        <Suspense fallback={<Loading text="Carregando Painel..." />}>
          <AdminDashboard 
            currentConfig={config}
            onUpdateConfig={handleAdminUpdate}
            onExit={handleGoHome}
          />
        </Suspense>
      )}

      {/* ROTA 3: ORÇAMENTOS (/orcamentos ou /orçamentos) */}
      {router.activeRoute === 'orcamentos' && (
        <>
          {/* SPLASH SCREEN */}
          <AnimatePresence mode="wait">
            {showSplash && (
              <motion.div 
                key="splash"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]"
              >
                 <div className="flex flex-col items-center justify-center w-full h-full p-4">
                   <motion.div
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="mb-4"
                   >
                      <Logo className="w-64 md:w-96" animate={true} />
                   </motion.div>

                   <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="flex flex-col items-center"
                   >
                      <div className="h-px w-16 bg-gradient-to-r from-transparent via-brand-DEFAULT to-transparent mb-4 opacity-50" />
                      <p className="text-neutral-500 font-sans font-medium text-sm md:text-base tracking-[0.4em] uppercase">
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

          {/* BARRA SUPERIOR DISCRETA DE RETORNO À HOME (SEMPRE ACESSÍVEL) */}
          {!showSplash && !isLoading && (
            <div className="fixed top-4 left-4 z-40">
              <button
                onClick={handleGoHome}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white text-xs font-medium tracking-wider backdrop-blur-md shadow-lg transition-all active:scale-95 group"
                title="Voltar para a página inicial com vídeo"
              >
                <HomeIcon size={14} className="group-hover:-translate-x-0.5 transition-transform text-red-500" />
                <span>Início / Vídeo</span>
              </button>
            </div>
          )}

          <div className="relative z-10">
            {!showSplash && !isLoading && (
              <Suspense fallback={<Loading text="Carregando..." />}>
                
                {/* 1. TELA DE CONFIRMAÇÃO */}
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
                    onAdminClick={() => router.navigate('/admin')}
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
        </>
      )}

    </main>
  );
};

export default App;
