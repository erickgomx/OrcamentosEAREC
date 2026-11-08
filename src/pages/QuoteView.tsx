// ============================================================================
// EAREC AUDIOVISUAL - TELA PRINCIPAL DO CONFIGURADOR DE ORÇAMENTOS (QuoteView.tsx)
// ============================================================================
// Olá, dev! 👋
// Este componente é a visão central do simulador de orçamentos.
// 
// FLUXO DE RENDERIZAÇÃO:
// 1. Se `state.viewState === 'summary'`, renderiza a tela de revisão dos dados (`SummaryView`).
// 2. Se `state.viewState === 'success'`, renderiza a tela de parabéns e envio ao WhatsApp (`SuccessView`).
// 3. Caso contrário, renderiza o Wizard do configurador em 3 etapas com:
//    - Barra de progresso visual animada.
//    - Badge interativo da categoria selecionada com menu cascata (dropdown modal) para troca rápida.
//    - Componente `UpsellList` para personalização dos detalhes de cada serviço.
//    - Barra flutuante `StickyFooter` para exibição do total em tempo real e CTA de avanço.
//    - Modal `LocationMapModal` e modal de captura de nome quando necessário.
// ============================================================================

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowLeft, ChevronsUpDown, CheckCircle, X, User } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { ClientData, QuoteData, QuoteState, ServiceCategory } from '../types';

// Componentes da Interface
import UpsellList from '../components/quote/UpsellList';
import StickyFooter from '../components/quote/StickyFooter';
const LocationMapModal = React.lazy(() => import('../components/ui/LocationMapModal'));
import SummaryView from './SummaryView';
import SuccessView from './SuccessView';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

// Animações Cinematográficas
import { wizardStepVariants, modalVariants, backdropVariants, organicItemVariants, staggerContainer } from '../lib/animations';

// Hook com a Máquina de Estados e Lógica de Negócio
import { useQuoteLogic } from '../hooks/useQuoteLogic';

interface QuoteViewProps {
  clientData: ClientData; 
  onUpdateClientData: (data: ClientData) => void; 
  config: QuoteData;      
  onBack: () => void;
  quoteState: QuoteState;
  setQuoteState: React.Dispatch<React.SetStateAction<QuoteState>>;
  onSuccess: () => void;
  isQuickMode?: boolean;
  onRequestForm?: () => void; 
  onNavigateHome?: () => void;
  onResetQuote?: () => void;
}

