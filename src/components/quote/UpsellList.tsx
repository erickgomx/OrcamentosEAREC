
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Video, Gift, Crown, GraduationCap, Heart, 
  Store, Aperture, Plane, Clock, Minus, Plus, Route, Star, 
  Edit, Smartphone as SmartphoneIcon, Sparkles, Gem, HelpCircle, X, MessageCircle, Hand, Check, Timer
} from 'lucide-react';

import { cn, formatCurrency } from '../../lib/utils';
import { fadeInUp, staggerContainer, modalVariants } from '../../lib/animations';
import { ServiceCategory, ServiceId } from '../../types';
import AnimatedNumber from '../ui/AnimatedNumber';
import { AppConfig } from '../../config/AppConfig';
import Button from '../ui/Button';

interface UpsellListProps {
  category: ServiceCategory | null; 
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
  viewMode?: 'categories' | 'services' | 'config';
  isQuickMode?: boolean;
  onContactRequest?: (type: 'custom_project' | 'commercial_custom') => void; // Callback para solicitar contato (WhatsApp)
}

const UpsellList: React.FC<UpsellListProps> = (props) => {
  const { 
    category, setCategory, serviceId, setServiceId,
    hours, setHours, qty, setQty, addDrone, setAddDrone, addRealTime, setAddRealTime,
    distance, pricePerKm, locationClient, onOpenMap, selectionMode, setSelectionMode,
    viewMode = 'categories',
    isQuickMode = false,
    onContactRequest
  } = props;

  const [infoData, setInfoData] = useState<{ title: string; desc: string; price: string } | null>(null);

  // === READ FROM APP CONFIG ===
  const TABLE = AppConfig.PRICING_TABLE;

  const categories = [
    { id: 'wedding', label: 'Casamento', icon: Heart, desc: "Eternize o sim." },
    { id: 'social', label: 'Social', icon: Gift, desc: "15 anos e festas." },
    { id: 'commercial', label: 'Comercial', icon: Store, desc: "Venda mais." },
    { id: 'studio', label: 'Estúdio', icon: Aperture, desc: "Produção controlada." },
    { id: 'video_production', label: 'Freelancer', icon: Video, desc: "Equipe técnica." },
    { id: 'custom', label: 'Outros', icon: Star, desc: "Projetos únicos." },
  ];

  const handleServiceSelect = (id: ServiceId, mode: 'duration' | 'quantity' = 'duration') => {
    setServiceId(id);
    if (setSelectionMode) setSelectionMode(mode);
    
    // Smart Defaults (UX)
    if (id === 'comm_photo') setQty(20);
    else if (id === 'comm_video') setQty(1);
    else if (id === 'studio_photo') setQty(8);
    else if (category === 'social') setQty(10);
  };

  // Redireciona a ação de clique para o pai (QuoteView) para validar o nome
  const handleCustomCommercialClick = () => {
    if (onContactRequest) {
        onContactRequest('commercial_custom');
    }
  };

  const handleCustomProjectClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (onContactRequest) {
          onContactRequest('custom_project');
      }
  };

  // === VISIBILITY LOGIC ===
  const showDuration = (category === 'social' && serviceId !== 'graduation' && selectionMode === 'duration') ||
                       (category === 'studio' && selectionMode === 'duration');
  
  const showQuantity = (category === 'commercial' && serviceId !== 'comm_combo') || 
                       (category === 'social' && serviceId !== 'graduation' && selectionMode === 'quantity') ||
                       (category === 'studio' && selectionMode === 'quantity') ||
                       (category === 'video_production' && serviceId === 'edit_only');
  
  const canChooseMode = category === 'social' && serviceId !== 'graduation';
  
  const isNoTravelCost = category === 'studio' || serviceId === 'edit_only';
  const travelCost = isNoTravelCost ? 0 : distance * 2 * pricePerKm;

  // Lógica de Mínimo
  let minQty = 1;
  if (category === 'studio' && serviceId === 'studio_photo') minQty = 8;
  if (category === 'social') minQty = 10;

  // Renderização Condicional baseada no viewMode
  return (
    <section className="w-full max-w-5xl mx-auto">
      
      {/* === STEP 1: CATEGORY SELECTION (REFORMULATED) === */}
      {viewMode === 'categories' && (
        <div className="space-y-8">
            
            {/* NOVO LAYOUT DE CARDS - Grid 3x3 Fixo - CENTRALIZADO E MAIOR */}
            <motion.div 
                key="categories-grid" 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-2 md:gap-6 px-1 md:px-0"
            >
                {categories.map((cat) => {
                    const isActive = category === cat.id;
                    const Icon = cat.icon;
                    return (
                        <motion.button
                            key={cat.id}
                            variants={fadeInUp}
                            onClick={() => setCategory(cat.id as ServiceCategory)}
                            className={cn(
                                "relative group flex flex-col items-center justify-center gap-2 p-3 md:p-6 rounded-xl md:rounded-3xl border transition-all duration-500 overflow-hidden text-center h-36 md:h-64",
                                isActive 
                                    ? "bg-brand-DEFAULT border-brand-DEFAULT shadow-[0_0_40px_rgba(220,38,38,0.3)] scale-[1.02] z-10" 
                                    : "bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/20"
                            )}
                        >
                            {/* Fundo Decorativo */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            )}
                            
                            {/* Checkmark Absoluto (Canto Superior Direito) */}
                            {isActive && (
                                <motion.div 
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 md:top-4 md:right-4 bg-white text-brand-DEFAULT rounded-full p-0.5 md:p-1 shadow-lg z-20"
                                >
                                    <Check size={10} className="md:w-[14px] md:h-[14px]" strokeWidth={4} />
                                </motion.div>
                            )}
                            
                            {/* Ícone Centralizado */}
                            <div className={cn(
                                "p-3 md:p-5 rounded-xl md:rounded-full transition-all duration-300 mb-1",
                                isActive ? "bg-white/20 text-white" : "bg-white/5 text-neutral-500 group-hover:text-white group-hover:bg-white/10"
                            )}>
                                <Icon size={24} className="md:w-10 md:h-10" />
                            </div>

                            {/* Texto Centralizado e Maior */}
                            <div className="relative z-10 w-full">
                                <h3 className={cn(
                                    "font-serif text-sm md:text-3xl mb-1 transition-colors duration-300 w-full font-bold",
                                    isActive ? "text-white" : "text-neutral-300 group-hover:text-white"
                                )}>
                                    {cat.label}
                                </h3>
                                <p className={cn(
                                    "text-[10px] md:text-base font-medium tracking-wide transition-colors duration-300 opacity-80 hidden md:block",
                                    isActive ? "text-white/80" : "text-neutral-500 group-hover:text-neutral-400"
                                )}>
                                    {cat.desc}
                                </p>
                            </div>

                            {/* Brilho Animado (Apenas Desktop Hover) */}
                            {!isActive && (
                                <div className="absolute -inset-full top-0 block w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:animate-shine" />
                            )}
                        </motion.button>
                    )
                })}
            </motion.div>
            
            {/* Texto de Descrição Limpo (Sem boxes) */}
            <div className="h-24 md:h-32 flex items-center justify-center px-4 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {category ? (
                        <motion.div 
                            key={category} 
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} 
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="max-w-2xl text-center"
                        >
                            <p className="text-white font-serif text-xl md:text-3xl leading-snug drop-shadow-xl">
                                {AppConfig.TEXTS.CATEGORY_DESCRIPTIONS[category]}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-2 opacity-40 animate-pulse"
                        >
                            <div className="w-1 h-8 bg-gradient-to-b from-transparent to-white/50" />
                            <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">
                                Selecione uma categoria acima
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      )}

      {/* === STEP 2: SERVICE SELECTION === */}
      {viewMode === 'services' && (
        <motion.div 
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
             
             {/* Modo de Seleção (Se aplicável) - VISUAL REFORÇADO */}
             {canChooseMode && setSelectionMode && (
                <motion.div variants={fadeInUp} className="flex flex-col items-center mb-10">
                    <p className="text-center text-xs uppercase tracking-widest text-brand-DEFAULT mb-3 font-bold">
                        Como deseja contratar?
                    </p>
                    <div className="flex bg-neutral-900 p-2 rounded-2xl border border-white/10 shadow-lg">
                        <button 
                            onClick={() => setSelectionMode('duration')} 
                            className={cn(
                                "px-6 py-4 rounded-xl text-sm md:text-base font-bold transition-all flex items-center gap-3 w-44 justify-center border", 
                                selectionMode === 'duration' 
                                    ? "bg-white text-black border-white shadow-lg scale-105 z-10" 
                                    : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Clock size={20} className={selectionMode === 'duration' ? "text-brand-DEFAULT" : ""} /> 
                            POR TEMPO
                        </button>
                        <button 
                            onClick={() => setSelectionMode('quantity')} 
                            className={cn(
                                "px-6 py-4 rounded-xl text-sm md:text-base font-bold transition-all flex items-center gap-3 w-44 justify-center border", 
                                selectionMode === 'quantity' 
                                    ? "bg-white text-black border-white shadow-lg scale-105 z-10" 
                                    : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Camera size={20} className={selectionMode === 'quantity' ? "text-brand-DEFAULT" : ""} /> 
                            POR FOTO
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Grid de Serviços - ANIMADO COM STAGGER */}
            <motion.div 
                key="services-grid"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-fr"
            >
                 {/* Wedding Options */}
                 {category === 'wedding' && (
                    <>
                        <ServiceCard active={serviceId === 'wedding_base'} onClick={() => handleServiceSelect('wedding_base')} onInfo={setInfoData} icon={Heart} title={TABLE.wedding.wedding_base.label} price={formatCurrency(TABLE.wedding.wedding_base.base)} composition={TABLE.wedding.wedding_base.composition} desc={TABLE.wedding.wedding_base.description} />
                        <ServiceCard active={serviceId === 'wedding_classic'} onClick={() => handleServiceSelect('wedding_classic')} onInfo={setInfoData} icon={Sparkles} title={TABLE.wedding.wedding_classic.label} price={formatCurrency(TABLE.wedding.wedding_classic.base)} composition={TABLE.wedding.wedding_classic.composition} desc={TABLE.wedding.wedding_classic.description} />
                        <ServiceCard active={serviceId === 'wedding_romance'} onClick={() => handleServiceSelect('wedding_romance')} onInfo={setInfoData} icon={Hand} title={TABLE.wedding.wedding_romance.label} price={formatCurrency(TABLE.wedding.wedding_romance.base)} composition={TABLE.wedding.wedding_romance.composition} desc={TABLE.wedding.wedding_romance.description} highlight />
                        <ServiceCard active={serviceId === 'wedding_essence'} onClick={() => handleServiceSelect('wedding_essence')} onInfo={setInfoData} icon={Gem} title={TABLE.wedding.wedding_essence.label} price={formatCurrency(TABLE.wedding.wedding_essence.base)} composition={TABLE.wedding.wedding_essence.composition} desc={TABLE.wedding.wedding_essence.description} highlight />
                    </>
                )}

                {/* Social Options */}
                {category === 'social' && (
                    <>
                        <ServiceCard 
                            active={serviceId === 'birthday'} 
                            onClick={() => handleServiceSelect('birthday')} 
                            onInfo={setInfoData} 
                            icon={Gift} 
                            title={TABLE.social.birthday.label} 
                            price={selectionMode === 'duration' ? "A partir de R$ 400" : "R$ 25,00 / un"} 
                            composition={selectionMode === 'duration' ? TABLE.social.birthday.composition : "Seleção de Fotos Avulsas"} 
                            desc={TABLE.social.birthday.description} 
                        />
                        <ServiceCard 
                            active={serviceId === 'fifteen'} 
                            onClick={() => handleServiceSelect('fifteen')} 
                            onInfo={setInfoData} 
                            icon={Crown} 
                            title={TABLE.social.fifteen.label} 
                            price={selectionMode === 'duration' ? "A partir de R$ 450" : "R$ 25,00 / un"} 
                            composition={selectionMode === 'duration' ? TABLE.social.fifteen.composition : "Seleção de Fotos Avulsas"} 
                            desc={TABLE.social.fifteen.description} 
                        />
                        <ServiceCard 
                            active={serviceId === 'graduation'} 
                            onClick={() => handleServiceSelect('graduation')} 
                            onInfo={setInfoData} 
                            icon={GraduationCap} 
                            title={TABLE.social.graduation.label} 
                            price={formatCurrency(TABLE.social.graduation.base)} 
                            composition={TABLE.social.graduation.composition} 
                            desc={TABLE.social.graduation.description} 
                        />
                    </>
                )}

                {/* Commercial Options */}
                {category === 'commercial' && (
                    <>
                        <ServiceCard active={serviceId === 'comm_photo'} onClick={() => handleServiceSelect('comm_photo', 'quantity')} onInfo={setInfoData} icon={Camera} title={TABLE.commercial.photo.label} price={`R$ ${TABLE.commercial.photo.unit}/unidade`} composition={TABLE.commercial.photo.composition} desc={TABLE.commercial.photo.description} />
                        <ServiceCard active={serviceId === 'comm_video'} onClick={() => handleServiceSelect('comm_video', 'quantity')} onInfo={setInfoData} icon={Video} title={TABLE.commercial.video.label} price={`R$ ${TABLE.commercial.video.unit}/unidade`} composition={TABLE.commercial.video.composition} desc={TABLE.commercial.video.description} />
                        <ServiceCard active={serviceId === 'comm_combo'} onClick={() => handleServiceSelect('comm_combo', 'quantity')} onInfo={setInfoData} icon={Star} title={TABLE.commercial.combo.label} price={formatCurrency(TABLE.commercial.combo.videoBase)} composition={TABLE.commercial.combo.composition} desc={TABLE.commercial.combo.description} highlight />
                        
                        {/* CARD PERSONALIZADO PARA COMERCIAL */}
                        <ServiceCard 
                            active={false}
                            onClick={handleCustomCommercialClick}
                            onInfo={setInfoData}
                            icon={MessageCircle}
                            title="Personalizado"
                            price="A Consultar"
                            composition="Projeto Especial"
                            desc="Demandas específicas? Campanhas grandes? Fale diretamente com nossa equipe."
                        />
                    </>
                )}

                {/* Studio Options */}
                {category === 'studio' && (
                    <>
                        <ServiceCard active={serviceId === 'studio_photo'} onClick={() => handleServiceSelect('studio_photo', 'quantity')} onInfo={setInfoData} icon={Aperture} title={TABLE.studio.photo.label} price={`R$ ${TABLE.studio.photo.unit}/unidade`} composition={TABLE.studio.photo.composition} desc={TABLE.studio.photo.description} />
                        <ServiceCard active={serviceId === 'studio_video'} onClick={() => handleServiceSelect('studio_video', 'duration')} onInfo={setInfoData} icon={Video} title={TABLE.studio.video.label} price={formatCurrency(TABLE.studio.video.base)} composition={TABLE.studio.video.composition} desc={TABLE.studio.video.description} />
                    </>
                )}

                {/* Production Options */}
                {category === 'video_production' && (
                    <>
                        <ServiceCard active={serviceId === 'edit_only'} onClick={() => handleServiceSelect('edit_only', 'quantity')} onInfo={setInfoData} icon={Edit} title={TABLE.video_production.edit.label} price={`R$ ${TABLE.video_production.edit.unit}`} composition={TABLE.video_production.edit.composition} desc={TABLE.video_production.edit.description} />
                        <ServiceCard active={serviceId === 'cam_cap'} onClick={() => handleServiceSelect('cam_cap', 'duration')} onInfo={setInfoData} icon={Video} title={TABLE.video_production.cam_cap.label} price={formatCurrency(TABLE.video_production.cam_cap.fixed)} composition={TABLE.video_production.cam_cap.composition} desc={TABLE.video_production.cam_cap.description} />
                        <ServiceCard active={serviceId === 'mobile_cap'} onClick={() => handleServiceSelect('mobile_cap', 'duration')} onInfo={setInfoData} icon={SmartphoneIcon} title={TABLE.video_production.mobile_cap.label} price={formatCurrency(TABLE.video_production.mobile_cap.fixed)} composition={TABLE.video_production.mobile_cap.composition} desc={TABLE.video_production.mobile_cap.description} />
                        <ServiceCard active={serviceId === 'drone'} onClick={() => handleServiceSelect('drone', 'duration')} onInfo={setInfoData} icon={Plane} title={TABLE.video_production.drone.label} price={formatCurrency(TABLE.video_production.drone.fixed)} composition={TABLE.video_production.drone.composition} desc={TABLE.video_production.drone.description} />
                    </>
                )}

                {/* Custom Option */}
                {category === 'custom' && (
                    <motion.div variants={fadeInUp} className="col-span-2 md:col-span-3 bg-white/5 border border-white/10 p-6 md:p-10 rounded-2xl text-center backdrop-blur-sm flex flex-col items-center justify-center h-full">
                        <Star className="mx-auto text-brand-DEFAULT mb-4" size={32} />
                        <h3 className="font-serif text-2xl text-white mb-2">Projeto Personalizado</h3>
                        <p className="text-neutral-400 mb-6 text-lg">Descreva sua necessidade específica no WhatsApp.</p>
                        
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="flex items-center gap-3"
                            onClick={handleCustomProjectClick}
                        >
                            <MessageCircle size={22} />
                            Falar no WhatsApp
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
      )}

      {/* === STEP 3: CONFIGURATION (DETAILS) === */}
      {viewMode === 'config' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center">
            
            {/* 1. QUANTITY / DURATION CONTROLS */}
            <AnimatePresence mode="wait">
                {showDuration && (
                    <motion.div 
                        key="duration"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-lg bg-neutral-900/40 p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden"
                    >
                         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />
                        
                        <div 
                            className="flex items-center gap-3 mb-8 relative group cursor-pointer"
                            onClick={() => setInfoData({ 
                                title: "Tempo de Cobertura", 
                                desc: "Período contínuo de trabalho da equipe. Horas adicionais podem ser negociadas no dia do evento caso a festa se estenda.", 
                                price: "Info" 
                            })}
                        >
                             <Clock className="text-brand-DEFAULT" size={24} />
                             <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-300">Tempo de Cobertura</h3>
                             <HelpCircle size={18} className="text-neutral-600 group-hover:text-white transition-colors" />
                        </div>

                        <div className="flex items-center justify-between w-full gap-8 px-4">
                            <ControlBtn onClick={() => setHours(Math.max(2, hours - 1))} icon={Minus} />
                            <div className="text-center">
                                <span className="block text-6xl font-serif text-white tracking-tighter mb-2 drop-shadow-lg">
                                    <AnimatedNumber value={hours} />
                                </span>
                                <span className="text-xs text-neutral-500 font-bold uppercase tracking-[0.4em]">Horas</span>
                            </div>
                            <ControlBtn onClick={() => setHours(hours + 1)} icon={Plus} active />
                        </div>
                    </motion.div>
                )}

                {showQuantity && (
                    <motion.div 
                        key="quantity"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-lg bg-neutral-900/40 p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />

                        <div 
                            className="flex items-center gap-3 mb-8 relative group cursor-pointer"
                            onClick={() => setInfoData({ 
                                title: "Quantidade", 
                                desc: "Número de arquivos digitais em alta resolução com tratamento de cor e pele inclusos.", 
                                price: "Info" 
                            })}
                        >
                             <Camera className="text-brand-DEFAULT" size={24} />
                             <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-300">Quantidade</h3>
                             <HelpCircle size={18} className="text-neutral-600 group-hover:text-white transition-colors" />
                        </div>

                        <div className="flex items-center justify-between w-full gap-8 px-4">
                            <ControlBtn onClick={() => setQty(Math.max(minQty, qty - 1))} icon={Minus} />
                            <div className="text-center">
                                <span className="block text-6xl font-serif text-white tracking-tighter mb-2 drop-shadow-lg">
                                    <AnimatedNumber value={qty} />
                                </span>
                                <span className="text-xs text-neutral-500 font-bold uppercase tracking-[0.4em]">Unidades</span>
                            </div>
                            <ControlBtn onClick={() => setQty(qty + 1)} icon={Plus} active />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. ADDONS (Drone / RealTime) - ANIMADO COM STAGGER */}
            {(category === 'wedding' || category === 'social' || category === 'commercial') && (
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="w-full max-w-lg grid grid-cols-2 gap-4"
                >
                    <AddonCard 
                        label="Drone (Aéreo)" 
                        price={250} 
                        icon={Plane} 
                        active={addDrone} 
                        onClick={() => setAddDrone(!addDrone)}
                        onInfo={setInfoData}
                        desc={TABLE.video_production.drone.description}
                    />
                    <AddonCard 
                        label="Fotos Tempo Real" 
                        price={600} 
                        icon={Timer} 
                        active={addRealTime} 
                        onClick={() => setAddRealTime(!addRealTime)}
                        onInfo={setInfoData}
                        desc="Entrega imediata de uma seleção de fotos durante o evento para postagem nas redes sociais. Engajamento instantâneo."
                    />
                </motion.div>
            )}

            {/* 3. LOGISTICS - Layout Corrigido para Não Estourar */}
            {!isNoTravelCost && (
                <motion.div 
                    variants={fadeInUp} 
                    initial="hidden"
                    animate="visible"
                    onClick={onOpenMap} 
                    className="w-full max-w-lg border border-white/5 bg-white/[0.02] flex items-center justify-between cursor-pointer group hover:bg-white/[0.05] rounded-xl p-6 transition-colors gap-4"
                >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="shrink-0 p-4 bg-white/5 rounded-full text-brand-DEFAULT group-hover:bg-brand-DEFAULT group-hover:text-white transition-colors">
                            <Route size={24} />
                        </div>
                        <div className="text-left min-w-0">
                            <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Logística</p>
                            <p className="text-white text-base md:text-lg font-medium mt-1 truncate w-full">
                                {isQuickMode && distance === 0 ? "A definir" : (locationClient || "Selecionar Local")}
                            </p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                         <p className="text-neutral-400 text-sm font-medium">
                             {isQuickMode && distance === 0 
                                ? "A consultar" 
                                : `${distance}km • ${travelCost > 0 ? formatCurrency(travelCost) : "Grátis"}`}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
      )}

      {/* INFO MODAL - CORREÇÃO: Portal para o body (Z-Index Real + Fixed Viewport) */}
      {/* Movemos o Portal para envolver o AnimatePresence para garantir ciclo de vida correto */}
      {createPortal(
        <AnimatePresence>
          {infoData && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
               {/* Backdrop Fixed */}
               <motion.div 
                  key="backdrop"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-lg"
                  onClick={() => setInfoData(null)}
               />
               {/* Modal Content */}
               <motion.div 
                  key="modal"
                  variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                  className="relative z-[10000] bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl overflow-hidden"
               >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoData(null);
                    }}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-50"
                    aria-label="Fechar"
                  >
                      <X size={24} />
                  </button>
                  
                  <h3 className="text-2xl font-serif text-white mb-4 pr-8">{infoData.title}</h3>
                  <div className="w-12 h-0.5 bg-brand-DEFAULT mx-auto mb-6" />
                  <div className="max-h-[60vh] overflow-y-auto">
                      <p className="text-neutral-300 leading-relaxed font-light text-base mb-8 text-left">
                          {infoData.desc}
                          <br/><br/>
                          <span className="text-neutral-500 text-sm block text-center mt-4 border-t border-white/5 pt-4">
                              Inclui suporte completo e equipamentos profissionais da EAREC.
                          </span>
                      </p>
                  </div>
                  <div className="bg-brand-DEFAULT/10 py-3 px-6 rounded-full inline-block border border-brand-DEFAULT/20">
                      <span className="text-brand-DEFAULT font-bold text-lg">{infoData.price}</span>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
};

// === SUB-COMPONENTS ===

const ControlBtn = ({ onClick, icon: Icon, active }: any) => (
  <motion.button 
      whileHover={{ scale: 1.1, backgroundColor: active ? "var(--brand-color)" : "rgba(255,255,255,0.1)" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick} 
      className={cn(
        "w-16 h-16 flex items-center justify-center rounded-full transition-colors border",
        active ? "bg-white/5 border-white/10 text-white" : "bg-transparent border-white/5 text-neutral-500"
      )}
  >
      <Icon size={24}/>
  </motion.button>
);

const ServiceCard = ({ active, onClick, onInfo, icon: Icon, title, price, composition, desc, highlight }: any) => (
    <motion.div 
        variants={fadeInUp}
        // REMOVIDO: layout prop para evitar glitch visual ao clicar
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={onClick}
        className={cn(
            "cursor-pointer p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group h-full w-full box-border", 
            active 
                ? "bg-brand-DEFAULT/10 border-brand-DEFAULT shadow-[0_0_20px_var(--brand-glow)] ring-1 ring-brand-DEFAULT z-10" 
                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
        )}
    >
        {highlight && (
            <div className={cn(
                "absolute top-0 right-0 text-[8px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-bl-xl uppercase tracking-widest z-20",
                active ? "bg-brand-DEFAULT text-white" : "bg-white/10 text-neutral-500"
            )}>
                Popular
            </div>
        )}

        <button 
          className="absolute top-2 left-2 md:top-3 md:left-3 text-neutral-500 hover:text-white transition-colors z-20 p-2 hover:bg-white/5 rounded-full"
          onClick={(e) => {
             e.stopPropagation();
             if (onInfo) onInfo({ title, desc, price });
          }}
        >
            <HelpCircle size={18} strokeWidth={2} className="md:w-6 md:h-6" />
        </button>
        
        {/* 1. ICONE - BG WHITE/20 TEXT-WHITE PARA CONSISTÊNCIA */}
        <div className={cn(
            "mt-4 mb-3 md:mb-5 shrink-0 h-12 w-12 md:h-16 md:w-16 flex items-center justify-center rounded-full transition-all duration-300",
            active ? "bg-white/20 text-white" : "text-neutral-300 bg-white/10 group-hover:bg-white/20 group-hover:text-white"
        )}>
            <Icon size={24} className="md:hidden" strokeWidth={1.5} />
            <Icon size={32} className="hidden md:block" strokeWidth={1.5} />
        </div>
        
        {/* 2. TÍTULO */}
        <div className="w-full h-[3rem] md:h-[4.5rem] flex items-center justify-center px-1 mb-2 overflow-hidden">
            <h4 className={cn(
                "text-sm md:text-xl font-serif transition-colors leading-tight line-clamp-2", 
                active ? "text-white font-medium" : "text-neutral-300 group-hover:text-white"
            )}>
                {title}
            </h4>
        </div>
            
        {/* 3. DESCRIÇÃO */}
        <div className="w-full h-[2.5rem] md:h-[3.5rem] px-1 md:px-2 mb-4 md:mb-6 flex items-start justify-center overflow-hidden">
            <p className="text-[11px] md:text-sm text-neutral-400 leading-relaxed font-light tracking-wide line-clamp-2">
                {composition || desc}
            </p>
        </div>

        {/* 4. RODAPÉ */}
        <div className="w-full pt-3 md:pt-4 border-t border-white/5 mt-auto">
            <p className={cn("text-xs md:text-sm font-bold tracking-widest uppercase truncate", active ? "text-brand-DEFAULT" : "text-neutral-400")}>
                {price}
            </p>
        </div>
    </motion.div>
);

const AddonCard = ({ label, price, icon: Icon, active, onClick, onInfo, desc }: any) => (
    <motion.div 
        variants={fadeInUp}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
            "cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl border transition-all select-none relative gap-3 h-full group box-border", 
            active ? "bg-brand-DEFAULT/10 border-brand-DEFAULT shadow-[0_0_15px_rgba(220,38,38,0.2)] ring-1 ring-brand-DEFAULT" : "bg-neutral-900/40 border-white/5 hover:bg-white/5"
        )}
    >
        <button 
          className="absolute top-3 left-3 text-neutral-600 hover:text-white transition-colors z-20 p-2 hover:bg-white/5 rounded-full"
          onClick={(e) => {
             e.stopPropagation();
             if (onInfo && desc) onInfo({ title: label, desc, price: formatCurrency(price) });
          }}
        >
            <HelpCircle size={18} strokeWidth={2} />
        </button>

        <div className={cn(
            "absolute top-3 right-3 w-6 h-6 rounded-full border flex items-center justify-center transition-all", 
            active ? "bg-brand-DEFAULT border-brand-DEFAULT" : "border-white/10 bg-black/20"
        )}>
            {active && <Check size={14} className="text-white" />}
        </div>

        {/* Ícone - BG WHITE/20 TEXT-WHITE PARA CONSISTÊNCIA */}
        <div className={cn(
            "p-4 rounded-full mb-1 transition-all duration-300", 
            active ? "bg-white/20 text-white" : "bg-white/10 text-neutral-300 group-hover:bg-white/20 group-hover:text-white"
        )}>
           <Icon size={28} />
        </div>
        
        <div className="space-y-1 text-center">
            <p className={cn("text-base font-medium", active ? "text-white" : "text-neutral-300")}>{label}</p>
            <p className="text-xs text-brand-DEFAULT font-bold bg-brand-DEFAULT/10 py-1 px-3 rounded-full inline-block">
                + {formatCurrency(price)}
            </p>
        </div>
    </motion.div>
);

export default UpsellList;
