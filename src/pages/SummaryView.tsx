import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Copyright, CreditCard, ArrowLeft, PenTool, MapPin, User, Phone, Edit2, X, Banknote, QrCode, FileText, Map as MapIcon, Trash2, PlusCircle, Check, Loader2, Cloud, ChevronDown, Sparkles, ShieldCheck } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import AnimatedPrice from '../components/ui/AnimatedPrice';
import LocationMapModal from '../components/ui/LocationMapModal';
import { QuoteData, ClientData } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { fadeInUp, staggerContainer } from '../lib/animations';

interface SummaryDetails {
    serviceName: string;
    categoryLabel: string;
    metricLabel: string;
    addons: string[];
}

interface PriceItem {
    label: string;
    value: number;
    type: 'base' | 'addon' | 'freight';
}

interface SummaryViewProps {
  clientData: ClientData;
  onUpdateClientData: (data: ClientData) => void;
  quoteData: QuoteData;
  totalPrice: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onBack: () => void;
  onProceedToSign: () => void;
  summaryDetails: SummaryDetails;
  priceBreakdown?: PriceItem[];
  onRemoveAddon?: (addonName: string) => void;
}

// Componente Auxiliar para Campos de Informação
interface InfoFieldProps {
  label: string;
  children: React.ReactNode;
  icon: any;
  editing: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, children, icon: Icon, editing }) => (
    <div className={cn("flex gap-3", editing ? "opacity-100" : "opacity-80")}>
        <div className="mt-1 text-neutral-500 shrink-0">
            <Icon size={16} />
        </div>
        <div className="w-full">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-0.5">{label}</p>
            <div className="text-sm md:text-base text-white font-light leading-snug">
                {children}
            </div>
        </div>
    </div>
);

