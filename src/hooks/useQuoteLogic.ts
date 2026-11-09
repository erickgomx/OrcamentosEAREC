// ============================================================================
// EAREC AUDIOVISUAL - MÁQUINA DE ESTADOS DO ORÇAMENTO (useQuoteLogic.ts)
// ============================================================================
// Olá, dev! 👋
// Este hook customizado é o "Cérebro Operacional" de toda a jornada de orçamento.
// Ele desacopla a regra de negócio da interface gráfica (React Component),
// centralizando:
// 
// 1. NAVEGAÇÃO & SINCRONIZAÇÃO DE URL:
//    - Controla os estados `'config'`, `'summary'` e `'success'`.
//    - Sincroniza o histórico do navegador (`window.history.pushState` e `popstate`)
//      para que o botão "Voltar" do celular funcione de maneira natural.
// 
// 2. ORQUESTRAÇÃO DE PASSOS DO WIZARD:
//    - Passo 0: Seleção de Categoria (Casamento, Social, Comercial, etc.).
//    - Passo 1: Escolha do Pacote Ideal.
//    - Passo 2: Ajuste fino de parâmetros (horas, quantidade de fotos/vídeos, adicionais).
// 
// 3. LOGÍSTICA & DISTÂNCIA:
//    - Consulta em tempo real a distância via `LocationService` e computa o frete.
// 
// 4. INTEGRAÇÃO COM O PRICING ENGINE:
//    - Alimenta o estado do usuário ao `PricingEngine.calculate` e expõe `totalPrice`
//      e `priceBreakdown` para os componentes filhos.
// 
// 5. MENSAGENS PARA WHATSAPP:
//    - Gera links diretos com textos formatados para projetos personalizados e corporativos.
// ============================================================================

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  onResetQuote?: () => void;
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
  isQuickMode = false,
  onResetQuote
}: UseQuoteLogicProps) => {
  
  // === STATE: VIEW & NAVIGATION COM SINCRONIZAÇÃO DE ROTA ===
  // Inicializa o passo visual com base no pathname da URL (Deep Linking amigável)
  const [viewState, setViewState] = useState<ViewState>(() => {
    // Só entra direto em 'summary' ou 'success' se houver um serviço selecionado
    if (typeof window !== 'undefined' && quoteState?.category) {
      const p = window.location.pathname.toLowerCase();
      if (p === '/resumo' || p.includes('/resumo')) return 'summary';
      if (p === '/sucesso' || p.includes('/sucesso')) return 'success';
    }
    return 'config';
  });

  /**
   * Atualiza a tela ativa e empurra a nova URL para o histórico do navegador
   */
  const updateViewState = useCallback((nextState: ViewState, pushToHistory = true) => {
    setViewState(nextState);
    if (pushToHistory && typeof window !== 'undefined') {
      const current = window.location.pathname.toLowerCase();
      let target = '/orcamento';
      if (nextState === 'summary') target = '/resumo';
      else if (nextState === 'success') target = '/sucesso';

      if (current !== target) {
        window.history.pushState({}, '', target);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  }, []);

  // Ouve popstate do navegador (botão voltar / avançar) para sincronizar o passo visual
  useEffect(() => {
    const handlePop = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.toLowerCase();
      if (path === '/resumo' || path.includes('/resumo')) {
        setViewState('summary');
      } else if (path === '/sucesso' || path.includes('/sucesso')) {
        setViewState('success');
      } else if (path === '/orcamento' || path === '/orçamento' || path === '/inicio' || path === '/') {
        setViewState('config');
      }
    };

    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Controle de etapas do Wizard interno da cotação
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // === STATE: LOCAL UI ===
  const [paymentMethod, setPaymentMethod] = useState<string>('Pix');
  const [distance, setDistance] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  // === STATE: NAME CAPTURE (Quick Mode) ===
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [pendingAction, setPendingAction] = useState<'next_step' | 'custom_project' | 'commercial_custom' | null>(null);

  // === CONSTANTS: ETAPAS DO CONFIGURADOR ===
  const steps = [
      { id: 'categories', title: 'Qual a ocasião?' },
      { id: 'services', title: 'Escolha o pacote ideal' },
      { id: 'config', title: 'Personalize os detalhes' }
  ];

  const categoryLabels: Record<string, string> = {
    video_production: "Monte seu Pacote",
    wedding: "Casamento",
    social: "Social",
    commercial: "Comercial",
    studio: "Estúdio",
    custom: "Personalizado"
  };

  // === DERIVED STATE ===
  const currentStepId = steps[currentStep].id as 'categories' | 'services' | 'config';
  
  // Objeto QuoteData memorizado combinando dados padrão com o input do cliente
  const quoteData: QuoteData = useMemo(() => ({
    ...config,
    client: { ...config.client, ...clientData, projectTitle: `Project: ${clientData.name}` }
  }), [clientData, config]);

  // Destructuring QuoteState for internal use
  const { category, serviceId, hours, qty, videoQty, addDrone, addRealTime, selectionMode, commercialMode } = quoteState;

  // === HELPERS: STATE SETTERS ===
  const actions = {
      setCategory: (c: ServiceCategory) => {
          setQuoteState(prev => ({ 
              ...prev, 
              category: c,
              videoQty: c === 'wedding' ? 0 : prev.videoQty
          }));
          
          setDirection(1);
          if (c === 'video_production') {
              setCurrentStep(2);
          } else {
              setCurrentStep(1);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          setIsCategoryMenuOpen(false);
      },
      setServiceId: (s: ServiceId) => setQuoteState(prev => ({ ...prev, serviceId: s })),
      setHours: (h: number) => setQuoteState(prev => ({ ...prev, hours: h })),
      setQty: (q: number) => setQuoteState(prev => ({ ...prev, qty: q })),
      setVideoQty: (q: number) => setQuoteState(prev => ({ ...prev, videoQty: q })),
      setDroneQty: (d: number) => setQuoteState(prev => ({ ...prev, droneQty: d })),
      setCamCapHours: (h: number) => setQuoteState(prev => ({ ...prev, camCapHours: h })),
      setMobileCapHours: (h: number) => setQuoteState(prev => ({ ...prev, mobileCapHours: h })),
      setEdit30sQty: (q: number) => setQuoteState(prev => ({ ...prev, edit30sQty: q })),
      setEdit1minQty: (q: number) => setQuoteState(prev => ({ ...prev, edit1minQty: q })),
      setAddDrone: (b: boolean) => setQuoteState(prev => ({ ...prev, addDrone: b })),
      setAddRealTime: (b: boolean) => setQuoteState(prev => ({ ...prev, addRealTime: b })),
      setSelectionMode: (mode: 'duration' | 'quantity') => setQuoteState(prev => ({ ...prev, selectionMode: mode })),
      setCommercialMode: (mode: 'on_location' | 'studio') => setQuoteState(prev => ({ ...prev, commercialMode: mode })),
      setProjectType: (mode: 'commercial' | 'personal') => setQuoteState(prev => ({ ...prev, projectType: mode })),
      
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
  // Recalcula a distância em KM sempre que o endereço do cliente mudar
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
  // Ajusta inteligentemente o modo de seleção padrão baseado na categoria escolhida
  useEffect(() => {
      if (category === 'wedding') actions.setSelectionMode('duration');
      if (category === 'commercial') {
          actions.setSelectionMode('quantity');
          // Default commercial mode
          if (!commercialMode) actions.setCommercialMode('on_location');
      }
      if (category === 'studio' && serviceId === 'studio_photo') actions.setSelectionMode('quantity');
      if (category === 'studio' && serviceId === 'studio_video') actions.setSelectionMode('duration');
      if (category === 'social' && serviceId === 'graduation') actions.setSelectionMode('duration');
      if (category === 'social' && serviceId === 'social_video') actions.setSelectionMode('quantity');
  }, [category, serviceId]);

  // === EFFECT: RESET ON CATEGORY CHANGE ===
  // Garante que o serviceId selecionado pertença legitimamente à categoria ativa
  useEffect(() => {
      if (!category) return;
      
      const table = AppConfig.PRICING_TABLE;
      const currentCategoryGroup = table[category as keyof typeof table];
      // @ts-ignore
      const isIdValid = currentCategoryGroup && Object.keys(currentCategoryGroup).some(key => key === serviceId);
      
      if (!isIdValid) {
        let newServiceId: ServiceId;
        if (category === 'wedding') newServiceId = 'wedding_base';
        else if (category === 'social') newServiceId = 'birthday';
        else if (category === 'commercial') newServiceId = 'comm_photo';
        else if (category === 'studio') newServiceId = 'studio_photo';
        else if (category === 'video_production') newServiceId = 'custom_bundle';
        else newServiceId = 'custom_project';
        
        actions.setServiceId(newServiceId);
        actions.setHours(2);
        actions.setAddDrone(false);
        actions.setDroneQty(0);
        actions.setAddRealTime(false);
        actions.setCamCapHours(0);
        actions.setMobileCapHours(0);
        actions.setEdit30sQty(0);
        actions.setEdit1minQty(0);
        
        if (category === 'commercial') {
            if (newServiceId === 'comm_photo') actions.setQty(8);
            else if (newServiceId === 'comm_video') actions.setQty(1);
        } else if (category === 'studio' && newServiceId === 'studio_photo') {
            actions.setQty(7);
        } else if (category === 'video_production') {
            actions.setQty(0);
            actions.setVideoQty(0);
        } else if (category === 'social') {
            actions.setQty(newServiceId === 'social_video' ? 1 : 8);
            actions.setVideoQty(0);
        } else {
            actions.setQty(8);
        }
      }
      
      if (category === 'commercial' && serviceId === 'comm_combo') {
          actions.setQty(10);      
          actions.setVideoQty(1);  
      } else if (category === 'social' && serviceId === 'social_video') {
          actions.setQty(1);
          actions.setVideoQty(0);
      } else if (category === 'wedding') {
          actions.setVideoQty(0);
      } else if (category !== 'social') {
          actions.setVideoQty(0);
      }
  }, [category, serviceId]);

  // === PRICING ENGINE ===
  // Executa o cálculo determinístico através da classe PricingEngine
  const { totalPrice, priceBreakdown } = useMemo(() => {
    const context: PricingContext = {
        pricePerKm: config.pricePerKm,
        photoUnitPrice: config.photoUnitPrice,
        videoUnitPrice: config.videoUnitPrice,
        distance: distance,
        isQuickMode: isQuickMode,
        // SÓ INCLUI FRETE NO TOTAL SE ESTIVER NO RESUMO OU SUCESSO
        includeFreight: viewState === 'summary' || viewState === 'success'
    };
    const result = PricingEngine.calculate(quoteState, context);
    return { totalPrice: result.totalPrice, priceBreakdown: result.breakdown };
  }, [quoteState, config, distance, isQuickMode, viewState]);

  // === ACTIONS: WHATSAPP ===
  // Abre o WhatsApp oficial com template de mensagem amigável e profissional
  const openWhatsappAction = (type: 'custom_project' | 'commercial_custom', nameOverride?: string) => {
    const clientName = nameOverride || clientData.name || "Cliente";
    let message = "";

    if (type === 'custom_project') {
        message = `🚀 *SOLICITAÇÃO DE PROJETO ESPECIAL*\nOlá! Me chamo ${clientName}.\n\nGostaria de discutir um projeto exclusivo que não se encaixa nos pacotes padrão.\n\n💡 *MINHA IDEIA*\n(Descreva brevemente aqui)\n\n*Podemos agendar uma conversa?*`;
    } else if (type === 'commercial_custom') {
        message = `💼 *CONSULTORIA COMERCIAL*\nOlá, equipe EAREC! Me chamo ${clientName}.\n\nEstou no configurador e gostaria de um orçamento personalizado para minha empresa/marca.\n\n💡 *DETALHES DA DEMANDA*\n• Objetivo: (Descreva aqui)\n• Referência: Opção "Comercial Personalizado"\n\n*Aguardo contato para alinharmos o projeto!*`;
    }

    window.open(`https://api.whatsapp.com/send?phone=${AppConfig.BRAND.WHATSAPP}&text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  // === HANDLERS: NAVIGATION & INTERACTION ===
  
  const handleNextStep = () => {
      if (currentStep === 0 && !category) return;

      if (currentStep < steps.length - 1) {
          setDirection(1);
          setCurrentStep(prev => {
             if (prev === 0 && category === 'video_production') return 2;
             return prev + 1;
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          if (category === 'custom') {
              onSuccess(); 
              updateViewState('success');
              window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
              // --- VALIDAÇÃO DE LOCALIZAÇÃO (FORÇAR INPUT) ---
              // Se o serviço exige deslocamento (não é estúdio nem remoto) e o local está vazio,
              // forçamos o usuário a selecionar o local abrindo o mapa.
              const isNoTravelCost = category === 'studio' || serviceId === 'edit_only' || (category === 'commercial' && commercialMode === 'studio');
              
              if (!isNoTravelCost && (!clientData.location || clientData.location.trim().length < 3)) {
                  actions.setIsMapOpen(true);
                  return; // Interrompe o fluxo até que o local seja definido
              }

              // --- VALIDAÇÃO DE NOME (QUICK MODE) ---
              if (isQuickMode && !clientData.name) {
                  setPendingAction('next_step');
                  setIsNameModalOpen(true);
                  return;
              }
              updateViewState('summary');
          }
      }
  };

  const handlePrevStep = () => {
      if (currentStep > 0) {
          setDirection(-1);
          setCurrentStep(prev => {
              if (prev === 2 && category === 'video_production') return 0;
              return prev - 1;
          });
      } else {
          onBack();
      }
  };

  const handleConfirmName = () => {
      if (tempName.trim().length < 2) return;
      onUpdateClientData({ ...clientData, name: tempName });
      setIsNameModalOpen(false);

      if (pendingAction === 'next_step') updateViewState('summary');
      else if (pendingAction === 'custom_project') openWhatsappAction('custom_project', tempName);
      else if (pendingAction === 'commercial_custom') openWhatsappAction('commercial_custom', tempName);
      
      setPendingAction(null);
  };

  const handleConfirmQuote = (_signatureData?: string) => {
    setIsModalOpen(false);
    onSuccess();
    updateViewState('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignatureSuccess = handleConfirmQuote;

  const handleRemoveAddon = (addonName: string) => {
      const name = addonName.toLowerCase();
      if (name.includes('drone')) {
          actions.setAddDrone(false);
          actions.setDroneQty(0);
      }
      if (name.includes('tempo real')) actions.setAddRealTime(false);
      if (name.includes('vídeo social') || name.includes('vídeo casamento') || name.includes('vídeo (')) actions.setVideoQty(0);
      if (name.includes('fotos extras')) actions.setQty(10);
      if (name.includes('vídeos extras')) actions.setVideoQty(1);
      if (name.includes('30s')) actions.setEdit30sQty(0);
      if (name.includes('1min') || name.includes('1 min')) actions.setEdit1minQty(0);
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

  const handleResetQuote = useCallback(() => {
    // 1. Limpa sub-etapas internas do configurador
    setCurrentStep(0);
    setDirection(-1);
    setDistance(0);
    setPaymentMethod('Pix');
    setTempName('');
    setPendingAction(null);
    setIsModalOpen(false);
    setIsMapOpen(false);
    setIsNameModalOpen(false);
    
    // 2. Reseta o estado comercial da cotação
    setQuoteState({
      category: null, 
      serviceId: 'wedding_base',
      hours: 2,
      qty: 10,
      videoQty: 0, 
      addDrone: false,
      droneQty: 0,
      addRealTime: false,
      selectionMode: 'duration',
      projectType: 'personal',
      videoDevice: 'mobile'
    });

    // 3. Força viewState de volta para o configurador
    setViewState('config');

    // 4. Sincroniza a URL do navegador para /orcamento sem reload
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/orcamento') {
        window.history.pushState({}, '', '/orcamento');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 5. Invoca callback pai se fornecido
    if (onResetQuote) {
      onResetQuote();
    }
  }, [setQuoteState, onResetQuote]);

  const setVideoDevice = useCallback((videoDevice: 'mobile' | 'camera') => {
    setQuoteState(prev => ({ ...prev, videoDevice }));
  }, [setQuoteState]);

  // === COMPUTED: LABELS & DETAILS ===
  const serviceLabel = category 
    ? (category === 'commercial' && serviceId === 'comm_video'
        ? `Comércio (Vídeo ${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'})`
        : category === 'commercial' && serviceId === 'comm_combo'
        ? `Pacote Comercial (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'})`
        : category === 'social' && serviceId === 'social_video'
        ? `Vídeo Social (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'})`
        : category === 'wedding' && serviceId === 'wedding_essence'
        ? `Pacote Mais Essência (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'})`
        : AppConfig.getServiceLabel(category, serviceId))
    : '';

  let metricLabel = '';
  if (selectionMode === 'duration') {
       if (category === 'studio' && serviceId === 'studio_video') {
           metricLabel = `${hours}h de Gravação no Estúdio`;
           if (hours > 2) {
               metricLabel += ` (2h base + ${hours - 2}h extras)`;
           }
           if ((quoteState.edit30sQty || 0) > 0) {
               metricLabel += ` + ${quoteState.edit30sQty}x Edição (30s)`;
           }
           if ((quoteState.edit1minQty || 0) > 0) {
               metricLabel += ` + ${quoteState.edit1minQty}x Edição (1 min)`;
           }
       } else if (category === 'wedding') {
           const isEssence = serviceId === 'wedding_essence';
           metricLabel = isEssence ? '2h de Cobertura (1 Vídeo Incluso)' : '2h de Cobertura Base';
           if (hours > 2) {
               metricLabel += ` + ${hours - 2}h Extras (${hours}h Total)`;
           }
           if (videoQty > 0) {
               metricLabel += isEssence
                   ? ` + ${videoQty} Vídeo${videoQty > 1 ? 's' : ''} Extra${videoQty > 1 ? 's' : ''} (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'})`
                   : ` + ${videoQty} Vídeo${videoQty > 1 ? 's' : ''} (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'})`;
           }
       } else {
           const baseHours = serviceId === 'graduation' ? 4 : 2;
           metricLabel = `${hours}h de Cobertura`;
           if (hours > baseHours) {
               metricLabel += ` (${baseHours}h base + ${hours - baseHours}h extras)`;
           }
           if ((category === 'social' || category === 'wedding') && videoQty > 0) {
               metricLabel += ` + ${videoQty} Vídeo${videoQty > 1 ? 's' : ''} (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'})`;
           }
       }
  } else {
       if (serviceId === 'comm_combo') metricLabel = `${qty} Fotos + ${videoQty} Vídeo${videoQty > 1 ? 's' : ''} (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'})`;
       else if (serviceId === 'comm_video' || serviceId === 'social_video') metricLabel = `${qty} Vídeo${qty > 1 ? 's' : ''} (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'})`;
       else if (category === 'social') {
           metricLabel = `${qty} Fotos (Mínimo 8)`;
           if (videoQty > 0) {
               metricLabel += ` + ${videoQty} Vídeo${videoQty > 1 ? 's' : ''} (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'})`;
           }
       }
       else if (serviceId === 'studio_photo') metricLabel = qty === 7 ? '7 Fotos (Desconto R$ 150)' : qty === 13 ? '13 Fotos (Promoção R$ 250)' : `${qty} Fotos`;
       else metricLabel = `${qty} Unidades`;
  }
  if (category === 'custom') metricLabel = 'Sob medida';

  const activeAddons: string[] = [];
  // Horas extras como adicional visível
  if (selectionMode === 'duration') {
      const baseH = (category === 'social' && serviceId === 'graduation') ? 4 : 2;
      if (hours > baseH) {
          activeAddons.push(`Horas Extras (+${hours - baseH}h)`);
      }
  }
  if (addDrone && (['wedding','social','commercial'].includes(category || ''))) activeAddons.push('Drone (Aéreo)');
  if (addRealTime) activeAddons.push('Fotos em Tempo Real');
  if ((category === 'social' || category === 'wedding') && serviceId !== 'social_video' && videoQty > 0) {
      const isEssence = category === 'wedding' && serviceId === 'wedding_essence';
      const label = isEssence
          ? `Vídeo Extra (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'}) x${videoQty}`
          : `Vídeo (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'}) x${videoQty}`;
      activeAddons.push(label);
  }
  if (category === 'commercial' && serviceId === 'comm_combo') {
      if (qty > 10) activeAddons.push(`Fotos Extras (+${qty - 10})`);
      if (videoQty > 1) activeAddons.push(`Vídeos Extras (${quoteState.videoDevice === 'camera' ? 'Câmera' : 'Mobile'}) x${videoQty - 1}`);
  }
  if (category === 'studio' && serviceId === 'studio_video') {
      if (quoteState.edit30sQty && quoteState.edit30sQty > 0) {
          activeAddons.push(`Edição 30s x${quoteState.edit30sQty}`);
      }
      if (quoteState.edit1minQty && quoteState.edit1minQty > 0) {
          activeAddons.push(`Edição 1min x${quoteState.edit1minQty}`);
      }
  }

  const getFooterLabel = () => {
    if (currentStep === 0) return category ? "Escolher Serviço" : "Selecione uma Categoria"; 
    if (currentStep === 1) return "Configurar Detalhes";
    if (currentStep === 2) {
        if (category === 'custom') return "Solicitar";
        return "Ir para Resumo";
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
        priceBreakdown,
        commercialMode 
    },
    actions: {
        ...actions,
        setViewState: updateViewState,
        handleNextStep,
        handlePrevStep,
        handleConfirmName,
        handleConfirmQuote,
        handleSignatureSuccess,
        handleRemoveAddon,
        handleContactRequest,
        handleResetQuote,
        setVideoDevice
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
