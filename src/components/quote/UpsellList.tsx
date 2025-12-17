
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Video, Gift, Crown, GraduationCap, Heart, 
  Store, Aperture, Plane, Clock, Zap, Minus, Plus, Route, Star, CircleHelp, X, MessageCircle, Hand, CheckCircle2, HeartHandshake, Sparkles, Gem, Timer, Edit, Info, Lock, Smartphone as SmartphoneIcon
} from 'lucide-react';
import { formatCurrency, cn, smoothScrollTo } from '../../lib/utils';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { ServiceCategory, ServiceId, QuoteState } from '../../types';
import AnimatedNumber from '../ui/AnimatedNumber';

interface UpsellListProps {
  category: ServiceCategory;
  setCategory: (c: ServiceCategory) => void;
  serviceId: ServiceId;
  setServiceId: (s: ServiceId) => void;
  hours: number;
  setHours: (h: number) => void;
  qty: number;
  setQty: (q: number) => void;
  addDrone: boolean;
  setAddDrone: (b: boolean) => void;
  addRealTime: boolean;
  setAddRealTime: (b: boolean) => void;
  distance: number;
  pricePerKm: number;
  locationClient: string;
  onOpenMap?: () => void;
  selectionMode?: 'duration' | 'quantity';
  setSelectionMode?: (mode: 'duration' | 'quantity') => void;
}