const SummaryView: React.FC<SummaryViewProps> = ({ 
  clientData, onUpdateClientData, quoteData, totalPrice, paymentMethod,
  setPaymentMethod, onBack, onProceedToSign, summaryDetails, priceBreakdown = [], onRemoveAddon
}) => {
  const [showContent, setShowContent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [tempData, setTempData] = useState<ClientData>(clientData);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [hasScrolled, setHasScrolled] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];

  // Sincroniza dados apenas quando NÃO está editando
  useEffect(() => { 
      if (!isEditing) {
          setTempData(clientData); 
      }
  }, [clientData, isEditing]);

  // Animação de entrada atrasada para permitir a transição do modal anterior
  useEffect(() => {
    const timer = setTimeout(() => { setShowContent(true); }, 800); 
    return () => clearTimeout(timer);
  }, []);

  // --- LÓGICA DE AUTO-SAVE (DEBOUNCE) ---
  useEffect(() => {
    if (!isEditing) return;

    setSaveStatus('saving');
    const handler = setTimeout(() => {
        onUpdateClientData(tempData);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600); 

    return () => clearTimeout(handler);
  }, [tempData, isEditing, onUpdateClientData]);

  const handleFinishEditing = () => {
      onUpdateClientData(tempData);
      setIsEditing(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'contact') {
        const numericValue = value.replace(/\D/g, ''); 
        if (numericValue.length > 15) return; 
        setTempData(prev => ({ ...prev, [name]: numericValue }));
        return;
    }
    setTempData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLocationSelect = (address: string) => {
      setTempData(prev => ({ ...prev, location: address }));
  };

  const formatDateSafe = (dateString: string) => {
    if (!dateString) return 'A definir';
    try {
        const datePart = dateString.includes('T') ? dateString.split('T')[0] : dateString;
        const date = new Date(`${datePart}T12:00:00`);
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return dateString; }
  };

  const getInputDateValue = (dateString: string) => {
      if (!dateString) return '';
      return dateString.includes('T') ? dateString.split('T')[0] : dateString;
  };

  return (
    <div 
        className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto"
        onScroll={(e) => setHasScrolled(e.currentTarget.scrollTop > 50)}
    >
      <AnimatePresence>
        {!showContent && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-50"
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
              <Logo className="w-64" animate />
              <p className="text-center text-neutral-500 text-[10px] uppercase tracking-widest mt-4">Preparando resumo...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-DEFAULT/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      {showContent && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen py-8 px-4 md:px-8 relative z-10 flex flex-col items-center"
        >
             <motion.div className="w-full max-w-6xl mx-auto" variants={staggerContainer} initial="hidden" animate="visible">
                
                {/* HEADER */}
                <motion.div variants={fadeInUp} className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-white/5 gap-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group text-sm font-medium bg-white/5 px-4 py-2 rounded-full hover:bg-white/10">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar à Configuração
                    </button>
                    <div className="text-center md:text-right">
                        <h2 className="text-white font-serif text-2xl md:text-3xl">Revisão do Pedido</h2>
                        <p className="text-neutral-500 text-xs uppercase tracking-widest mt-1">ID: {quoteData.id}</p>
                    </div>
                </motion.div>

                {/* MAIN GRID LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                    
                    {/* COLUNA ESQUERDA: DADOS + PAGAMENTO (lg:col-span-7) */}
                    <motion.div variants={fadeInUp} className="lg:col-span-7 space-y-6">
                        
                        {/* 1. CARD DADOS DO CLIENTE */}
                        <div className="bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-DEFAULT to-transparent opacity-50" />
                            
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                                    <User size={16} className="text-brand-DEFAULT" />
                                    Dados do Contrato
                                </h3>
                                
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
                                        <Edit2 size={12} /> Alterar
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider transition-all">
                                            {saveStatus === 'saving' && <><Loader2 size={10} className="animate-spin text-neutral-500" /><span className="text-neutral-500">Salvando...</span></>}
                                            {saveStatus === 'saved' && <><Cloud size={10} className="text-green-500" /><span className="text-green-500">Salvo</span></>}
                                        </div>
                                        <button onClick={handleFinishEditing} className="text-xs flex items-center gap-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 px-3 py-1.5 rounded-full transition-colors border border-green-500/20 font-medium">
                                            <Check size={12} /> Concluir
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <InfoField label="Nome / Empresa" icon={User} editing={isEditing}>
                                        {isEditing ? (
                                            <input name="name" value={tempData.name} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:border-brand-DEFAULT outline-none transition-colors placeholder:text-neutral-700" placeholder="Nome completo" />
                                        ) : clientData.name}
                                    </InfoField>

                                    <InfoField label="Data do Evento" icon={Calendar} editing={isEditing}>
                                        {isEditing ? (
                                            <input name="date" type="date" min={today} value={getInputDateValue(tempData.date)} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:border-brand-DEFAULT outline-none transition-colors [&::-webkit-calendar-picker-indicator]:invert" />
                                        ) : formatDateSafe(clientData.date)}
                                    </InfoField>

                                    <InfoField label="Localização" icon={MapPin} editing={isEditing}>
                                        {isEditing ? (
                                            <div className="relative">
                                                <input name="location" value={tempData.location} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 text-white py-1 pr-8 focus:border-brand-DEFAULT outline-none transition-colors placeholder:text-neutral-700" placeholder="Cidade ou Endereço" />
                                                <button onClick={() => setIsMapOpen(true)} className="absolute right-0 top-1 text-neutral-500 hover:text-brand-DEFAULT"><MapIcon size={16} /></button>
                                            </div>
                                        ) : (clientData.location || "A definir")}
                                    </InfoField>

                                    <InfoField label="WhatsApp" icon={Phone} editing={isEditing}>
                                        {isEditing ? (
                                            <input name="contact" type="tel" value={tempData.contact} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:border-brand-DEFAULT outline-none transition-colors placeholder:text-neutral-700" placeholder="(00) 00000-0000" />
                                        ) : (clientData.contact || "A definir")}
                                    </InfoField>
                                </div>
                            </div>
                        </div>

                        {/* 2. CARD PAGAMENTO */}
                        <div className="bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative">
                             <div className="flex items-center gap-2 mb-4 text-white">
                                <div className="p-2 bg-white/5 rounded-lg text-brand-DEFAULT">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-wide">Forma de Pagamento</h4>
                                    <p className="text-[10px] text-neutral-500">Selecione como prefere realizar o pagamento</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {['Pix', 'Cartão', 'Espécie'].map((method) => {
                                    const isActive = paymentMethod === method;
                                    return (
                                        <button 
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={cn(
                                                "relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all duration-300 group overflow-hidden",
                                                isActive 
                                                    ? "bg-brand-DEFAULT/10 border-brand-DEFAULT text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]" 
                                                    : "bg-black/20 border-white/5 text-neutral-400 hover:bg-white/5 hover:border-white/10 hover:text-white"
                                            )}
                                        >
                                            {isActive && <div className="absolute top-2 right-2 text-brand-DEFAULT"><Check size={14} /></div>}
                                            
                                            <div className={cn("mb-2 transition-transform duration-300", isActive ? "scale-110 text-brand-DEFAULT" : "group-hover:scale-110")}>
                                                {method === 'Pix' && <QrCode size={24} />}
                                                {method === 'Cartão' && <CreditCard size={24} />}
                                                {method === 'Espécie' && <Banknote size={24} />}
                                            </div>
                                            <span className="text-sm font-medium">{method}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            <motion.div 
                                key={paymentMethod}
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5 flex items-start gap-3"
                            >
                                <ShieldCheck size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    {paymentMethod === 'Pix' && <>Pagamento de <strong>50% na assinatura</strong> para reserva da data e <strong>50% na entrega</strong> do material.</>}
                                    {paymentMethod === 'Cartão' && <>Parcelamento em até <strong>12x no cartão de crédito</strong> (consultar taxas da maquininha).</>}
                                    {paymentMethod === 'Espécie' && <>Pagamento de <strong>50% na assinatura</strong> e 50% na entrega do material.</>}
                                </p>
                            </motion.div>
                        </div>

                    </motion.div>

                    {/* COLUNA DIREITA: RECIBO / TICKET (lg:col-span-5) */}
                    <motion.div variants={fadeInUp} className="lg:col-span-5 relative">
                        {/* EFEITO DE TICKET FLUTUANTE */}
                        <div className="sticky top-8">
                            <div className="relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                                
                                {/* TOPO DO TICKET */}
                                <div className="bg-brand-DEFAULT/10 p-6 border-b border-white/10 flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] text-brand-DEFAULT uppercase tracking-[0.2em] font-bold mb-1">Serviço Principal</p>
                                        <h3 className="text-xl md:text-2xl text-white font-serif leading-none">{summaryDetails.serviceName}</h3>
                                        <p className="text-neutral-400 text-xs mt-1">{summaryDetails.metricLabel}</p>
                                    </div>
                                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                        <FileText size={20} className="text-white opacity-80" />
                                    </div>
                                </div>

                                {/* LISTA DE ITENS */}
                                <div className="p-6 space-y-4 bg-dots-pattern">
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Detalhamento</p>
                                    
                                    <div className="space-y-3">
                                        {priceBreakdown.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start group">
                                                <div className="flex items-start gap-2 max-w-[70%]">
                                                    {item.type === 'addon' && onRemoveAddon && (
                                                        <button 
                                                            onClick={() => onRemoveAddon(item.label)} 
                                                            className="text-neutral-600 hover:text-red-500 transition-colors mt-0.5"
                                                            title="Remover Item"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                    <span className={cn(
                                                        "text-sm leading-tight",
                                                        item.type === 'base' ? "text-white font-medium" : "text-neutral-400",
                                                        item.type === 'freight' && "italic"
                                                    )}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                <span className={cn(
                                                    "text-sm font-mono",
                                                    item.value === 0 ? "text-green-500 text-xs uppercase font-bold mt-0.5" : "text-white"
                                                )}>
                                                    {item.label.includes("A consultar") 
                                                            ? "Consultar" 
                                                            : item.value === 0 ? "Incluso" : formatCurrency(item.value)
                                                    }
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="my-6 border-t-2 border-dashed border-white/10 relative">
                                        {/* Bolinhas decorativas do ticket */}
                                        <div className="absolute -left-[32px] -top-[10px] w-5 h-5 bg-neutral-950 rounded-full" />
                                        <div className="absolute -right-[32px] -top-[10px] w-5 h-5 bg-neutral-950 rounded-full" />
                                    </div>

                                    {/* TOTAL */}
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm text-neutral-500 font-medium uppercase tracking-widest">Valor Total</span>
                                        <div className="text-right">
                                            <span className="text-3xl md:text-4xl text-brand-DEFAULT font-serif block leading-none">
                                                <AnimatedPrice value={totalPrice} />
                                            </span>
                                            <span className="text-[10px] text-neutral-500 uppercase font-medium">Moeda: BRL</span>
                                        </div>
                                    </div>
                                </div>

                                {/* AÇÃO */}
                                <div className="p-4 bg-neutral-900 border-t border-white/5">
                                    <Button 
                                        onClick={onProceedToSign}
                                        size="lg" 
                                        className="w-full shadow-[0_0_30px_rgba(220,38,38,0.2)] py-4 text-base tracking-wide flex items-center justify-center gap-2"
                                    >
                                        <PenTool size={18} />
                                        <span>CONFIRMAR ORÇAMENTO</span>
                                    </Button>
                                    <div className="mt-3 text-center flex items-center justify-center gap-1.5 opacity-50">
                                        <Copyright size={10} className="text-neutral-500" />
                                        <p className="text-[9px] text-neutral-500 uppercase tracking-widest">EAREC Audiovisual Experience</p>
                                    </div>
                                </div>

                            </div>
                            
                            {/* Brilho de Fundo do Ticket */}
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[90%] bg-brand-DEFAULT/5 blur-3xl rounded-full" />
                        </div>
                    </motion.div>

                </div>
             </motion.div>
        </motion.div>
      )}

      <LocationMapModal 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectLocation={handleLocationSelect}
        initialAddress={tempData.location}
      />
    </div>
  );
};

export default SummaryView;