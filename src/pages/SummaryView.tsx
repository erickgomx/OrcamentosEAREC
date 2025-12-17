
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Copyright, CreditCard, ArrowLeft, PenTool, MapPin, Settings2, User, Phone, Edit2, Save, X, Banknote, QrCode, FileText, Check, Map as MapIcon, RefreshCcw, Trash2 } from 'lucide-react';
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

const SummaryView: React.FC<SummaryViewProps> = ({ 
  clientData, onUpdateClientData, quoteData, totalPrice, paymentMethod,
  setPaymentMethod, onBack, onProceedToSign, summaryDetails, priceBreakdown = [], onRemoveAddon
}) => {
  const [showContent, setShowContent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [tempData, setTempData] = useState<ClientData>(clientData);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { setTempData(clientData); }, [clientData]);

  useEffect(() => {
    const timer = setTimeout(() => { setShowContent(true); }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => { onUpdateClientData(tempData); setIsEditing(false); };
  const handleCancel = () => { setTempData(clientData); setIsEditing(false); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
    <div className="fixed inset-0 z-50 bg-neutral-950 overflow-y-auto">
      <AnimatePresence>
        {!showContent && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black z-50"
          >
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
              <Logo className="w-64" animate />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showContent && (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="min-h-screen py-12 px-4 md:px-6 relative"
        >
             <div className="fixed top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand-DEFAULT/5 to-transparent pointer-events-none" />

             <motion.div className="max-w-3xl mx-auto relative z-10" variants={staggerContainer} initial="hidden" animate="visible">
                
                <motion.div variants={fadeInUp} className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group text-sm">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        VOLTAR
                    </button>
                    <div className="text-right">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest">Resumo do Pedido</p>
                        <p className="text-white font-serif text-lg">{quoteData.id}</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-6">
                    
                    {/* DADOS DO CLIENTE */}
                    <motion.div variants={fadeInUp} layout className="bg-neutral-900/50 border border-white/10 rounded-lg overflow-hidden relative">
                        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2">
                                <User size={14} className="text-brand-DEFAULT" />
                                Dados do Cliente
                            </h3>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-white/5">
                                    <Edit2 size={12} /> Editar
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleCancel} className="text-neutral-400 hover:text-white p-1"><X size={14}/></button>
                                    <button onClick={handleSave} className="text-brand-DEFAULT hover:text-white p-1"><Save size={14}/></button>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-500 uppercase tracking-widest">Nome / Empresa</label>
                                    {isEditing ? (
                                        <input name="name" value={tempData.name} onChange={handleChange} className="w-full bg-transparent border-b border-brand-DEFAULT text-white py-1 focus:outline-none" />
                                    ) : ( <p className="text-white font-medium">{clientData.name}</p> )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-500 uppercase tracking-widest">Data do Evento</label>
                                    {isEditing ? (
                                        <input name="date" type="date" min={today} value={getInputDateValue(tempData.date)} onChange={handleChange} className="w-full bg-transparent border-b border-brand-DEFAULT text-white py-1 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert" />
                                    ) : ( <p className="text-white font-medium">{formatDateSafe(clientData.date)}</p> )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-500 uppercase tracking-widest">Local do Serviço</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <input name="location" value={tempData.location} onChange={handleChange} className="w-full bg-transparent border-b border-brand-DEFAULT text-white py-1 pr-10 focus:outline-none" />
                                            <button onClick={() => setIsMapOpen(true)} className="absolute right-0 top-0 text-neutral-400 hover:text-brand-DEFAULT p-1" title="Abrir Mapa"><MapIcon size={16} /></button>
                                        </div>
                                    ) : ( <p className="text-white font-medium flex items-center gap-2"><MapPin size={12} className="text-neutral-500" />{clientData.location}</p> )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-500 uppercase tracking-widest">Contato</label>
                                    {isEditing ? (
                                        <input name="contact" value={tempData.contact} onChange={handleChange} className="w-full bg-transparent border-b border-brand-DEFAULT text-white py-1 focus:outline-none" />
                                    ) : ( <p className="text-white font-medium flex items-center gap-2"><Phone size={12} className="text-neutral-500" />{clientData.contact}</p> )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ESCOPO DO PROJETO DETALHADO */}
                    <motion.div variants={fadeInUp} layout className="bg-neutral-900/50 border border-white/10 rounded-lg overflow-hidden flex flex-col">
                         <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2">
                                <FileText size={14} className="text-brand-DEFAULT" />
                                Escopo Financeiro
                            </h3>
                            <button onClick={onBack} className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-white/5">
                                <RefreshCcw size={12} /> Alterar Itens
                            </button>
                         </div>
                         
                         <div className="p-6 flex-1 flex flex-col">
                            {/* Categoria */}
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-4">
                                {summaryDetails.categoryLabel}
                            </p>

                            {/* Lista de Itens com Preços */}
                            <div className="space-y-3 mb-6">
                                {priceBreakdown.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className={cn(
                                            "flex justify-between items-center text-sm py-1 border-b border-white/5 hover:bg-white/5 px-2 -mx-2 rounded transition-colors group cursor-default",
                                            item.type === 'freight' ? "text-neutral-400 italic" : "text-neutral-200"
                                        )}
                                        onDoubleClick={() => {
                                            if (item.type === 'addon' && onRemoveAddon) {
                                                onRemoveAddon(item.label);
                                            }
                                        }}
                                        title={item.type === 'addon' ? "Duplo clique para remover" : ""}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{item.label}</span>
                                            {item.type === 'addon' && <Trash2 size={12} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {item.value === 0 ? (
                                                <span className="text-green-500 text-xs uppercase font-medium">Incluso</span>
                                            ) : (
                                                <span className="font-mono">{formatCurrency(item.value)}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/10">
                                <div className="flex justify-between items-end">
                                    <div className="text-left">
                                         <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Total Final</p>
                                         <p className="text-2xl text-white font-serif"><AnimatedPrice value={totalPrice} /></p>
                                    </div>
                                    {summaryDetails.addons.length > 0 && (
                                        <p className="text-[9px] text-neutral-600 italic max-w-[150px] text-right">
                                            Dica: Clique duas vezes em um item adicional para removê-lo.
                                        </p>
                                    )}
                                </div>
                            </div>
                         </div>
                    </motion.div>

                    {/* CONTRATO E PAGAMENTO */}
                    <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-5 flex items-start gap-4 h-full">
                            <div className="mt-1 text-neutral-400"><Copyright size={18} /></div>
                            <div>
                                <h4 className="text-sm font-medium text-white mb-1">Condições de Pagamento</h4>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                    Entrada de 50% na assinatura do contrato para reserva da data e 50% na entrega do material final.
                                </p>
                            </div>
                        </div>

                         <div className="bg-white/5 border border-white/10 rounded-lg p-5 h-full">
                            <div className="flex items-center gap-2 mb-3 text-white">
                                <CreditCard size={18} className="text-neutral-400" />
                                <h4 className="text-sm font-medium">Forma de Pagamento</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {['Pix', 'Cartão', 'Espécie'].map((method) => (
                                    <button 
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-2 rounded border text-xs transition-all",
                                            paymentMethod === method 
                                                ? "bg-brand-DEFAULT/20 border-brand-DEFAULT text-white" 
                                                : "bg-black/20 border-white/5 text-neutral-500 hover:bg-white/5"
                                        )}
                                    >
                                        {method === 'Pix' && <QrCode size={16} className="mb-1" />}
                                        {method === 'Cartão' && <CreditCard size={16} className="mb-1" />}
                                        {method === 'Espécie' && <Banknote size={16} className="mb-1" />}
                                        <span>{method}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-neutral-500 mt-2 text-center">
                                {paymentMethod === 'Pix' && "Pagamento à vista."}
                                {paymentMethod === 'Cartão' && "Parcelamento em até 12x (com acréscimo)."}
                                {paymentMethod === 'Espécie' && "Pagamento no ato do contrato."}
                            </p>
                        </div>
                    </motion.div>

                    {/* TOTAL FINAL */}
                    <motion.div variants={fadeInUp} className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center">
                        <Button 
                            onClick={onProceedToSign}
                            size="lg" 
                            className="w-full md:w-auto md:min-w-[300px] shadow-[0_0_30px_rgba(220,38,38,0.3)] py-4 text-lg"
                        >
                            <PenTool size={20} className="mr-2" />
                            Confirmar Orçamento
                        </Button>
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
