
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowLeft, ChevronsUpDown, CheckCircle, X, User } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { ClientData, QuoteData, QuoteState, ServiceCategory } from '../types';

// Components
import UpsellList from '../components/quote/UpsellList';
import StickyFooter from '../components/quote/StickyFooter';
import SignatureModal from '../components/quote/SignatureModal';
import LocationMapModal from '../components/ui/LocationMapModal';
import SummaryView from './SummaryView';
import SuccessView from './SuccessView';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

// Logic Hook
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
}

const stepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    transition: {
        duration: 0.3,
        ease: "easeIn"
    }
  })
};

const QuoteView: React.FC<QuoteViewProps> = (props) => {
  // Encapsulated Logic
  const logic = useQuoteLogic(props);
  const { state, actions, computed } = logic;
  const { quoteState, clientData } = props;
  const travelCost = state.distance > 0 ? (state.distance * 2 * state.quoteData.pricePerKm) : 0;

  // View Routing
  if (state.viewState === 'success') {
      return (
        <SuccessView 
            onReset={() => window.location.reload()} 
            clientData={props.clientData}
            totalPrice={state.totalPrice}
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
                commercialMode: state.commercialMode // Passando o modo comercial
            }}
        />
      );
  }

  return (
    <div className="relative min-h-[100dvh] bg-[#0a0a0a]/80 flex flex-col">
      
      {/* Background sutil */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#0a0a0a] to-[#0a0a0a] -z-10" />

      {/* HEADER: PROGRESS & NAV */}
      <div className="pt-6 md:pt-8 px-4 md:px-6 pb-4 w-full max-w-5xl mx-auto flex flex-col items-center relative z-20">
          <div className="w-full relative flex justify-center items-center mb-6">
               <button onClick={actions.handlePrevStep} className="absolute left-0 p-2 md:p-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                   <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
               </button>
               <Logo className="w-48 sm:w-56 md:w-64 opacity-90" />
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mb-2 h-1 bg-white/10 rounded-full overflow-hidden">
             <motion.div 
                 className="h-full bg-brand-DEFAULT shadow-[0_0_10px_rgba(220,38,38,0.5)] origin-left"
                 initial={{ width: "0%" }}
                 animate={{ width: `${((state.currentStep + 1) / state.steps.length) * 100}%` }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
             />
          </div>
          
          {/* Badge de Categoria Interativo */}
          <AnimatePresence>
            {state.currentStep > 0 && quoteState.category && (
                 <motion.button
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => actions.setIsCategoryMenuOpen(true)}
                    className="mt-5 flex items-center gap-3 px-5 py-2 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 shadow-xl shadow-black/40 hover:border-brand-DEFAULT/30 transition-all duration-500 group relative overflow-hidden"
                 >
                    <div className="relative flex items-center justify-center w-3 h-3">
                        <motion.div 
                            className="w-2 h-2 rounded-full bg-[#DC2626] shadow-[0_0_10px_rgba(220,38,38,0.9)]"
                            animate={{ opacity: [1, 0.6, 1] }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                        />
                    </div>
                    <div className="h-3 w-px bg-white/10 group-hover:bg-white/20 transition-colors" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium group-hover:text-white transition-colors">
                        {state.categoryLabels[quoteState.category]}
                    </span>
                    <ChevronsUpDown size={14} className="text-neutral-500 group-hover:text-white transition-colors ml-1" />
                 </motion.button>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-2 opacity-60">
                {state.steps[state.currentStep].title}
          </p>
      </div>

      {/* MAIN CONTENT: WIZARD STEP */}
      <div className="flex-1 w-full max-w-5xl mx-auto relative px-8 pb-48 flex flex-col justify-center">
          <AnimatePresence initial={false} custom={state.direction} mode="wait">
            {state.viewState === 'config' && (
                <motion.div 
                    key={state.currentStep}
                    custom={state.direction}
                    variants={stepVariants}
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
                              if (id === 'comm_photo') actions.setQty(5);
                              else if (id === 'comm_video') actions.setQty(1);
                              else if (id === 'comm_combo') { actions.setQty(10); actions.setVideoQty(1); }
                          } else if (quoteState.category === 'studio' && id === 'studio_photo') {
                              actions.setQty(8);
                          } else if (quoteState.category === 'video_production') {
                              // Reset all addon controls to 0 initially
                              actions.setQty(0);
                              actions.setVideoQty(0);
                              actions.setCamCapHours(0);
                              actions.setMobileCapHours(0);
                              actions.setEdit30sQty(0);
                              actions.setEdit1minQty(0);
                              actions.setDroneQty(0);
                          } else {
                              actions.setQty(10);
                          }
                          actions.setHours(2);
                      }}
                      selectionMode={quoteState.selectionMode}
                      setSelectionMode={actions.setSelectionMode}
                      isQuickMode={props.isQuickMode} 
                      onContactRequest={actions.handleContactRequest}
                      commercialMode={state.commercialMode}
                      setCommercialMode={actions.setCommercialMode}
                      projectType={quoteState.projectType || 'personal'}
                      setProjectType={actions.setProjectType}
                    />
                </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* FOOTER NAVIGATION */}
      {state.viewState === 'config' && (
        <div className="opacity-100 transition-all duration-300">
            <StickyFooter 
                totalPrice={state.totalPrice} 
                onApprove={actions.handleNextStep} 
                isApproved={false}
                highlight={true}
                showPrice={state.currentStep !== 0} 
                disabled={computed.isNextDisabled}
                customLabel={computed.footerLabel} 
            />
        </div>
      )}

      {/* MENU CASCATA (DROPDOWN MODAL) */}
      <AnimatePresence>
          {state.isCategoryMenuOpen && (
              <div className="fixed inset-0 z-[100] flex items-end sm:items-start sm:pt-24 justify-center sm:px-4">
                  <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
                      onClick={() => actions.setIsCategoryMenuOpen(false)}
                  />
                  <motion.div
                      initial={{ opacity: 0, y: 100, scale: 1 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 100, scale: 1 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="relative bg-neutral-900 border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-xs overflow-hidden shadow-2xl pb-6 sm:pb-0"
                  >
 
                      <div className="p-4 bg-white/5 border-b border-white/5 text-center">
                          <h3 className="text-white font-serif text-lg">Trocar Ocasião</h3>
                          <p className="text-neutral-500 text-[10px] uppercase tracking-wider">Selecione uma nova categoria</p>
                       </div>
 
                      
                      <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
                          {Object.entries(state.categoryLabels).map(([key, label], index) => {
                              const isActive = quoteState.category === key;
                              return (
                                  <motion.button
                                      key={key}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      onClick={() => {
                                          actions.setCategory(key as ServiceCategory);
                                          actions.setIsCategoryMenuOpen(false);
                                      }}
                                      className={cn(
                                          "w-full text-left px-5 py-4 sm:py-3 rounded-2xl flex items-center justify-between transition-all",
                                          isActive 
                                              ? "bg-brand-DEFAULT text-white shadow-lg shadow-brand-DEFAULT/20" 
                                              : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                                      )}
                                  >
                                      <span className="text-sm font-medium tracking-wide uppercase">{label}</span>
                                      {isActive && <CheckCircle size={18} />}
                                  </motion.button>
                              )
                          })}
                     </div>
 
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      {/* SUMMARY MODAL/VIEW */}
      <AnimatePresence>
         {state.viewState === 'summary' && (
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
                onProceedToSign={() => actions.setIsModalOpen(true)}
                onRemoveAddon={actions.handleRemoveAddon}
            />
         )}
      </AnimatePresence>
      
      <SignatureModal 
        isOpen={state.isModalOpen}
        onClose={() => actions.setIsModalOpen(false)}
        onConfirm={actions.handleSignatureSuccess}
        totalValue={formatCurrency(state.totalPrice)}
      />

      <LocationMapModal 
        isOpen={state.isMapOpen}
        onClose={() => actions.setIsMapOpen(false)}
        onSelectLocation={actions.handleUpdateLocation}
        initialAddress={props.clientData.location}
      />

      {/* NAME CAPTURE MODAL */}
      <AnimatePresence>
        {state.isNameModalOpen && (
             <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md"
                    onClick={() => actions.setIsNameModalOpen(false)}
                />
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative bg-neutral-900 border border-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-sm shadow-2xl"
                >

                     <button 
                        onClick={() => actions.setIsNameModalOpen(false)}
                        className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
                     >
                        <X size={20} />
                     </button>

                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-brand-DEFAULT/10 rounded-full text-brand-DEFAULT shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                            <User size={36} strokeWidth={1.5} />
                        </div>
                    </div>
                    <h3 className="text-2xl text-white font-serif text-center mb-2 leading-tight">Como podemos<br/>te chamar?</h3>
                    <p className="text-neutral-400 text-center text-sm mb-8 font-light">
                        Para um atendimento personalizado,<br/>informe seu nome ou empresa.
                    </p>
                    
                    <div className="space-y-4">
                        <input 
                            type="text"
                            placeholder="Seu nome..."
                            value={state.tempName}
                            onChange={(e) => actions.setTempName(e.target.value)}
                            autoFocus
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-neutral-600 focus:border-brand-DEFAULT focus:ring-1 focus:ring-brand-DEFAULT outline-none transition-all text-lg font-medium text-center"
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