const QuoteView: React.FC<QuoteViewProps> = (props) => {
  // Consome a máquina de estados desacoplada do useQuoteLogic
  const logic = useQuoteLogic(props);
  const { state, actions, computed } = logic;
  const { quoteState, clientData, onNavigateHome } = props;
  const travelCost = state.distance > 0 ? (state.distance * 2 * state.quoteData.pricePerKm) : 0;

  // Roteamento condicional de Telas (Passo 3: Sucesso / Conclusão)
  if (state.viewState === 'success') {
      return (
        <SuccessView 
            onReset={actions.handleResetQuote} 
            clientData={props.clientData}
            totalPrice={state.totalPrice}
            orderId={props.config.id}
            quoteDetails={{
                occasion: quoteState.category as any,
                customOccasionText: computed.serviceLabel,
                location: quoteState.category === 'studio' ? 'studio' : 'external',
                distance: state.distance,
                paymentMethod: state.paymentMethod,
                addons: computed.activeAddons,
                serviceId: quoteState.serviceId,
                selectionMode: quoteState.selectionMode,
                hours: quoteState.hours,
                photoQty: quoteState.qty,
                videoQty: quoteState.videoQty,
                commercialMode: state.commercialMode,
                videoDevice: quoteState.videoDevice,
                edit30sQty: quoteState.edit30sQty,
                edit1minQty: quoteState.edit1minQty,
                droneQty: quoteState.droneQty,
                camCapHours: quoteState.camCapHours,
                mobileCapHours: quoteState.mobileCapHours,
                projectType: quoteState.projectType,
                priceBreakdown: state.priceBreakdown
            }}
        />
      );
  }

  // Roteamento condicional de Telas (Passo 2: Resumo Financeiro)
  if (state.viewState === 'summary') {
      return (
        <SummaryView 
            clientData={props.clientData}
            onUpdateClientData={props.onUpdateClientData}
            quoteData={state.quoteData}
            totalPrice={state.totalPrice}
            paymentMethod={state.paymentMethod}
            setPaymentMethod={actions.setPaymentMethod}
            summaryDetails={computed.summaryDetails}
            priceBreakdown={state.priceBreakdown}
            onBack={() => actions.setViewState('config')}
            onConfirm={actions.handleConfirmQuote}
            onRemoveAddon={actions.handleRemoveAddon}
        />
      );
  }

  return (
    <div className="relative min-h-[100dvh] bg-[#FAFAF9] dark:bg-[#080808] text-stone-900 dark:text-neutral-100 flex flex-col transition-colors duration-300">
      
      {/* Background sutil */}
      <div className="fixed inset-0 bg-[#FAFAF9] dark:bg-[#080808] -z-10 transition-colors duration-300" />

      {/* HEADER: PROGRESS & NAV */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="pt-6 md:pt-8 px-4 md:px-6 pb-4 w-full max-w-5xl mx-auto flex flex-col items-center relative z-20"
      >
          <motion.div variants={organicItemVariants} className="w-full relative flex justify-center items-center mb-6 px-12 sm:px-0">
               <button 
                  onClick={actions.handlePrevStep} 
                  className="absolute left-0 p-2 md:p-2.5 rounded-full bg-white dark:bg-white/[0.05] border border-stone-200/90 dark:border-white/[0.08] hover:bg-stone-50 dark:hover:bg-white/10 text-stone-700 dark:text-neutral-400 hover:text-stone-950 dark:hover:text-white transition-all flex items-center gap-1.5 shadow-sm dark:shadow-none"
                  title={state.currentStep === 0 ? "Voltar ao Início" : "Voltar etapa"}
               >
                   <ArrowLeft className="w-5 h-5" />
                   {state.currentStep === 0 && (
                     <span className="text-xs uppercase tracking-wider font-medium pr-1 hidden sm:inline">Início</span>
                   )}
               </button>
               <div className="flex justify-center items-center">
                  <Logo className="w-48 sm:w-56 md:w-64 opacity-90" />
               </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div variants={organicItemVariants} className="w-full max-w-xs mb-2 h-1.5 bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
             <motion.div 
                 className="h-full bg-brand-DEFAULT shadow-[0_0_10px_rgba(220,38,38,0.5)] origin-left"
                 initial={{ width: "0%" }}
                 animate={{ width: `${((state.currentStep + 1) / state.steps.length) * 100}%` }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
             />
          </motion.div>
          
          {/* Badge de Categoria Interativo */}
          <AnimatePresence>
            {state.currentStep > 0 && quoteState.category && (
                 <motion.button
                    variants={organicItemVariants}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => actions.setIsCategoryMenuOpen(true)}
                    className="mt-5 flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-[#141414] backdrop-blur-xl border-2 border-stone-200 dark:border-white/10 shadow-md hover:border-[#DC2626] dark:hover:border-[#DC2626] transition-all duration-300 group relative overflow-hidden"
                 >
                    <div className="relative flex items-center justify-center w-3 h-3">
                        <motion.div 
                            className="w-2.5 h-2.5 rounded-full bg-[#DC2626] shadow-[0_0_10px_rgba(220,38,38,0.9)]"
                            animate={{ opacity: [1, 0.6, 1] }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                        />
                    </div>
                    <div className="h-3.5 w-px bg-stone-300 dark:bg-white/20 group-hover:bg-stone-400 dark:group-hover:bg-white/40 transition-colors" />
                    <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-stone-900 dark:text-white font-extrabold group-hover:text-[#DC2626] transition-colors">
                        {state.categoryLabels[quoteState.category]}
                    </span>
                    <ChevronsUpDown size={16} className="text-stone-700 dark:text-neutral-300 group-hover:text-[#DC2626] transition-colors ml-1" />
                 </motion.button>
            )}
          </AnimatePresence>

          <motion.p variants={organicItemVariants} className="text-xs sm:text-sm text-stone-600 dark:text-neutral-400 font-mono uppercase tracking-widest mt-3 opacity-90 font-medium">
                {state.steps[state.currentStep].title}
          </motion.p>
      </motion.div>

      {/* MAIN CONTENT: WIZARD STEP */}
      <div className={cn(
          "flex-1 w-full max-w-5xl mx-auto relative px-4 sm:px-6 md:px-8 flex flex-col items-center",
          state.currentStep === 0 ? "pb-12 sm:pb-16" : "pb-32 sm:pb-40"
      )}>
          <AnimatePresence initial={false} custom={state.direction} mode="wait">
            {state.viewState === 'config' && (
                <motion.div 
                    key={state.currentStep}
                    custom={state.direction}
                    variants={wizardStepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full flex justify-center"
                >
                   <UpsellList 
                      viewMode={state.currentStepId} 
                      category={quoteState.category} 
                      setCategory={actions.setCategory}
                      serviceId={quoteState.serviceId} 
                      setServiceId={actions.setServiceId}
                      hours={quoteState.hours} 
                      setHours={actions.setHours}
                      qty={quoteState.qty} 
                      setQty={actions.setQty}
                      videoQty={quoteState.videoQty} 
                      setVideoQty={actions.setVideoQty}
                      droneQty={quoteState.droneQty}
                      setDroneQty={actions.setDroneQty}
                      camCapHours={quoteState.camCapHours}
                      setCamCapHours={actions.setCamCapHours}
                      mobileCapHours={quoteState.mobileCapHours}
                      setMobileCapHours={actions.setMobileCapHours}
                      edit30sQty={quoteState.edit30sQty}
                      setEdit30sQty={actions.setEdit30sQty}
                      edit1minQty={quoteState.edit1minQty}
                      setEdit1minQty={actions.setEdit1minQty}
                      projectType={quoteState.projectType || 'personal'}
                      setProjectType={actions.setProjectType}
                      videoDevice={quoteState.videoDevice || 'mobile'}
                      setVideoDevice={actions.setVideoDevice}
                      addDrone={quoteState.addDrone} 
                      setAddDrone={actions.setAddDrone}
                      addRealTime={quoteState.addRealTime} 
                      setAddRealTime={actions.setAddRealTime}
                      distance={state.distance}
                      travelCost={travelCost}
                      clientData={props.clientData}
                      isMapOpen={state.isMapOpen}
                      setIsMapOpen={actions.setIsMapOpen}
                      handleServiceSelect={(id, mode) => { 
                          actions.setServiceId(id); 
                          if (mode) actions.setSelectionMode(mode); 
                          // Reset to minimums when explicitly selecting a new package
                          if (quoteState.category === 'commercial') {
                              if (id === 'comm_photo') actions.setQty(8);
                              else if (id === 'comm_video') actions.setQty(1);
                              else if (id === 'comm_combo') { actions.setQty(10); actions.setVideoQty(1); }
                          } else if (quoteState.category === 'studio' && id === 'studio_photo') {
                              actions.setQty(7);
                          } else if (quoteState.category === 'video_production') {
                              // Reset all addon controls to 0 initially
                              actions.setQty(0);
                              actions.setVideoQty(0);
                              actions.setCamCapHours(0);
                              actions.setMobileCapHours(0);
                              actions.setEdit30sQty(0);
                              actions.setEdit1minQty(0);
                              actions.setDroneQty(0);
                          } else if (quoteState.category === 'wedding') {
                              actions.setQty(8);
                              actions.setVideoQty(0);
                          } else if (quoteState.category === 'social') {
                              if (id === 'social_video') {
                                  actions.setQty(1);
                                  actions.setVideoQty(0);
                              } else {
                                  actions.setQty(8);
                                  actions.setVideoQty(0);
                              }
                          } else {
                              actions.setQty(8);
                          }
                          actions.setHours(2);
                      }}
                      selectionMode={quoteState.selectionMode}
                      setSelectionMode={actions.setSelectionMode}
                      isQuickMode={props.isQuickMode} 
                      onContactRequest={actions.handleContactRequest}
                      commercialMode={state.commercialMode}
                      setCommercialMode={actions.setCommercialMode}
                    />
                </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* FOOTER NAVIGATION */}
      {state.viewState === 'config' && state.currentStep !== 0 && (
        <StickyFooter 
            totalPrice={state.totalPrice} 
            onApprove={actions.handleNextStep} 
            isApproved={false}
            highlight={true}
            showPrice={state.currentStep !== 0} 
            disabled={computed.isNextDisabled}
            customLabel={computed.footerLabel} 
        />
      )}

      {/* MENU CASCATA (DROPDOWN MODAL) */}
      <AnimatePresence>
          {state.isCategoryMenuOpen && (
              <div className="fixed inset-0 z-[100] flex items-end sm:items-start sm:pt-24 justify-center sm:px-4">
                  <motion.div 
                      variants={backdropVariants}
                      initial="hidden" animate="visible" exit="exit"
                      className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
                      onClick={() => actions.setIsCategoryMenuOpen(false)}
                  />
                  <motion.div
                      variants={modalVariants}
                      initial="hidden" animate="visible" exit="exit"
                      className="relative bg-white dark:bg-[#141414] border border-stone-200/90 dark:border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-xs overflow-hidden shadow-2xl pb-6 sm:pb-0 z-10"
                  >
 
                      <div className="p-4 bg-stone-50 dark:bg-white/[0.04] border-b border-stone-200/80 dark:border-white/[0.08] text-center">
                          <h3 className="text-stone-900 dark:text-white font-serif text-lg font-bold">Trocar Ocasião</h3>
                          <p className="text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-wider font-medium">Selecione uma nova categoria</p>
                       </div>
 
                      
                      <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
                          {Object.entries(state.categoryLabels).map(([key, label]) => {
                              const isActive = quoteState.category === key;
                              return (
                                  <button
                                      key={key}
                                      onClick={() => {
                                          actions.setCategory(key as ServiceCategory);
                                          actions.setIsCategoryMenuOpen(false);
                                      }}
                                      className={cn(
                                          "w-full text-left px-5 py-4 sm:py-3 rounded-2xl flex items-center justify-between transition-all duration-200",
                                          isActive 
                                              ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/30 font-extrabold border-2 border-[#DC2626] ring-2 ring-[#DC2626]/20" 
                                              : "bg-stone-50 dark:bg-white/[0.04] text-stone-800 dark:text-neutral-200 border border-stone-200/80 dark:border-white/5 hover:bg-stone-100 dark:hover:bg-white/[0.08] hover:text-stone-950 dark:hover:text-white font-semibold"
                                      )}
                                  >
                                      <span className="text-sm tracking-wide uppercase">{label}</span>
                                      {isActive && <CheckCircle size={18} className="text-white shrink-0 stroke-[2.5]" />}
                                  </button>
                              )
                          })}
                     </div>
 
                  </motion.div>
              </div>
          )}
      </AnimatePresence>


      <React.Suspense fallback={null}>
        <LocationMapModal 
          isOpen={state.isMapOpen}
          onClose={() => actions.setIsMapOpen(false)}
          onSelectLocation={actions.handleUpdateLocation}
          initialAddress={props.clientData.location}
        />
      </React.Suspense>

      {/* NAME CAPTURE MODAL */}
      <AnimatePresence>
        {state.isNameModalOpen && (
             <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                <motion.div 
                    variants={backdropVariants}
                    initial="hidden" animate="visible" exit="exit"
                    className="absolute inset-0 bg-stone-950/60 dark:bg-neutral-950/90 backdrop-blur-md"
                    onClick={() => actions.setIsNameModalOpen(false)}
                />
                <motion.div
                    variants={modalVariants}
                    initial="hidden" animate="visible" exit="exit"
                    className="relative bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-stone-200/90 dark:border-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-sm shadow-2xl"
                >

                     <button 
                        onClick={() => actions.setIsNameModalOpen(false)}
                        className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 dark:text-neutral-500 dark:hover:text-white transition-colors"
                     >
                        <X size={20} />
                     </button>

                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-brand-DEFAULT/10 rounded-full text-brand-DEFAULT shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                            <User size={36} strokeWidth={1.5} />
                        </div>
                    </div>
                    <h3 className="text-2xl text-stone-900 dark:text-white font-serif text-center mb-2 leading-tight">Como podemos<br/>te chamar?</h3>
                    <p className="text-stone-600 dark:text-neutral-400 text-center text-sm mb-8 font-light">
                        Para um atendimento personalizado,<br/>informe seu nome ou empresa.
                    </p>
                    
                    <div className="space-y-4">
                        <input 
                            type="text"
                            placeholder="Seu nome..."
                            value={state.tempName}
                            onChange={(e) => actions.setTempName(e.target.value)}
                            autoFocus
                            className="w-full bg-stone-100 dark:bg-black/40 border border-stone-200/90 dark:border-white/10 rounded-2xl px-5 py-4 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-neutral-600 focus:border-brand-DEFAULT focus:ring-1 focus:ring-brand-DEFAULT outline-none transition-all text-lg font-medium text-center"
                            onKeyDown={(e) => e.key === 'Enter' && actions.handleConfirmName()}
                        />
                        <Button 
                            className="w-full py-4 text-lg"
                            onClick={actions.handleConfirmName}
                            disabled={state.tempName.trim().length < 2}
                        >
                            Continuar
                        </Button>
                    </div>
                </motion.div>
             </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default QuoteView;
