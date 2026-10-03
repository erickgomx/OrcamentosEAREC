import React, { useState, useEffect, useLayoutEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home as HomeIcon, Film } from 'lucide-react';

const QuoteView = lazy(() => import('./pages/QuoteView'));
const WelcomeView = lazy(() => import('./pages/WelcomeView'));
const IntroView = lazy(() => import('./pages/IntroView'));
const PortfolioView = lazy(() => import('./pages/PortfolioView'));
const ConfirmationView = lazy(() => import('./pages/ConfirmationView'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

import Loading from './components/ui/Loading';
import Logo from './components/ui/Logo';
import BackgroundFilmStrips from './components/ui/BackgroundFilmStrips';
import { ClientData, QuoteData, QuoteState, ViewState, ServiceCategory } from './types';
import { mockQuote } from './data/mock';
import { delay } from './lib/utils';
import { AppConfig } from './config/AppConfig';
import { useRouter } from './hooks/useRouter';
import { pageSlideVariants } from './lib/animations';

/**
 * App.tsx
 * -------
 * Componente Raiz da Aplicação EAREC.
 * 
 * ARQUITETURA & GERENCIAMENTO DE ROTAS:
 * 1. Rota Inicial ('/' ou '/home'):
 *    - Apresenta a tela de escolha direta (IntroView):
 *      "Você já conhece nosso trabalho ou deseja fazer um orçamento?"
 *      -> Opção A: "Conhecer Nosso Trabalho" (leva para /portfolio).
 *      -> Opção B: "Iniciar Orçamento" (leva para /orcamentos).
 * 
 * 2. Rota de Portfólio ('/portfolio' ou '/portfólio'):
 *    - Renderiza a PortfolioView renovada, limpa e de fácil acesso:
 *      - Vídeo de Apresentação (Showreel oficial) em 4K.
 *      - Galeria organizada de Outros Trabalhos (Casamentos, Comerciais, Eventos, Estúdio & Drone).
 *      - No final: botão destacado de acesso ao Instagram oficial (@earecmidia) e botão de orçamento.
 * 
 * 3. Rota de Orçamentos ('/orcamentos' ou '/orçamentos'):
 *    - Fluxo inteligente de simulação de orçamento (ConfirmationView -> WelcomeView -> QuoteView).
 * 
 * 4. Rota Administrativa ('/admin'):
 *    - Painel de administração para ajuste de tabelas de preços.
 * 
 * 5. Transições Fluidas:
 *    - Todas as transições entre rotas e etapas utilizam Framer Motion (AnimatePresence mode="wait"),
 *      fazendo os itens da tela atual deslizarem e desaparecerem, enquanto os da tela seguinte
 *      deslizam e surgem em cascata (stagger).
 */

const App: React.FC = () => {
  const router = useRouter();

  // Splash Screen aparece apenas ao acessar diretamente a rota /orcamentos
  const [showSplash, setShowSplash] = useState(() => {
    return router.activeRoute === 'orcamentos';
  });
  
  // Controle de views internas do orçamentador com persistência de sessão para não quebrar no reload (F5)
  const [view, setView] = useState<ViewState>(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedView = sessionStorage.getItem('earec_view') as ViewState;
        if (savedView && ['confirmation', 'welcome', 'quote'].includes(savedView)) {
          return savedView;
        }
      }
    } catch {}
    return 'confirmation';
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<QuoteData>(mockQuote);
  const [isQuoteSuccess, setIsQuoteSuccess] = useState(false);
  const [isQuickMode, setIsQuickMode] = useState(false);

  const [clientData, setClientData] = useState<ClientData>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('earec_client_data') : null;
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            name: parsed.name || '',
            location: parsed.location || '',
            date: parsed.date || '',
            contact: parsed.contact || '',
            company: parsed.company || '',
            projectTitle: parsed.projectTitle || ''
          };
        }
      }
    } catch (e) {
      console.warn("Erro ao ler localStorage de clientData:", e);
    }
    return {
      name: '',
      location: '',
      date: '',
      contact: ''
    };
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

  // Configuração de variáveis CSS da marca
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-color', AppConfig.BRAND.COLORS.PRIMARY);
    root.style.setProperty('--brand-glow', `${AppConfig.BRAND.COLORS.PRIMARY}80`);
  }, []);

  // Salva dados do cliente no localStorage
  useEffect(() => {
    if (clientData) {
      localStorage.setItem('earec_client_data', JSON.stringify(clientData));
    }
  }, [clientData]);

  // Salva sub-etapa do orçamentador no sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('earec_view', view);
    } catch {}
  }, [view]);

  // Atualiza o título da aba do navegador de acordo com a rota ativa
  useEffect(() => {
    if (router.activeRoute === 'home') {
      document.title = "EAREC | Produtora Audiovisual & Cinema";
    } else if (router.activeRoute === 'portfolio') {
      document.title = "EAREC | Portfólio & Apresentação";
    } else if (router.activeRoute === 'orcamentos') {
      document.title = "EAREC | Orçamento Facilitado";
    } else if (router.activeRoute === 'admin') {
      document.title = "EAREC | Painel Administrativo";
    }
  }, [router.activeRoute]);

  // Captura categoria vinda de parâmetros na URL (?cat=...)
  useEffect(() => {
    const cat = router.params.get('cat');
    if (cat && ['wedding', 'social', 'commercial', 'studio', 'video_production', 'custom'].includes(cat)) {
      setQuoteState(prev => ({ ...prev, category: cat as ServiceCategory }));
    }
  }, [router.params]);

  // Controle do Splash Screen quando entra direto em /orcamentos
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

  // Navegação para a página de Portfólio
  const handleNavigateToPortfolio = () => {
    router.navigate('/portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navegação para o Orçamentador (opcionalmente passando categoria)
  const handleNavigateToQuote = (category?: string) => {
    setShowSplash(false);
    if (category) {
      setQuoteState(prev => ({ ...prev, category: category as ServiceCategory }));
      router.navigate(`/orcamentos?cat=${category}`);
    } else {
      router.navigate('/orcamentos');
    }
    setView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Início do fluxo com formulário preenchido (com loading de 1.5s)
  const handleStart = async (data: ClientData) => {
    setClientData(data);
    setIsLoading(true);
    setIsQuoteSuccess(false);
    await delay(1500); // 1.5s de loading suave
    setIsLoading(false);
    setView('quote');
    window.scrollTo(0, 0);
  };

  // Início rápido sem pré-cadastro (com loading de 1.5s)
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
    await delay(1500); // 1.5s de loading suave
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="w-full min-h-screen bg-[#0a0a0a] text-neutral-100 selection:bg-brand-DEFAULT selection:text-white overflow-x-hidden font-sans relative">
      
      {/* Background Filmstrip Sutil em Todo o Site */}
      <BackgroundFilmStrips />

      {/* ROTEAMENTO SPA COM TRANSIÇÃO FLUIDA ENTRE TELAS (AnimatePresence mode="wait") */}
      <AnimatePresence mode="wait">
        
        {/* ============================================================== */}
        {/* ROTA 1: HOME (Primeira Tela: Escolha entre Portfólio e Orçamento) */}
        {/* ============================================================== */}
        {router.activeRoute === 'home' && (
          <motion.div
            key="route-home"
            variants={pageSlideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <Suspense fallback={<Loading text="Carregando EAREC..." />}>
              <IntroView 
                onSelectPortfolio={handleNavigateToPortfolio}
                onSelectQuote={() => handleNavigateToQuote()}
              />
            </Suspense>
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* ROTA 2: PORTFÓLIO (Showreel, Outros Trabalhos & Botão Instagram)  */}
        {/* ============================================================== */}
        {router.activeRoute === 'portfolio' && (
          <motion.div
            key="route-portfolio"
            variants={pageSlideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <Suspense fallback={<Loading text="Carregando Portfólio EAREC..." />}>
              <PortfolioView 
                onBackToHome={handleGoHome}
                onNavigateToQuote={handleNavigateToQuote}
              />
            </Suspense>
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* ROTA 3: ADMIN (Painel de Configuração de Preços)                  */}
        {/* ============================================================== */}
        {router.activeRoute === 'admin' && (
          <motion.div
            key="route-admin"
            variants={pageSlideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <Suspense fallback={<Loading text="Carregando Painel..." />}>
              <AdminDashboard 
                currentConfig={config}
                onUpdateConfig={handleAdminUpdate}
                onExit={handleGoHome}
              />
            </Suspense>
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* ROTA 4: ORÇAMENTOS (/orcamentos ou /orçamentos)                  */}
        {/* ============================================================== */}
        {router.activeRoute === 'orcamentos' && (
          <motion.div
            key="route-orcamentos"
            variants={pageSlideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full relative"
          >
            {/* SPLASH SCREEN INICIAL DE /orcamentos */}
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

            {/* TELA DE LOADING SUAVE */}
            <AnimatePresence>
              {isLoading && <Loading key="loader" />}
            </AnimatePresence>

            {/* BARRA SUPERIOR DISCRETA DE NAVEGAÇÃO RÁPIDA (SEMPRE ACESSÍVEL) */}
            {!showSplash && !isLoading && (
              <div className="fixed top-4 left-4 z-40 flex items-center gap-2">
                <button
                  onClick={handleGoHome}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider backdrop-blur-md shadow-lg transition-all active:scale-95 group"
                  title="Voltar para a tela inicial de escolha"
                >
                  <HomeIcon size={13} className="group-hover:-translate-x-0.5 transition-transform text-red-500" />
                  <span>Início</span>
                </button>

                <button
                  onClick={handleNavigateToPortfolio}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider backdrop-blur-md shadow-lg transition-all active:scale-95 group"
                  title="Ver portfólio completo com vídeos"
                >
                  <Film size={13} className="text-red-500 group-hover:scale-110 transition-transform" />
                  <span>Portfólio</span>
                </button>
              </div>
            )}

            {/* ETAPAS INTERNAS DO ORÇAMENTADOR COM TRANSIÇÃO FLUIDA */}
            <div className="relative z-10">
              {!showSplash && !isLoading && (
                <Suspense fallback={<Loading text="Carregando..." />}>
                  <AnimatePresence mode="wait">
                    
                    {/* ETAPA 1: EXPLICAÇÃO DOS 3 PASSOS (CONFIRMATION) */}
                    {view === 'confirmation' && (
                      <motion.div
                        key="view-confirmation"
                        variants={pageSlideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full"
                      >
                        <ConfirmationView 
                          onContinue={() => setView('welcome')}
                        />
                      </motion.div>
                    )}

                    {/* ETAPA 2: FORMULÁRIO WIZARD (WELCOME) */}
                    {view === 'welcome' && (
                      <motion.div
                        key="view-welcome"
                        variants={pageSlideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full"
                      >
                        <WelcomeView 
                          onStart={handleStart} 
                          onAdminClick={() => router.navigate('/admin')}
                          onBack={() => setView('confirmation')} 
                        />
                      </motion.div>
                    )}

                    {/* ETAPA 3: CONFIGURADOR COMPLETO (QUOTE) */}
                    {view === 'quote' && (
                      <motion.div
                        key="view-quote"
                        variants={pageSlideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full"
                      >
                        <QuoteView 
                          clientData={clientData} 
                          onUpdateClientData={setClientData}
                          config={config}
                          onBack={() => setView(isQuickMode ? 'confirmation' : 'welcome')}
                          quoteState={quoteState}
                          setQuoteState={setQuoteState}
                          onSuccess={() => setIsQuoteSuccess(true)}
                          isQuickMode={isQuickMode}
                          onRequestForm={handleRequestForm}
                        />
                      </motion.div>
                    )}

                  </AnimatePresence>
                </Suspense>
              )}
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </main>
  );
};

export default App;
