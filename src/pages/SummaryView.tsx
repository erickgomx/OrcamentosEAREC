
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Copyright, CreditCard, ArrowLeft, PenTool, MapPin, Settings2, User, Phone, Edit2, Save, X, Banknote, QrCode } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import AnimatedPrice from '../components/ui/AnimatedPrice';
import { QuoteData, ClientData } from '../types';
import { cn } from '../lib/utils';

interface SummaryViewProps {
  clientData: ClientData;
  onUpdateClientData: (data: ClientData) => void;
  quoteData: QuoteData;
  totalPrice: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onBack: () => void;
  onProceedToSign: () => void;
}

/**
 * Componente: SummaryView (Revisão)
 * ---------------------------------
 * Exibe o resumo final do pedido antes da assinatura.
 * Permite edição rápida dos dados do cliente (Nome, Data, Local).
 * Permite seleção da forma de pagamento.
 */
const SummaryView: React.FC<SummaryViewProps> = ({ 
  clientData, 
  onUpdateClientData,
  quoteData, 
  totalPrice,
  paymentMethod,
  setPaymentMethod,
  onBack, 
  onProceedToSign 
}) => {
  const [showContent, setShowContent] = useState(false);
  
  // Estado que controla se os campos estão em modo de edição
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado temporário (Buffer) para armazenar as mudanças durante a edição.
  // Só é comitado para o estado principal se o usuário clicar em "Salvar".
  const [tempData, setTempData] = useState<ClientData>(clientData);

  // Sincroniza estado local se clientData mudar externamente
  useEffect(() => {
    setTempData(clientData);
  }, [clientData]);

  // Sequência de Animação de Entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  // Comita as mudanças para o componente pai
  const handleSave = () => {
    onUpdateClientData(tempData);
    setIsEditing(false);
  };

  // Descarta as mudanças e restaura o valor original
  const handleCancel = () => {
    setTempData(clientData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  // Helper para mostrar datas de forma amigável
  const formatDateSafe = (dateString: string) => {
    if (!dateString) return 'A definir';
    try {
        const date = new Date(`${dateString}T12:00:00`);
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 overflow-y-auto">
      
      {/* 
         INTRO OVERLAY 
         Cobre a tela inteira com o logo enquanto os dados "carregam" 
         (efeito visual para transição de estados)
      */}
      <AnimatePresence>
        {!showContent && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Logo className="w-64" animate />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTEÚDO PRINCIPAL */}
      {showContent && (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="min-h-screen py-12 px-4 md:px-6 relative"
        >
             {/* Efeito de Luz no topo */}
             <div className="fixed top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand-DEFAULT/5 to-transparent pointer-events-none" />

             <div className="max-w-3xl mx-auto relative z-10">
                
                {/* Header Navigation Compacto */}
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group text-sm"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        VOLTAR
                    </button>
                    <div className="text-right">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest">Resumo do Pedido</p>
                        <p className="text-white font-serif text-lg">{quoteData.id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    
                    {/* SEÇÃO 1: DADOS DO CLIENTE (EDITÁVEL) */}
                    <motion.div 
                        layout
                        className="bg-neutral-900/50 border border-white/10 rounded-lg overflow-hidden relative"
                    >
                        {/* Barra de Título / Ações */}
                        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2">
                                <User size={14} className="text-brand-DEFAULT" />
                                Dados do Cliente
                            </h3>
                            {!isEditing ? (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-white/5"
                                >
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
                                {/* NOME */}
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-500 uppercase tracking-widest">Nome / Empresa</label>
                                    {isEditing ? (
                                        <input 
                                            name="name" value={tempData.name} onChange={handleChange}
                                            className="w-full bg-transparent border-b border-brand-DEFAULT text-white py-1 focus:outline-none"
                                        />
                                    ) : (
                                        <p className="text-white font-medium">{clientData.name}</p>
                                    )}
                                </div>

                                {/* DATA */}
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-500 uppercase tracking-widest">Data do Evento</label>
                                    {isEditing ? (
                                        <input 
                                            name="date" type="date" value={tempData.date} onChange={handleChange}
                                            className="w-full bg-transparent border-b border-brand-DEFAULT text-white py-1 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                                        />
                                    ) : (
                                        <p className="text-white font-medium flex items-center gap-2">
                                            {formatDateSafe(clientData.date)}
                                        </p>
                                    )}
                                </div>

                                {/* LOCAL */}
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-500 uppercase tracking-widest">Localização</label>
                                    {isEditing ? (
                                        <input 
                                            name="location" value={tempData.location} onChange={handleChange}
                                            className="w-full bg-transparent border-b border-brand-DEFAULT text-white py-1 focus:outline-none"
                                        />
                                    ) : (
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <MapPin size={12} className="text-neutral-500" />
                                            {clientData.location}
                                        </p>
                                    )}
                                </div>

                                {/* CONTATO */}
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-500 uppercase tracking-widest">Contato</label>
                                    {isEditing ? (
                                        <input 
                                            name="contact" value={tempData.contact} onChange={handleChange}
                                            className="w-full bg-transparent border-b border-brand-DEFAULT text-white py-1 focus:outline-none"
                                        />
                                    ) : (
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <Phone size={12} className="text-neutral-500" />
                                            {clientData.contact}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* SEÇÃO 2: DETALHES DO CONTRATO E PAGAMENTO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Termos Legais */}
                        <div className="bg-white/5 border border-white/10 rounded-lg p-5 flex items-start gap-4">
                            <div className="mt-1 text-neutral-400"><Copyright size={18} /></div>
                            <div>
                                <h4 className="text-sm font-medium text-white mb-1">Direitos de Imagem</h4>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                    Licenciamento incluso para uso comercial em redes sociais, website e tráfego pago por tempo indeterminado.
                                </p>
                            </div>
                        </div>

                         {/* SELEÇÃO DE PAGAMENTO */}
                         <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                            <div className="flex items-center gap-2 mb-3 text-white">
                                <CreditCard size={18} className="text-neutral-400" />
                                <h4 className="text-sm font-medium">Forma de Pagamento</h4>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                                {/* PIX */}
                                <button 
                                    onClick={() => setPaymentMethod('Pix')}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-2 rounded border text-xs transition-all",
                                        paymentMethod === 'Pix' 
                                            ? "bg-brand-DEFAULT/20 border-brand-DEFAULT text-white" 
                                            : "bg-black/20 border-white/5 text-neutral-500 hover:bg-white/5"
                                    )}
                                >
                                    <QrCode size={16} className="mb-1" />
                                    <span>Pix</span>
                                </button>
                                
                                {/* Cartão (Com Acréscimo) */}
                                <button 
                                    onClick={() => setPaymentMethod('Cartão')}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-2 rounded border text-xs transition-all",
                                        paymentMethod === 'Cartão' 
                                            ? "bg-brand-DEFAULT/20 border-brand-DEFAULT text-white" 
                                            : "bg-black/20 border-white/5 text-neutral-500 hover:bg-white/5"
                                    )}
                                >
                                    <CreditCard size={16} className="mb-1" />
                                    <span>Cartão</span>
                                </button>
                                
                                {/* Espécie (Substituto do Boleto) */}
                                <button 
                                    onClick={() => setPaymentMethod('Espécie')}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-2 rounded border text-xs transition-all",
                                        paymentMethod === 'Espécie' 
                                            ? "bg-brand-DEFAULT/20 border-brand-DEFAULT text-white" 
                                            : "bg-black/20 border-white/5 text-neutral-500 hover:bg-white/5"
                                    )}
                                >
                                    <Banknote size={16} className="mb-1" />
                                    <span>Espécie</span>
                                </button>
                            </div>
                            
                            {/* Texto Dinâmico de Condições */}
                            <p className="text-[10px] text-neutral-500 mt-2 text-center">
                                {paymentMethod === 'Pix' && "Pagamento à vista."}
                                {paymentMethod === 'Cartão' && "Parcelamento em até 12x (com acréscimo)."}
                                {paymentMethod === 'Espécie' && "Pagamento no ato do contrato."}
                            </p>
                        </div>
                    </div>

                    {/* TOTAL FINAL & AÇÃO */}
                    <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center">
                        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Valor Final do Investimento</p>
                        <div className="text-5xl font-serif text-white mb-8 flex items-baseline gap-2">
                            <AnimatedPrice value={totalPrice} />
                            <span className="text-lg text-neutral-600 font-sans">BRL</span>
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <Button 
                                onClick={onBack}
                                variant="secondary"
                                className="flex-1 md:flex-none md:w-40 border-white/10 text-neutral-400 hover:text-white"
                            >
                                Ajustar Itens
                            </Button>
                            <Button 
                                onClick={onProceedToSign}
                                size="lg" 
                                className="flex-1 md:flex-none md:w-64 shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                            >
                                <PenTool size={18} className="mr-2" />
                                Assinar Contrato
                            </Button>
                        </div>
                    </div>

                </div>

             </div>
        </motion.div>
      )}
    </div>
  );
};

export default SummaryView;
