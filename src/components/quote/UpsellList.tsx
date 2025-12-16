
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Video, MapPin, Gift, Crown, GraduationCap, Heart, 
  Store, Building2, Aperture, Plane, Clock, Zap, Minus, Plus, Route, Star, Info, X, MessageCircle, MousePointerClick
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { ServiceCategory, ServiceId } from '../../types';
import Button from '../ui/Button';

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
}

/**
 * Componente: UpsellList (O Configurador Visual)
 * ----------------------------------------------
 * Este é o componente mais complexo visualmente. Ele gerencia:
 * 1. As abas de navegação (Categorias).
 * 2. A grade de cards de serviço (Produtos).
 * 3. Os controles de quantidade/horas (Inputs).
 * 
 * DESIGN PATTERN:
 * Utilizamos Renderização Condicional ({category === 'x' && ...}) para trocar
 * o conteúdo da grade sem recarregar a página ou usar rotas complexas.
 */
const UpsellList: React.FC<UpsellListProps> = ({ 
  category, setCategory,
  serviceId, setServiceId,
  hours, setHours,
  qty, setQty,
  addDrone, setAddDrone,
  addRealTime, setAddRealTime,
  distance,
  pricePerKm,
  locationClient
}) => {

  // Definição estática das categorias para gerar as abas
  const categories = [
    { id: 'social', label: 'Eventos Sociais', icon: Crown },
    { id: 'commercial', label: 'Comercial', icon: Store },
    { id: 'studio', label: 'Estúdio', icon: Aperture },
    { id: 'video_production', label: 'Produção', icon: Video },
    { id: 'custom', label: 'Personalizado', icon: Star, highlight: true },
  ];

  // LÓGICA DE NEGÓCIO: Cálculo de Frete
  // Se for Estúdio (cliente vai até nós) ou Personalizado (a combinar), frete é zero.
  const isNoTravelCost = category === 'studio' || category === 'custom';
  const travelCost = isNoTravelCost ? 0 : distance * 2 * pricePerKm;

  const whatsappNumber = "5584981048857";

  // LÓGICA DE UI: Indicador Animado ("Mãozinha/Dedo")
  // Objetivo: Ensinar o usuário que os cards são clicáveis.
  // Regra: Aparece apenas na categoria inicial e some no primeiro clique.
  const [showIndicator, setShowIndicator] = useState(true);

  // Effect: Remove indicador se usuário trocar de aba manualmente
  useEffect(() => {
      if (category !== 'social') setShowIndicator(false);
  }, [category]);

  // Handler: Ao clicar em um serviço, seleciona e esconde a ajuda visual
  const handleServiceClick = (id: ServiceId) => {
      setServiceId(id);
      setShowIndicator(false);
  };

  return (
    <section id="configurator" className="pt-4 pb-12 px-4 md:px-8 bg-neutral-900/30 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* === 1. NAVEGAÇÃO POR ABAS (TABS) === */}
        <div className="relative z-20 text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">Qual a ocasião do serviço?</p>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {categories.map((cat) => {
                    const isActive = category === cat.id;
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id as ServiceCategory)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-all text-sm md:text-base font-medium flex-1 md:flex-none justify-center whitespace-nowrap",
                                isActive 
                                    ? cn(
                                        "bg-brand-DEFAULT text-white shadow-lg shadow-brand-DEFAULT/20",
                                        // APLICA BORDA BRANCA para destaque (Exceto Custom que tem cor própria)
                                        cat.id !== 'custom' && "border-2 border-white"
                                    ) 
                                    : "text-neutral-400 hover:text-white hover:bg-white/5",
                                // Destaque dourado/vermelho para "Personalizado" quando inativo
                                cat.highlight && !isActive && "text-brand-DEFAULT hover:bg-brand-DEFAULT/10 border border-brand-DEFAULT/20"
                            )}
                        >
                            <Icon size={18} className="shrink-0" />
                            <span className="hidden sm:inline">{cat.label}</span>
                            {/* Versão mobile abreviada do texto */}
                            <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                        </button>
                    )
                })}
            </div>
        </div>

        {/* Container dos Cards (Animação de entrada suave ao trocar categoria) */}
        <motion.div 
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 relative"
        >
            {/* 
               === INDICADOR DE INTERAÇÃO (MOUSE CLICK) === 
               Posicionado estrategicamente sobre o PRIMEIRO CARD.
               Mobile: Centralizado.
               Desktop: Alinhado à esquerda (primeira coluna).
            */}
            <AnimatePresence>
                {showIndicator && category === 'social' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        // Ajuste de posição: Topo alinhado com o card, esquerda ajustada para mobile/desktop
                        className="absolute top-12 left-1/2 -translate-x-1/2 md:left-32 md:translate-x-0 z-30 pointer-events-none"
                    >
                        {/* Ícone Pulsante (Mouse Pointer) - Animação de "Toque/Clique" sutil */}
                        <motion.div
                            animate={{ 
                                scale: [1, 0.9, 1], // Simula o pressionar do botão
                                rotate: [0, -15, 0] // Leve inclinação para parecer natural
                            }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <MousePointerClick size={48} className="text-white fill-brand-DEFAULT drop-shadow-[0_5px_15px_rgba(220,38,38,0.6)]" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === 2. GRID DE SERVIÇOS (RENDERIZAÇÃO CONDICIONAL) === */}
            {/* 
                NOTA: Removemos 'auto-rows-fr' para que os cards tenham altura independente.
                Assim, quando um card expande (info), o vizinho não estica junto.
                Usamos 'items-start' para alinhar ao topo se houver diferença de altura.
            */}
            
            {/* CATEGORIA: SOCIAL */}
            {category === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <ServiceCard 
                        active={serviceId === 'birthday'} onClick={() => handleServiceClick('birthday')}
                        icon={Gift} title="Aniversário / Chá" price="R$ 400 (2h)"
                        desc="Cobertura completa dos parabéns e decoração."
                        details="Inclui 2 horas de cobertura fotográfica. Todas as fotos tratadas entregues via link. Valor de hora extra aplicável. Ideal para Chá Revelação, Mesversário e Aniversários intimistas."
                    />
                    <ServiceCard 
                        active={serviceId === 'fifteen'} onClick={() => handleServiceClick('fifteen')}
                        icon={Crown} title="15 Anos" price="R$ 400 (2h)"
                        desc="Registro especial do debut."
                        details="Foco na debutante, recepção e valsa. Inclui 2 horas de cobertura base. Fotos ilimitadas durante o período contratado com tratamento de cor profissional."
                    />
                    <ServiceCard 
                        active={serviceId === 'graduation'} onClick={() => handleServiceClick('graduation')}
                        icon={GraduationCap} title="Formatura" price="R$ 800 (Fixo)"
                        details="Cobertura do evento de colação ou baile. Valor fechado para o evento (sem limite rígido de horas, cobrindo os momentos principais). Entrega digital em alta resolução."
                    />
                    <ServiceCard 
                        active={serviceId === 'wedding_base'} onClick={() => handleServiceClick('wedding_base')}
                        icon={Heart} title="Casamento (Base)" price="R$ 650"
                        desc="Cerimônia + Decoração + Convidados"
                        details="Cobertura essencial do casamento. Inclui fotos protocolares, decoração, cerimônia religiosa/civil e fotos com padrinhos e convidados."
                    />
                    
                    {/* Sub-seção: Pacotes Especiais */}
                    <div className="md:col-span-2 pt-4">
                        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3 ml-1">Pacotes de Casamento</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <ServiceCard 
                                active={serviceId === 'wedding_classic'} onClick={() => handleServiceClick('wedding_classic')}
                                title="Clássico" price="R$ 900"
                                desc="Pré-Wedding + Casamento"
                                details="O pacote essencial. Inclui ensaio Pré-Wedding (externo) e a cobertura completa do evento de Casamento (Cerimônia e Recepção)."
                                highlight
                            />
                            <ServiceCard 
                                active={serviceId === 'wedding_romance'} onClick={() => handleServiceClick('wedding_romance')}
                                title="Romance" price="R$ 1.150"
                                desc="Pré + Making Off + Casamento"
                                details="Pacote intermediário. Acrescenta a cobertura do Making Of da noiva/noivo, capturando a emoção da preparação, além do Pré-Wedding e Casamento."
                                highlight
                            />
                            <ServiceCard 
                                active={serviceId === 'wedding_essence'} onClick={() => handleServiceClick('wedding_essence')}
                                title="Essência" price="R$ 1.750"
                                desc="Pré + MkOff + Casamento + Vídeo"
                                details="A experiência completa EAREC. Tudo do pacote Romance + cobertura de VÍDEO cinematográfico do grande dia (Highlight/Melhores Momentos)."
                                highlight
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* CATEGORIA: COMERCIAL */}
            {category === 'commercial' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <ServiceCard 
                        active={serviceId === 'comm_photo'} onClick={() => handleServiceClick('comm_photo')}
                        icon={Camera} title="Fotografia" price="R$ 20 / foto"
                        desc="Para lojas e gastronomia."
                        details="Valor por foto tratada. Ideal para e-commerce, cardápios e lookbooks."
                    />
                    <ServiceCard 
                        active={serviceId === 'comm_video'} onClick={() => handleServiceClick('comm_video')}
                        icon={Video} title="Vídeo" price="R$ 500"
                        desc="Captação + Edição (até 1min)."
                        details="Produção de vídeo institucional ou promocional (Reels/TikTok) de até 1 minuto."
                    />
                    <ServiceCard 
                        active={serviceId === 'comm_combo'} onClick={() => handleServiceClick('comm_combo')}
                        icon={Zap} title="Combo Visual" price="Vídeo + Fotos"
                        desc="Foto + Vídeo (até 1min)"
                        details="O pacote completo para redes sociais. Inclui a produção do vídeo comercial E as fotos dos produtos/espaço. Selecione a quantidade de fotos desejada abaixo."
                        highlight
                    />
                </div>
            )}

            {/* CATEGORIA: ESTÚDIO */}
            {category === 'studio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <ServiceCard 
                        active={serviceId === 'studio_photo'} onClick={() => handleServiceClick('studio_photo')}
                        icon={Camera} title="Ensaio em Estúdio" price="R$ 25 / foto"
                        details="Sessão fotográfica em ambiente controlado. Iluminação profissional. Valor por foto escolhida e tratada (Skin retouch incluso)."
                    />
                    <ServiceCard 
                        active={serviceId === 'studio_video'} onClick={() => handleServiceClick('studio_video')}
                        icon={Video} title="Vídeo em Estúdio" price="R$ 350 (2h)"
                        details="Gravação de conteúdo em estúdio (ex: Cursos, Youtube, Entrevistas). Valor referente a diária de 2 horas de estúdio com operador."
                    />
                </div>
            )}

            {/* CATEGORIA: PRODUÇÃO */}
            {category === 'video_production' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <ServiceCard 
                        active={serviceId === 'edit_only'} onClick={() => handleServiceClick('edit_only')}
                        icon={Zap} title="Apenas Edição" price="R$ 250 / vídeo"
                        details="Você envia o material bruto, nós editamos. Cortes, transições, correção de cor e sound design."
                    />
                    <ServiceCard 
                        active={serviceId === 'cam_cap'} onClick={() => handleServiceClick('cam_cap')}
                        icon={Video} title="Captação Câmera" price="R$ 350"
                        details="Operador de câmera profissional com equipamento de cinema (4K). Valor por serviço/diária (até 6h)."
                    />
                    <ServiceCard 
                        active={serviceId === 'mobile_cap'} onClick={() => handleServiceClick('mobile_cap')}
                        icon={SmartphoneIcon} title="Captação Celular" price="R$ 250"
                        details="Captação ágil com iPhone de última geração. Ideal para bastidores e conteúdo nativo para Stories/TikTok."
                    />
                    <ServiceCard 
                        active={serviceId === 'drone'} onClick={() => handleServiceClick('drone')}
                        icon={Plane} title="Drone" price="R$ 250"
                        details="Imagens aéreas em 4K. Inclui 2 baterias de voo. Operador licenciado."
                    />
                </div>
            )}

            {/* CATEGORIA: PERSONALIZADO */}
            {category === 'custom' && (
                <div className="bg-white/5 border border-white/10 p-8 rounded-xl text-center group transition-colors hover:border-white/20">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Star size={48} className="text-red-600 mx-auto mb-4 fill-red-600/20" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-serif text-neutral-200 mb-2">Orçamento Personalizado</h3>
                    <p className="text-neutral-500 mb-6 max-w-lg mx-auto text-sm">
                        Projetos únicos exigem soluções sob medida. Fale diretamente com nossa equipe criativa.
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
                </div>
            )}


            {/* === 3. CONTROLES QUANTITATIVOS (CONDICIONAIS) === */}
            
            {/* Seletor de HORAS (Apenas para categorias temporais: Aniversário/15 Anos) */}
            {(serviceId === 'birthday' || serviceId === 'fifteen') && category === 'social' && (
                <div className="bg-white/5 p-8 rounded-xl border border-white/10 flex flex-col items-center">
                    <div className="flex items-center gap-2 text-white mb-6">
                        <Clock className="text-brand-DEFAULT" />
                        <span className="font-serif text-xl">Duração do Evento</span>
                    </div>
                    
                    <span className="text-7xl font-sans font-bold text-white mb-2 tracking-tighter">
                        {hours}<span className="text-2xl text-neutral-500 ml-1 font-normal">h</span>
                    </span>
                    <p className="text-sm text-neutral-400 mb-8">Tempo total de cobertura</p>

                    <div className="flex items-center gap-6 w-full max-w-xs justify-center">
                        <button onClick={() => setHours(Math.max(2, hours - 1))} className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Minus size={24} /></button>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden min-w-[50px]">
                            <div className="h-full bg-brand-DEFAULT transition-all" style={{ width: `${(hours / 10) * 100}%` }} />
                        </div>
                        <button onClick={() => setHours(hours + 1)} className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Plus size={24} /></button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-6 bg-black/30 px-3 py-1 rounded-full text-center">Incluso 2h base. +R$ 250/h extra.</p>
                </div>
            )}

            {/* Seletor de QUANTIDADE (Para itens unitários: Fotos, Edições) */}
            {(
                (category === 'commercial' && (serviceId === 'comm_photo' || serviceId === 'comm_combo')) || 
                serviceId === 'studio_photo' || 
                serviceId === 'edit_only'
             ) && (
                <div className="bg-white/5 p-8 rounded-xl border border-white/10 flex flex-col items-center shadow-2xl">
                    <div className="flex items-center gap-2 text-white mb-6">
                        <Camera className="text-brand-DEFAULT" />
                        <span className="font-serif text-xl">Quantidade de {serviceId === 'edit_only' ? 'Vídeos' : 'Fotos'}</span>
                    </div>
                    
                    <div className="relative mb-8">
                        <span className="text-8xl font-sans font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {qty}
                        </span>
                        <span className="absolute -right-8 top-2 text-lg text-neutral-500 font-medium">und</span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8 w-full max-w-sm justify-center">
                        <button 
                            onClick={() => setQty(Math.max(1, qty - 5))} 
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
                            onClick={() => setQty(qty + 5)} 
                            className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition-all group shrink-0"
                        >
                            <Plus size={24} className="text-neutral-400 group-hover:text-white" />
                        </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-6">Ajuste de 5 em 5 unidades.</p>
                </div>
            )}

            {/* ADICIONAIS (Checkboxes) - Social Only */}
            {category === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                        onClick={() => setAddRealTime(!addRealTime)}
                        className={cn("cursor-pointer p-4 rounded-lg border flex items-center gap-4 transition-all", addRealTime ? "bg-brand-DEFAULT/20 border-brand-DEFAULT" : "bg-white/5 border-white/10")}
                    >
                        <div className={cn("w-6 h-6 rounded border flex items-center justify-center shrink-0", addRealTime ? "bg-brand-DEFAULT border-brand-DEFAULT" : "border-white/50")}>
                           {addRealTime && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                            <p className="text-white font-medium">Fotos Real Time (+ R$ 600)</p>
                            <p className="text-xs text-neutral-400">Entrega imediata durante o evento.</p>
                        </div>
                    </div>

                    <div 
                        onClick={() => setAddDrone(!addDrone)}
                        className={cn("cursor-pointer p-4 rounded-lg border flex items-center gap-4 transition-all", addDrone ? "bg-brand-DEFAULT/20 border-brand-DEFAULT" : "bg-white/5 border-white/10")}
                    >
                        <div className={cn("w-6 h-6 rounded border flex items-center justify-center shrink-0", addDrone ? "bg-brand-DEFAULT border-brand-DEFAULT" : "border-white/50")}>
                           {addDrone && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                            <p className="text-white font-medium">Imagens de Drone (+ R$ 250)</p>
                            <p className="text-xs text-neutral-400">Perspectivas aéreas cinematográficas.</p>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>

        {/* LOGÍSTICA (Compacta) */}
        {!isNoTravelCost && (
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full"><Route size={20} className="text-brand-DEFAULT" /></div>
                    <div>
                        <p className="text-xs text-neutral-500 uppercase">Destino</p>
                        <p className="text-white font-medium">{locationClient} <span className="text-neutral-500 text-sm">({distance} km)</span></p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-neutral-500 uppercase">Taxa de Deslocamento</p>
                    <p className="text-xl text-white font-mono">{travelCost > 0 ? formatCurrency(travelCost) : "Grátis"}</p>
                </div>
            </div>
        )}
        
        {isNoTravelCost && category !== 'custom' && (
             <div className="border-t border-white/10 pt-8 text-center">
                <span className="text-xs text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    Deslocamento Gratuito (Estúdio)
                </span>
             </div>
        )}

      </div>
    </section>
  );
};

// Componente Auxiliar: ServiceCard
// Renderiza cada opção de serviço com estado de ativo e detalhes expansíveis
const ServiceCard = ({ active, onClick, icon: Icon, title, price, desc, details, highlight }: any) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div 
            onClick={onClick}
            className={cn(
                "cursor-pointer p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-full", 
                active 
                    ? "bg-gradient-to-br from-neutral-800 to-neutral-900 border-brand-DEFAULT shadow-lg shadow-brand-DEFAULT/10" 
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                highlight && active && "ring-1 ring-brand-DEFAULT"
            )}
        >
            {active && <div className="absolute top-0 right-0 w-16 h-16 bg-brand-DEFAULT/20 blur-xl rounded-full -mr-8 -mt-8 pointer-events-none" />}
            
            <div>
                {/* 
                   HEADER DO CARD 
                   Justify-between garante que o ícone fique na esquerda
                   e o bloco de ações (Info + Dot) fique sempre na extrema DIREITA.
                */}
                <div className="flex items-start justify-between mb-3">
                    {Icon && (
                        <motion.div
                            animate={active ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Ícone agora sempre com a cor da marca (brand-DEFAULT) para destaque */}
                            <Icon size={24} className="mb-2 text-brand-DEFAULT" />
                        </motion.div>
                    )}
                    
                    {/* Bloco Direita: Info + Indicador Ativo */}
                    <div className="flex items-center gap-2">
                        {details && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDetails(!showDetails);
                                }}
                                className="text-neutral-500 hover:text-white transition-colors p-1 z-10"
                                title="Ver detalhes"
                            >
                                <Info size={16} />
                            </button>
                        )}
                        {/* Dot indicador de seleção */}
                        {active && <div className="w-2 h-2 bg-brand-DEFAULT rounded-full" />}
                    </div>
                </div>
                <h4 className={cn("font-serif text-lg leading-tight mb-1", active ? "text-white" : "text-neutral-300")}>{title}</h4>
                {desc && <p className="text-xs text-neutral-500 mb-2">{desc}</p>}
            </div>

            <p className={cn("text-sm font-medium mt-2", active ? "text-brand-DEFAULT" : "text-white/60")}>{price}</p>

            {/* Painel de Detalhes Expandível */}
            <AnimatePresence>
                {showDetails && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 mt-3 border-t border-white/10 text-xs text-neutral-300 leading-relaxed bg-black/20 -mx-5 -mb-5 p-5">
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

// Ícone auxiliar SVG (substituto caso Lucide não tenha um específico desejado)
const SmartphoneIcon = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);

export default UpsellList;
