import React, { useState, useMemo, useEffect } from 'react';
import { ClientData, QuoteData, QuoteState, PricingContext, ServiceCategory, ServiceId } from '../types';
import { AppConfig } from '../config/AppConfig';
import { PricingEngine } from '../core/PricingEngine';
import { LocationService } from '../services/LocationService';

interface UseQuoteLogicProps {
  clientData: ClientData;
  onUpdateClientData: (data: ClientData) => void;
  config: QuoteData;
  quoteState: QuoteState;
  setQuoteState: React.Dispatch<React.SetStateAction<QuoteState>>;
  onSuccess: () => void;
  onBack: () => void;
  isQuickMode?: boolean;
}

export type ViewState = 'config' | 'summary' | 'success';

export const useQuoteLogic = ({
  clientData,
  onUpdateClientData,
  config,
  quoteState,
  setQuoteState,
  onSuccess,
  onBack,
  isQuickMode = false
}: UseQuoteLogicProps) => {
  
  // === STATE: VIEW & NAVIGATION ===
  const [viewState, setViewState] = useState<ViewState>('config');
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // === STATE: LOCAL UI ===
  const [paymentMethod, setPaymentMethod] = useState<string>('Pix');
  const [distance, setDistance] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Signature Modal
  const [isMapOpen, setIsMapOpen] = useState(false);     // Map Modal
  
  // === STATE: NAME CAPTURE (Quick Mode) ===
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [pendingAction, setPendingAction] = useState<'next_step' | 'custom_project' | 'commercial_custom' | null>(null);

  // === CONSTANTS ===
  const steps = [
      { id: 'categories', title: 'Qual a ocasião?' },
      { id: 'services', title: 'Escolha o pacote ideal' },
      { id: 'config', title: 'Personalize os detalhes' }
  ];

  const categoryLabels: Record<string, string> = {
    wedding: 'Casamento',
    social: 'Social',
    commercial: 'Comercial',
    studio: 'Estúdio',
    video_production: 'Freelancer',
    custom: 'Personalizado'
  };

  // === DERIVED STATE ===
  const currentStepId = steps[currentStep].id as 'categories' | 'services' | 'config';
  
  const quoteData: QuoteData = useMemo(() => ({
    ...config,
    client: { ...config.client, ...clientData, projectTitle: `Project: ${clientData.name}` }
  }), [clientData, config]);

  // Destructuring QuoteState for internal use
  const { category, serviceId, hours, qty, videoQty, addDrone, addRealTime, selectionMode } = quoteState;

  // === HELPERS: STATE SETTERS ===
  const actions = {
      setCategory: (c: ServiceCategory) => {
          setQuoteState(prev => ({ ...prev, category: c }));
          
          // Lógica de Navegação:
          // Se estivermos na tela inicial (Step 0), APENAS selecionamos a categoria visualmente.
          // O usuário deve clicar em "Ver Detalhes/Continuar" no rodapé para avançar.
          // Se estivermos nas etapas seguintes (via Menu Dropdown currentStep > 0), 
          // aí sim forçamos o reinício para Step 1 para evitar inconsistência.
          if (currentStep > 0) {
              setCurrentStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          
          setIsCategoryMenuOpen(false);
      },
      setServiceId: (s: ServiceId) => setQuoteState(prev => ({ ...prev, serviceId: s })),
      setHours: (h: number) => setQuoteState(prev => ({ ...prev, hours: h })),
      setQty: (q: number) => setQuoteState(prev => ({ ...prev, qty: q })),
      setVideoQty: (q: number) => setQuoteState(prev => ({ ...prev, videoQty: q })),
      setAddDrone: (b: boolean) => setQuoteState(prev => ({ ...prev, addDrone: b })),
      setAddRealTime: (b: boolean) => setQuoteState(prev => ({ ...prev, addRealTime: b })),
      setSelectionMode: (mode: 'duration' | 'quantity') => setQuoteState(prev => ({ ...prev, selectionMode: mode })),
      
      handleUpdateLocation: (address: string) => {
          onUpdateClientData({ ...clientData, location: address });
      },

      setPaymentMethod,
      setIsMapOpen,
      setIsCategoryMenuOpen,
      setIsModalOpen,
      setIsNameModalOpen,
      setTempName,
      setViewState
  };

  // === EFFECT: LOCATION SERVICE ===
  useEffect(() => {
    let isMounted = true;
    const updateDistance = async () => {
        if (clientData.location && clientData.location.length > 3) {
            const dist = await LocationService.calculateDistance(clientData.location);
            if (isMounted) setDistance(dist);
        } else {
            if (isMounted) setDistance(0);
        }
    };
    updateDistance();
    return () => { isMounted = false; };
  }, [clientData.location]);

  // === EFFECT: SMART DEFAULTS (Category Change) ===
  useEffect(() => {
      if (category === 'wedding') actions.setSelectionMode('duration');
      if (category === 'commercial') actions.setSelectionMode('quantity');
      if (category === 'studio' && serviceId === 'studio_photo') actions.setSelectionMode('quantity');
      if (category === 'studio' && serviceId === 'studio_video') actions.setSelectionMode('duration');
      if (category === 'social' && serviceId === 'graduation') actions.setSelectionMode('duration');
  }, [category, serviceId]);

  // === EFFECT: RESET ON CATEGORY CHANGE ===
  useEffect(() => {
      if (!category) return;
      
      const table = AppConfig.PRICING_TABLE;
      const currentCategoryGroup = table[category as keyof typeof table];
      // @ts-ignore
      const isIdValid = currentCategoryGroup && Object.keys(currentCategoryGroup).some(key => key === serviceId);
      
      if (!isIdValid) {
        if (category === 'wedding') actions.setServiceId('wedding_base');
        if (category === 'social') actions.setServiceId('birthday');
        if (category === 'commercial') actions.setServiceId('comm_photo');
        if (category === 'studio') actions.setServiceId('studio_photo');
        if (category === 'video_production') actions.setServiceId('edit_only');
        if (category === 'custom') actions.setServiceId('custom_project');
        
        actions.setHours(2);
        actions.setAddDrone(false);
        actions.setAddRealTime(false);
        
        if (category === 'commercial') {
            if (serviceId === 'comm_photo') actions.setQty(5);
            else if (serviceId === 'comm_video') actions.setQty(1);
        } else if (category === 'studio' && serviceId === 'studio_photo') {
            actions.setQty(8);
        } else if (category === 'video_production') {
            actions.setQty(1);
        } else {
            actions.setQty(10);
        }
      }
      
      if (category === 'commercial' && serviceId === 'comm_combo') {
          actions.setQty(10);      
          actions.setVideoQty(1);  
      } else {
          actions.setVideoQty(0);
      }
  }, [category, serviceId]);

  // === PRICING ENGINE ===
  const { totalPrice, priceBreakdown } = useMemo(() => {
    const context: PricingContext = {
        pricePerKm: config.pricePerKm,
        photoUnitPrice: config.photoUnitPrice,
        videoUnitPrice: config.videoUnitPrice,
        distance: distance,
        isQuickMode: isQuickMode 
    };
    const result = PricingEngine.calculate(quoteState, context);
    return { totalPrice: result.totalPrice, priceBreakdown: result.breakdown };
  }, [quoteState, config, distance, isQuickMode]);

  // === ACTIONS: WHATSAPP ===
  const openWhatsappAction = (type: 'custom_project' | 'commercial_custom', nameOverride?: string) => {
    const clientName = nameOverride || clientData.name || "Cliente";
    let message = "";

    if (type === 'custom_project') {
        message = `🚀 *SOLICITAÇÃO DE PROJETO ESPECIAL*\nOlá! Me chamo ${clientName}.\n\nGostaria de discutir um projeto exclusivo que não se encaixa nos pacotes padrão.\n\n💡 *MINHA IDEIA*\n(Descreva brevemente aqui)\n\n*Podemos agendar uma conversa?*`;
    } else if (type === 'commercial_custom') {
        message = `💼 *CONSULTORIA COMERCIAL*\nOlá, equipe EAREC! Me chamo ${clientName}.\n\nEstou no configurador e gostaria de um orçamento personalizado para minha empresa/marca.\n\n💡 *DETALHES DA DEMANDA*\n• Objetivo: (Descreva aqui)\n• Referência: Opção "Comercial Personalizado"\n\n*Aguardo contato para alinharmos o projeto!*`;
    }

    window.open(`https://api.whatsapp.com/send?phone=${AppConfig.BRAND.WHATSAPP}&text=${encodeURIComponent(message)}`, '_blank');
  };

  // === HANDLERS: NAVIGATION & INTERACTION ===
  
  const handleNextStep = () => {
      if (currentStep === 0 && !category) return;

      if (currentStep < steps.length - 1) {
          setDirection(1);
          setCurrentStep(prev => prev + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          if (category === 'custom') {
              onSuccess(); 
              setViewState('success');
              window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
              if (isQuickMode && !clientData.name) {
                  setPendingAction('next_step');
                  setIsNameModalOpen(true);
                  return;
              }
              setViewState('summary');
          }
      }
  };

  const handlePrevStep = () => {
      if (currentStep > 0) {
          setDirection(-1);
          setCurrentStep(prev => prev - 1);
      } else {
          onBack();
      }
  };

  const handleConfirmName = () => {
      if (tempName.trim().length < 2) return;
      onUpdateClientData({ ...clientData, name: tempName });
      setIsNameModalOpen(false);

      if (pendingAction === 'next_step') setViewState('summary');
      else if (pendingAction === 'custom_project') openWhatsappAction('custom_project', tempName);
      else if (pendingAction === 'commercial_custom') openWhatsappAction('commercial_custom', tempName);
      
      setPendingAction(null);
  };

  const handleSignatureSuccess = (signatureData: string) => {
    setIsModalOpen(false);
    onSuccess();
    setViewState('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveAddon = (addonName: string) => {
      const name = addonName.toLowerCase();
      if (name.includes('drone')) actions.setAddDrone(false);
      if (name.includes('tempo real')) actions.setAddRealTime(false);
      if (name.includes('horas extras')) actions.setHours(2); 
  };

  const handleContactRequest = (type: 'custom_project' | 'commercial_custom') => {
      if (!clientData.name || clientData.name.trim() === '') {
          setPendingAction(type);
          setIsNameModalOpen(true);
      } else {
          openWhatsappAction(type);
      }
  };

  // === COMPUTED: LABELS & DETAILS ===
  const serviceLabel = category ? AppConfig.getServiceLabel(category, serviceId) : '';
  let metricLabel = '';
  if (selectionMode === 'duration') {
       metricLabel = `${hours}h de Cobertura`;
  } else {
       if (serviceId === 'comm_combo') metricLabel = `${qty} Fotos + ${videoQty} Vídeos`;
       else metricLabel = `${qty} Unidades`;
  }
  if (category === 'wedding' && selectionMode === 'duration' && hours === 2) metricLabel = "Pacote Completo";
  if (category === 'custom') metricLabel = 'Sob medida';

  const activeAddons = [];
  if (addDrone && (['wedding','social','commercial'].includes(category || ''))) activeAddons.push('Drone (Aéreo)');
  if (addRealTime) activeAddons.push('Fotos em Tempo Real');

  const getFooterLabel = () => {
    if (currentStep === 0) return "Ver Detalhes"; 
    if (currentStep === 1) return "Configurar Detalhes";
    if (currentStep === 2) {
        if (category === 'custom') return "Solicitar";
        if (selectionMode === 'quantity') return "Confirmar Quantidade";
        if (selectionMode === 'duration') return "Confirmar Tempo";
    }
    return "Continuar";
  };

  return {
    state: {
        viewState,
        currentStep,
        direction,
        isCategoryMenuOpen,
        paymentMethod,
        distance,
        isModalOpen,
        isMapOpen,
        isNameModalOpen,
        tempName,
        steps,
        currentStepId,
        categoryLabels,
        quoteData,
        totalPrice,
        priceBreakdown
    },
    actions: {
        ...actions,
        handleNextStep,
        handlePrevStep,
        handleConfirmName,
        handleSignatureSuccess,
        handleRemoveAddon,
        handleContactRequest
    },
    computed: {
        serviceLabel,
        metricLabel,
        activeAddons,
        summaryDetails: {
            serviceName: serviceLabel,
            categoryLabel: category ? (categoryLabels[category] || '') : '',
            metricLabel,
            addons: activeAddons
        },
        footerLabel: getFooterLabel(),
        isNextDisabled: currentStep === 0 && !category
    }
  };
};