const UpsellList: React.FC<UpsellListProps> = ({ 
  category, setCategory,
  serviceId, setServiceId,
  hours, setHours,
  qty, setQty,
  addDrone, setAddDrone,
  addRealTime, setAddRealTime,
  distance,
  pricePerKm,
  locationClient,
  onOpenMap,
  selectionMode = 'duration',
  setSelectionMode
}) => {

  const categories = [
    { id: 'wedding', label: 'Casamento', icon: Heart },
    { id: 'social', label: 'Social', icon: Gift },
    { id: 'commercial', label: 'Comercial', icon: Store },
    { id: 'studio', label: 'Estúdio', icon: Aperture },
    { id: 'video_production', label: 'Produção', icon: Video },
    { id: 'custom', label: 'Personalizado', icon: Star, highlight: true },
  ];

  const categoryDescriptions: Record<string, string> = {
      wedding: "Cobertura cinematográfica para eternizar o dia mais importante da sua vida.",
      social: "Registros vibrantes e emocionantes para 15 anos, aniversários e formaturas.",
      commercial: "Valorize sua marca com fotos e vídeos profissionais de alta conversão.",
      studio: "Ambiente controlado e iluminação perfeita para ensaios e produções de alto nível.",
      video_production: "Equipe técnica, edição especializada e captação aérea com drone.",
      custom: "Soluções audiovisuais sob medida para demandas específicas e projetos únicos."
  };

  const isNoTravelCost = category === 'studio' || category === 'custom' || serviceId === 'edit_only';
  const travelCost = isNoTravelCost ? 0 : distance * 2 * pricePerKm;
  const whatsappNumber = "5584981048857";
  const [showTutorial, setShowTutorial] = useState(true);

  const handleInteraction = () => {
    if (showTutorial) setShowTutorial(false);
  };

  const scrollToSocialCards = () => {
    setTimeout(() => {
      smoothScrollTo('social-cards-grid', 800);
    }, 100);
  };

  const handleServiceSelect = (id: ServiceId) => {
    setServiceId(id);
    handleInteraction();
    
    if (category === 'commercial') {
      if (id === 'comm_photo') setQty(5);
      else if (id === 'comm_video') setQty(1);
    }
    
    setTimeout(() => {
        const needsDuration = 
            (category === 'social' && (id === 'birthday' || id === 'fifteen')) || 
            (category === 'studio' && id === 'studio_video');

        const needsQty = 
            (category === 'commercial' && id !== 'comm_combo') || 
            id === 'studio_photo' || 
            (category === 'video_production' && id === 'edit_only');

        if (needsDuration && selectionMode === 'duration') {
            smoothScrollTo('duration-card');
        } else if (needsQty && selectionMode === 'quantity') {
            smoothScrollTo('qty-card');
        }
    }, 250);
  };

  useEffect(() => {
    if (category !== 'wedding' && showTutorial) setShowTutorial(false);
  }, [category]);

  const canChooseMode = category === 'social' && serviceId !== 'graduation';

  // Lógica de visibilidade dos seletores conforme regras do usuário
  const showDurationCard = 
    (category === 'social' && serviceId !== 'graduation' && selectionMode === 'duration') ||
    (category === 'studio' && serviceId === 'studio_video');

  const showQuantityCard = 
    (category === 'social' && serviceId !== 'graduation' && selectionMode === 'quantity') ||
    (category === 'studio' && serviceId === 'studio_photo') ||
    (category === 'commercial' && serviceId !== 'comm_combo') ||
    (category === 'video_production' && serviceId === 'edit_only');

  // Lógica de texto de alteração de valor por unidade
  const getQtyPriceImpactText = () => {
    if (category === 'commercial' && serviceId === 'comm_photo') return `+ R$ 20 por foto adicional`;
    if (category === 'commercial' && serviceId === 'comm_video') return `+ R$ 500 por vídeo adicional`;
    if (category === 'studio' && serviceId === 'studio_photo') return `+ R$ 25 por foto tratada`;
    if (category === 'video_production' && serviceId === 'edit_only') return `+ R$ 250 por edição (unidade)`;
    if (category === 'social' && selectionMode === 'quantity') return `+ R$ 25 por foto tratada`;
    return "Valor calculado por unidade entregue.";
  };

  const getDurationPriceImpactText = () => {
      if (hours > 2) return `+ R$ 250 por hora extra (Ilimitado)`;
      return "Cobertura base de 2 horas inclusa.";
  };

  return (
    <section id="configurator" className="pt-4 pb-12 px-4 md:px-8 bg-neutral-900/30 min-h-screen" onClick={handleInteraction}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="relative z-20 text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">Qual a ocasião do serviço?</p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 relative mb-6">
                {categories.map((cat) => {
                    const isActive = category === cat.id;
                    const Icon = cat.icon;
                    return (
                        <div key={cat.id} className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    setCategory(cat.id as ServiceCategory);
                                    handleInteraction();
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-all text-sm md:text-base font-medium flex-1 md:flex-none justify-center whitespace-nowrap relative z-10",
                                    isActive 
                                        ? cn("bg-brand-DEFAULT text-white shadow-lg shadow-brand-DEFAULT/20", cat.id !== 'custom' && "border-2 border-white") 
                                        : "text-neutral-400 hover:text-white hover:bg-white/5",
                                    cat.highlight && !isActive && "text-brand-DEFAULT hover:bg-brand-DEFAULT/10 border border-brand-DEFAULT/20"
                                )}
                            >
                                <Icon size={18} className="shrink-0" />
                                <span className="hidden sm:inline">{cat.label}</span>
                                <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                            </button>

                            <AnimatePresence>
                                {showTutorial && cat.id === 'social' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 0.6, y: 0, scale: [1, 0.9, 1] }} 
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{
                                            y: { duration: 0.5 },
                                            scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                                        }}
                                        className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-white pointer-events-none z-[100] flex flex-col items-center drop-shadow-2xl"
                                    >
                                         <Hand className="fill-white/20 rotate-[-15deg] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" size={32} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>

            <motion.div
                key={category} 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                <p className="text-neutral-400 font-serif italic text-base md:text-lg">
                    "{categoryDescriptions[category]}"
                </p>
            </motion.div>
        </div>

        {canChooseMode && setSelectionMode && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10"
            >
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                    <Info size={12} /> Como deseja contratar?
                </p>
                <div className="flex bg-black/40 p-1.5 rounded-full border border-white/5">
                    <button 
                        onClick={() => { setSelectionMode('duration'); scrollToSocialCards(); }}
                        className={cn(
                            "px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                            selectionMode === 'duration' ? "bg-brand-DEFAULT text-white shadow-lg" : "text-neutral-500 hover:text-white"
                        )}
                    >
                        <Clock size={14} /> POR TEMPO (Fotos Ilimitadas)
                    </button>
                    <button 
                        onClick={() => { setSelectionMode('quantity'); scrollToSocialCards(); }}
                        className={cn(
                            "px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                            selectionMode === 'quantity' ? "bg-brand-DEFAULT text-white shadow-lg" : "text-neutral-500 hover:text-white"
                        )}
                    >
                        <Camera size={14} /> POR ENTREGA (Pack de Fotos)
                    </button>
                </div>
            </motion.div>
        )}

        <motion.div 
            key={category}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8 relative"
        >
            {category === 'wedding' && (
                <>
                <div className="flex justify-center w-full">
                    <motion.div variants={fadeInUp} className="w-full max-w-md">
                        <ServiceCard 
                            active={serviceId === 'wedding_base'} 
                            onClick={() => handleServiceSelect('wedding_base')}
                            icon={Heart} title="Casamento (Base)" price="R$ 650 / Pacote"
                            desc="Cerimônia + Decoração"
                            details="Cobertura essencial do casamento. Inclui fotos protocolares e cerimônia."
                        />
                    </motion.div>
                </div>

                <motion.div variants={fadeInUp} className="pt-2">
                    <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3 text-center">Pacotes Completos</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <ServiceCard 
                            active={serviceId === 'wedding_classic'} onClick={() => handleServiceSelect('wedding_classic')}
                            icon={Sparkles} 
                            title="Clássico" price="R$ 900 / Pacote"
                            desc="Pré-Wedding + Casamento"
                            details="O pacote essencial. Inclui ensaio Pré-Wedding (externo) e a cobertura completa do evento."
                            highlight
                        />
                        <ServiceCard 
                            active={serviceId === 'wedding_romance'} onClick={() => handleServiceSelect('wedding_romance')}
                            icon={HeartHandshake} 
                            title="Romance" price="R$ 1.150 / Pacote"
                            desc="Pré + Making Off + Casamento"
                            details="Pacote intermediário. Acrescenta a cobertura do Making Of da noiva/noivo."
                            highlight
                        />
                        <ServiceCard 
                            active={serviceId === 'wedding_essence'} onClick={() => handleServiceSelect('wedding_essence')}
                            icon={Gem}
                            title="Essência" price="R$ 1.750 / Pacote"
                            desc="Pré + MkOff + Casamento + Vídeo"
                            details="A experiência completa EAREC. Tudo do pacote Romance + cobertura de VÍDEO cinematográfico."
                            highlight
                        />
                    </div>
                </motion.div>
                </>
            )}

            {category === 'social' && (
                <div id="social-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div variants={fadeInUp}>
                        <ServiceCard 
                            active={serviceId === 'fifteen'} 
                            onClick={() => handleServiceSelect('fifteen')}
                            icon={Crown} title="15 Anos" price="R$ 450/2h ou R$ 25/foto"
                            desc="Registro especial do debut."
                            details="Foco na debutante, recepção e valsa. Inclui cobertura base. Todas as fotos tratadas entregues via link."
                        />
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <ServiceCard 
                            active={serviceId === 'birthday'} 
                            onClick={() => handleServiceSelect('birthday')}
                            icon={Gift} title="Aniversário / Chá" price="R$ 400/2h ou R$ 25/foto"
                            desc="Cobertura completa dos parabéns."
                            details="Inclui cobertura fotográfica profissional. Todas as fotos tratadas entregues via link."
                        />
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <ServiceCard 
                            active={serviceId === 'graduation'} 
                            onClick={() => handleServiceSelect('graduation')}
                            icon={GraduationCap} title="Formatura" price="R$ 800 / Evento"
                            details="Cobertura do evento de colação ou baile. Valor fechado para o evento."
                        />
                    </motion.div>
                </div>
            )}

            {category === 'commercial' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'comm_photo'} onClick={() => handleServiceSelect('comm_photo')}
                        icon={Camera} title="Fotografia" price="R$ 20 / Foto tratada"
                        desc="Para lojas e gastronomia."
                        details="Valor por foto tratada. Ideal para e-commerce, cardápios e lookbooks. Mínimo de 5 fotos."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'comm_video'} onClick={() => handleServiceSelect('comm_video')}
                        icon={Video} title="Vídeo" price="R$ 500 / Por Vídeo (unidade)"
                        desc="Captação + Edição (até 1min)."
                        details="Produção de vídeo institucional ou promocional (Reels/TikTok) de até 1 minuto."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'comm_combo'} onClick={() => handleServiceSelect('comm_combo')}
                        icon={Zap} title="Combo Visual" price="Sob Consulta"
                        desc="Foto + Vídeo (até 1min)"
                        details="O pacote completo para redes sociais. Inclui a produção do vídeo comercial E as fotos."
                        highlight
                    /></motion.div>
                </div>
            )}

            {category === 'studio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'studio_photo'} onClick={() => handleServiceSelect('studio_photo')}
                        icon={Camera} 
                        title="Ensaio Fotográfico" 
                        price="R$ 25 / Foto tratada"
                        details="Sessão fotográfica em ambiente controlado. Iluminação profissional. Mínimo de 5 fotos."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'studio_video'} onClick={() => handleServiceSelect('studio_video')}
                        icon={Video} title="Vídeo em Estúdio" price="R$ 350 / 2h"
                        details="Gravação de conteúdo em estúdio (ex: Cursos, Youtube, Entrevistas)."
                    /></motion.div>
                </div>
            )}

            {category === 'video_production' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'edit_only'} onClick={() => handleServiceSelect('edit_only')}
                        icon={Zap} title="Apenas Edição" price="R$ 250 / Edição"
                        details="Você envia o material bruto, nós editamos. Cortes, transições, correção de cor."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'cam_cap'} onClick={() => handleServiceSelect('cam_cap')}
                        icon={Video} title="Captação Câmera" price="R$ 350 / Diária"
                        details="Operador de câmera profissional com equipamento de cinema (4K)."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'mobile_cap'} onClick={() => handleServiceSelect('mobile_cap')}
                        icon={SmartphoneIcon} title="Captação Celular" price="R$ 250 / Diária"
                        details="Captação ágil com iPhone de última geração."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'drone'} onClick={() => handleServiceSelect('drone')}
                        icon={Plane} title="Drone (Imagens)" price="R$ 250 / Voo"
                        details="Imagens aéreas em 4K. Operador licenciado."
                    /></motion.div>
                </div>
            )}

            {category === 'custom' && (
                <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 p-8 rounded-xl text-center group transition-colors hover:border-white/20">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Star size={48} className="text-brand-DEFAULT mx-auto mb-4 fill-brand-DEFAULT/20" />
                    </motion.div>
                    <h3 className="text-2xl font-serif text-neutral-200 mb-2">Orçamento Personalizado</h3>
                    <p className="text-neutral-500 mb-6 max-w-lg mx-auto text-sm">
                        Projetos únicos exigem soluções sob medida.
                    </p>
                    <a 
                        href={`https://wa.me/${whatsappNumber}?text=Olá, gostaria de um orçamento personalizado.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-full transition-colors font-medium text-sm border border-white/10"
                    >
                        <MessageCircle size={16} />
                        Fale conosco clicando aqui
                    </a>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                {showDurationCard && (
                  <motion.div 
                      id="duration-card"
                      variants={fadeInUp} 
                      className={cn(
                          "bg-neutral-900/40 p-8 rounded-xl border flex flex-col items-center backdrop-blur-sm transition-all relative overflow-hidden",
                          selectionMode === 'duration' ? "border-brand-DEFAULT shadow-xl scale-[1.02]" : "border-white/5 opacity-40 grayscale"
                      )}
                  >
                      {selectionMode !== 'duration' && (
                          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                              <Lock size={32} className="text-white/20" />
                          </div>
                      )}

                      <div className="flex items-center gap-2 text-white mb-6">
                          <Clock className={selectionMode === 'duration' ? "text-brand-DEFAULT" : "text-neutral-500"} />
                          <span className="font-serif text-xl">Duração do Evento</span>
                      </div>
                      
                      <span className="text-7xl font-sans font-bold text-white mb-2 tracking-tighter">
                          <AnimatedNumber value={hours} /><span className="text-2xl text-neutral-500 ml-1 font-normal">h</span>
                      </span>
                      <p className="text-sm text-neutral-400 mb-8">Tempo total de cobertura</p>

                      <div className="flex items-center gap-6 w-full max-w-xs justify-center">
                          <button 
                              disabled={selectionMode !== 'duration'}
                              onClick={() => { setHours(Math.max(2, hours - 1)); handleInteraction(); }} 
                              className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:cursor-not-allowed"
                          >
                              <Minus size={24} />
                          </button>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden min-w-[50px]">
                              <div className="h-full bg-brand-DEFAULT transition-all" style={{ width: `${(hours / 12) * 100}%` }} />
                          </div>
                          <button 
                              disabled={selectionMode !== 'duration'}
                              onClick={() => { setHours(hours + 1); handleInteraction(); }} 
                              className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:cursor-not-allowed"
                          >
                              <Plus size={24} />
                          </button>
                      </div>
                      <p className="text-xs text-neutral-500 mt-6 bg-black/30 px-3 py-1 rounded-full text-center">
                          {getDurationPriceImpactText()}
                      </p>
                  </motion.div>
                )}

                {showQuantityCard && (
                  <motion.div 
                      id="qty-card"
                      variants={fadeInUp} 
                      className={cn(
                          "bg-neutral-900/40 p-8 rounded-xl border flex flex-col items-center shadow-2xl backdrop-blur-sm transition-all relative overflow-hidden border-brand-DEFAULT shadow-xl scale-[1.02]"
                      )}
                  >
                      <div className="flex items-center gap-2 text-white mb-6">
                          <Camera className="text-brand-DEFAULT" />
                          <span className="font-serif text-xl">
                            {category === 'commercial' && serviceId === 'comm_video' ? "Unidades de Vídeo" : "Quantidade de Entrega"}
                          </span>
                      </div>
                      
                      <div className="relative mb-8">
                          <span className="text-8xl font-sans font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                              <AnimatedNumber value={qty} />
                          </span>
                          <span className="absolute -right-8 top-2 text-lg text-neutral-500 font-medium">
                            {category === 'commercial' && serviceId === 'comm_video' ? "vid" : "und"}
                          </span>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-8 w-full max-w-sm justify-center">
                          <button 
                              onClick={() => {
                                  const step = (category === 'video_production' || (category === 'commercial' && serviceId === 'comm_video') || (category === 'commercial' && serviceId === 'comm_photo')) ? 1 : 5;
                                  const minLimit = (serviceId === 'studio_photo' || (category === 'commercial' && serviceId === 'comm_photo')) ? 5 : 1;
                                  setQty(Math.max(minLimit, qty - step));
                                  handleInteraction();
                              }} 
                              className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition-all group shrink-0"
                          >
                              <Minus size={24} className="text-neutral-400 group-hover:text-white" />
                          </button>
                          
                          <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden min-w-[60px]">
                              <motion.div 
                                  layout 
                                  className="h-full bg-gradient-to-r from-brand-DEFAULT/50 to-brand-DEFAULT" 
                                  style={{ width: `${Math.min(100, (qty / 100) * 100)}%` }} 
                              />
                          </div>

                          <button 
                              onClick={() => {
                                  const step = (category === 'video_production' || (category === 'commercial' && serviceId === 'comm_video') || (category === 'commercial' && serviceId === 'comm_photo')) ? 1 : 5;
                                  setQty(qty + step);
                                  handleInteraction();
                              }} 
                              className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition-all group shrink-0"
                          >
                              <Plus size={24} className="text-neutral-400 group-hover:text-white" />
                          </button>
                      </div>
                      <p className="text-xs text-neutral-500 mt-6 text-center">
                          {getQtyPriceImpactText()}
                      </p>
                  </motion.div>
                )}
            </div>

            {(category === 'social' || category === 'wedding' || category === 'commercial') && (
                <motion.div variants={fadeInUp} className="pt-4 border-t border-white/5 mt-4">
                    <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4 text-center">Itens Opcionais</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(category === 'social' || category === 'wedding') && (
                            <motion.div 
                                variants={fadeInUp}
                                onClick={() => { setAddRealTime(!addRealTime); handleInteraction(); }}
                                className={cn("cursor-pointer p-4 rounded-lg border flex items-center gap-4 transition-all bg-neutral-900/40", addRealTime ? "bg-brand-DEFAULT/10 border-green-500" : "bg-white/5 border-white/10")}
                            >
                                <div className={cn("w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all", addRealTime ? "bg-green-500 border-green-500" : "border-white/20 bg-white/5")}>
                                {addRealTime ? <CheckCircle2 size={24} className="text-white" /> : <Timer size={24} className="text-neutral-400" />}
                                </div>
                                <div>
                                    <p className={cn("font-medium", addRealTime ? "text-green-400" : "text-white")}>Fotos em Tempo Real (+ R$ 600)</p>
                                    <p className="text-xs text-neutral-400">Entrega imediata durante o evento.</p>
                                </div>
                            </motion.div>
                        )}

                        <motion.div 
                            variants={fadeInUp}
                            onClick={() => { setAddDrone(!addDrone); handleInteraction(); }}
                            className={cn("cursor-pointer p-4 rounded-lg border flex items-center gap-4 transition-all bg-neutral-900/40", addDrone ? "bg-brand-DEFAULT/10 border-green-500" : "bg-white/5 border-white/10")}
                        >
                            <div className={cn("w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all", addDrone ? "bg-green-500 border-green-500" : "border-white/20 bg-white/5")}>
                            {addDrone ? <CheckCircle2 size={24} className="text-white" /> : <Plane size={24} className="text-neutral-400" />}
                            </div>
                            <div>
                                <p className={cn("font-medium", addDrone ? "text-green-400" : "text-white")}>Imagens de Drone (+ R$ 250)</p>
                                <p className="text-xs text-neutral-400">Perspectivas aéreas cinematográficas.</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </motion.div>

        {!isNoTravelCost && (
            <motion.div 
                variants={fadeInUp} 
                onClick={onOpenMap}
                className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer group"
                title="Clique para alterar o local"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full group-hover:bg-brand-DEFAULT/20 transition-colors"><Route size={20} className="text-brand-DEFAULT" /></div>
                    <div>
                        <p className="text-xs text-neutral-500 uppercase flex items-center gap-2">
                             Destino <Edit size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                        <p className="text-white font-medium group-hover:text-brand-DEFAULT transition-colors">{locationClient} <span className="text-neutral-500 text-sm">({distance} km)</span></p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-neutral-500 uppercase">Taxa de Deslocamento</p>
                    <p className="text-xl text-white font-mono">{travelCost > 0 ? formatCurrency(travelCost) : "Grátis"}</p>
                </div>
            </motion.div>
        )}
        
        {isNoTravelCost && category !== 'custom' && (
             <motion.div variants={fadeInUp} className="border-t border-white/10 pt-8 text-center">
                <span className="text-xs text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    {serviceId === 'edit_only' ? 'Serviço Digital (Sem Deslocamento)' : 'Deslocamento Gratuito (Estúdio)'}
                </span>
             </motion.div>
        )}

      </div>
    </section>
  );
};

const ServiceCard = ({ active, onClick, icon: Icon, title, price, desc, details, highlight }: any) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div 
            onClick={(e) => { if(onClick) onClick(e); }}
            className={cn(
                "cursor-pointer p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group flex flex-col items-center text-center justify-between h-full", 
                active 
                    ? "bg-gradient-to-br from-neutral-800 to-neutral-900 border-brand-DEFAULT shadow-lg shadow-brand-DEFAULT/10" 
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                highlight && active && "ring-1 ring-brand-DEFAULT"
            )}
        >
            {active && <div className="absolute top-0 right-0 w-16 h-16 bg-brand-DEFAULT/20 blur-xl rounded-full -mr-8 -mt-8 pointer-events-none" />}
            
            {details && (
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                    className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors p-1 z-10"
                    title="Ver detalhes"
                >
                    <CircleHelp size={16} />
                </button>
            )}

            <div className="w-full flex flex-col items-center">
                {Icon ? (
                    <motion.div animate={active ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.5 }}>
                        <Icon size={28} className={cn("mb-4", active ? "text-brand-DEFAULT" : "text-neutral-400")} />
                    </motion.div>
                ) : null}
                
                <h4 className={cn("font-serif text-lg leading-tight mb-2", active ? "text-white" : "text-neutral-300")}>{title}</h4>
                {desc && <p className="text-xs text-neutral-500 mb-3 max-w-[90%] mx-auto">{desc}</p>}
            </div>

            <div className="mt-2 w-full flex flex-col items-center">
                <p className={cn("text-sm font-medium", active ? "text-brand-DEFAULT" : "text-white/60")}>{price}</p>
                {active && <div className="w-1.5 h-1.5 bg-brand-DEFAULT rounded-full mt-3" />}
            </div>

            <AnimatePresence>
                {showDetails && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden w-full text-left"
                    >
                        <div className="pt-3 mt-3 border-t border-white/10 text-xs text-neutral-300 leading-relaxed bg-black/20 -mx-5 -mb-5 p-5 relative">
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-white uppercase tracking-wider text-[10px]">O que está incluso:</span>
                                <button onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}><X size={12} /></button>
                             </div>
                             {details}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UpsellList;
