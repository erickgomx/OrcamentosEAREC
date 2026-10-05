import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MessageCircle, ArrowRight, RefreshCcw, Sparkles, Send, User, X, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button'; 
import { fadeInUp, staggerContainer, modalVariants } from '../lib/animations';
import { ClientData, LocationType, ServiceId, ServiceCategory } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { AppConfig } from '../config/AppConfig';

interface SuccessViewProps {
  onReset: () => void;
  clientData: ClientData;
  totalPrice: number;
  orderId?: string;
  quoteDetails?: {
      occasion: ServiceCategory;
      customOccasionText?: string;
      location: LocationType;
      distance: number;
      paymentMethod?: string;
      addons?: string[];
      // Novos campos para precisão
      serviceId: ServiceId;
      selectionMode: 'duration' | 'quantity';
      hours: number;
      photoQty: number; // Mapeado para qty genérico
      videoQty: number;
      commercialMode?: 'on_location' | 'studio'; // Novo
      videoDevice?: 'mobile' | 'camera';
      edit30sQty?: number;
      edit1minQty?: number;
  };
}

const SuccessView: React.FC<SuccessViewProps> = ({ onReset, clientData, totalPrice, quoteDetails, orderId }) => {
  const whatsappNumber = AppConfig.BRAND.WHATSAPP;
  const finalOrderId = orderId || 'EA-2026';
  
  // Estado para capturar nome caso esteja faltando
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'link' | 'qrcode'>('link');

  // Helper para formatar data
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'A definir';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // --- FUNÇÃO GERADORA DA MENSAGEM ---
  const generateWhatsappUrl = (overrideName?: string) => {
    // Usa o nome fornecido (modal) ou o original
    const finalName = overrideName || clientData.name || "Cliente";
    
    let message = "";

    if (quoteDetails) {
        const formattedPrice = formatCurrency(totalPrice).replace(/\u00A0/g, ' ');
        const addonsText = quoteDetails.addons && quoteDetails.addons.length > 0 
            ? quoteDetails.addons.join(", ") 
            : "Nenhum";

        if (quoteDetails.occasion === 'custom') {
            // TEMPLATE: PROJETO PERSONALIZADO (Mantido simplificado, mas no novo estilo)
            message = `✨ OLÁ! NOVA CONSULTORIA
Gostaria de discutir um projeto personalizado com a EAREC.

🗓️ AGENDA
Data: ${formatDate(clientData.date)}
Local: ${clientData.location}

👤 CLIENTE
Nome: ${finalName}

💡 DEMANDA ESPECÍFICA
Tenho um projeto único e preciso de orçamento sob medida.

📍 LOGÍSTICA PRELIMINAR
* Distância: ${quoteDetails.distance}km
* Frete: A calcular

--------------------------------
Podemos agendar uma conversa?`;

        } else {
            // TEMPLATE: ORÇAMENTO PADRÃO (NOVO PADRÃO SOLICITADO)
            let escopo = "";
            const { serviceId, selectionMode, hours, photoQty, videoQty, commercialMode } = quoteDetails;
            
            // LÓGICA DE ESCOPO PRECISA
            if (serviceId === 'comm_combo') {
                const deviceLabel = quoteDetails.videoDevice === 'camera' ? 'Câmera' : 'Mobile';
                escopo = `Pacote (10 Fotos + 1 Vídeo ${deviceLabel})`;
                const extraPhotos = photoQty - 10;
                const extraVideos = videoQty - 1;
                
                // Formatação clean para extras dentro do escopo
                if (extraPhotos > 0) escopo += ` + ${extraPhotos} Fotos Extras`;
                if (extraVideos > 0) escopo += ` + ${extraVideos} Vídeos Extras (${deviceLabel})`;
            
            } else if (serviceId === 'comm_video') {
                const deviceLabel = quoteDetails.videoDevice === 'camera' ? 'Câmera' : 'Mobile';
                escopo = `${photoQty} Vídeo(s) Comercial (${deviceLabel})`;

            } else if (serviceId === 'social_video') {
                const deviceLabel = quoteDetails.videoDevice === 'camera' ? 'Câmera' : 'Mobile';
                escopo = `${videoQty || photoQty || 1} Vídeo(s) Social (${deviceLabel})`;

            } else if (quoteDetails.occasion === 'wedding') {
                const deviceLabel = quoteDetails.videoDevice === 'camera' ? 'Câmera' : 'Mobile';
                escopo = quoteDetails.serviceName || `${hours}h de Cobertura de Casamento`;
                if (videoQty && videoQty > 0) {
                    escopo += ` + ${videoQty} Vídeo(s) (${deviceLabel})`;
                }

            } else if (quoteDetails.occasion === 'social') {
                const deviceLabel = quoteDetails.videoDevice === 'camera' ? 'Câmera' : 'Mobile';
                if (selectionMode === 'duration') {
                    escopo = `${hours}h de Cobertura Social`;
                } else {
                    escopo = `${photoQty} Fotos Sociais (Mínimo 8)`;
                }
                if (videoQty && videoQty > 0) {
                    escopo += ` + ${videoQty} Vídeo(s) (${deviceLabel})`;
                }

            } else if (serviceId === 'studio_photo') {
                if (photoQty === 7) escopo = `7 Fotos no Estúdio (Desconto R$ 150)`;
                else if (photoQty === 13) escopo = `13 Fotos no Estúdio (Promoção R$ 250)`;
                else escopo = `${photoQty} Fotos no Estúdio (R$ 25/cada)`;

            } else if (serviceId === 'studio_video') {
                escopo = `${hours}h de Gravação com Câmera no Estúdio`;
                const edits = [];
                if (quoteDetails.edit30sQty && quoteDetails.edit30sQty > 0) {
                    edits.push(`${quoteDetails.edit30sQty}x Edição (30s)`);
                }
                if (quoteDetails.edit1minQty && quoteDetails.edit1minQty > 0) {
                    edits.push(`${quoteDetails.edit1minQty}x Edição (1 min)`);
                }
                if (edits.length > 0) {
                    escopo += ` + ${edits.join(' + ')}`;
                }

            } else if (serviceId === 'edit_only') {
                escopo = `${photoQty} Minuto(s) de Edição`;
            
            } else if (serviceId === 'drone') {
                 escopo = `${photoQty} Bateria(s) de Voo`;

            } else if (selectionMode === 'duration') {
                escopo = `${hours} Horas de Cobertura`;
            
            } else {
                // Modo Quantidade Genérico
                if (serviceId.includes('video')) {
                    escopo = `${photoQty} Vídeos Produzidos`;
                } else {
                    escopo = `${photoQty} Fotos Tratadas`;
                }
            }

            // Definição do Tipo/Ambiente
            let tipoAmbiente = "Locação Externa";
            let freightStatus = "Calculado";

            if (quoteDetails.location === 'studio') {
                tipoAmbiente = "Estúdio Controlado";
                freightStatus = "Isento (Estúdio)";
            } else if (quoteDetails.occasion === 'commercial' && commercialMode === 'studio') {
                tipoAmbiente = "Estúdio Controlado";
                freightStatus = "Isento (Estúdio)";
            } else if (serviceId === 'edit_only') {
                tipoAmbiente = "Pós-Produção / Remoto";
                freightStatus = "Isento (Online)";
            } else if (quoteDetails.distance === 0 && freightStatus !== "Isento (Estúdio)") {
                freightStatus = "A consultar";
            }

            // MENSAGEM FINAL FORMATADA
            message = `✨ OLÁ! NOVA PROPOSTA GERADA (Pedido: #${finalOrderId})
Acabei de configurar meu pacote no site da EAREC. Gostaria de verificar a disponibilidade.

🗓️ AGENDA
Data: ${formatDate(clientData.date)}
Local: ${clientData.location}

👤 CLIENTE
Nome: ${finalName}

🎬 SERVIÇOS SELECIONADOS
* Pacote: ${quoteDetails.customOccasionText}
* Tipo: ${tipoAmbiente}
* Escopo: ${escopo}
* Adicionais: ${addonsText}

📍 LOGÍSTICA & VALORES
* Distância: ${quoteDetails.distance}km
* Frete: ${freightStatus}
* Pagamento: ${quoteDetails.paymentMethod || "A definir"}

💎 APROVEI O ORÇAMENTO:
Total: ${formattedPrice}

--------------------------------
Poderiam confirmar a reserva desta data?`;
        }
    }
    
    return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
  };

  // Handler de Clique na Ação (Link ou QR Code)
  const handleActionClick = (action: 'link' | 'qrcode', e: React.MouseEvent) => {
    e.preventDefault(); // Impede o link padrão
    setPendingAction(action);
    
    // Se não tiver nome, abre modal
    if (!clientData.name || clientData.name.trim() === '') {
        setIsNameModalOpen(true);
    } else {
        // Se tiver nome, processa a ação direto
        if (action === 'qrcode') {
            setIsQrModalOpen(true);
        } else {
            window.open(generateWhatsappUrl(), '_blank');
        }
    }
  };

  // Handler de Confirmação do Modal
  const handleConfirmName = () => {
      if (tempName.trim().length < 2) return;
      
      setIsNameModalOpen(false);
      if (pendingAction === 'qrcode') {
          setIsQrModalOpen(true);
      } else {
          window.open(generateWhatsappUrl(tempName), '_blank');
      }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-6">
      
      {/* Background Cinematico (Transparente para mostrar FilmStrips) */}
      {/* O fundo sólido (bg-neutral-950) foi removido. */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradiente sutil para garantir leitura, mas permitindo ver o fundo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/40 via-black/80 to-black/95" />
        
        {/* Luz de fundo sutil para atmosfera */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-DEFAULT/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <motion.div 
        variants={staggerContainer} 
        initial="hidden" 
        animate="visible" 
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo Header - AUMENTADA & REPOSICIONADA PARA BAIXO */}
        <motion.div variants={fadeInUp} className="flex justify-center mb-10 mt-12 opacity-90">
          <Logo className="w-48 md:w-64" />
        </motion.div>

        {/* Card Principal - Estilo Ticket/Pass */}
        <motion.div 
            variants={fadeInUp}
            className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
        >
            {/* Faixa decorativa superior */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
            
            <div className="p-8 flex flex-col items-center text-center">
                
                {/* Ícone de Sucesso */}
                <div className="mb-6 relative">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    >
                        <Check className="text-emerald-500" size={32} strokeWidth={3} />
                    </motion.div>
                    
                    {/* Estrela / Brilho Animado (Refinado: Ciclo único suave e some) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0, rotate: 0 }}
                        animate={{ 
                            scale: [0, 1.3, 0],       // Cresce e depois some
                            opacity: [0, 1, 0],       // Aparece e depois some
                            rotate: [0, 45, 90]       // Gira suavemente
                        }}
                        transition={{ 
                            duration: 1.8,            // Duração completa do ciclo
                            ease: "easeInOut",
                            delay: 0.5,               // Pequeno delay após o check aparecer
                            repeat: 0                 // Executa apenas uma vez
                        }}
                        className="absolute -top-5 -right-5 text-emerald-300 pointer-events-none"
                    >
                        <Sparkles size={28} className="fill-emerald-300/20" />
                    </motion.div>
                </div>

                {/* Textos */}
                <h1 className="text-2xl font-serif text-white mb-2">Proposta Pronta</h1>
                <p className="text-neutral-400 text-sm leading-relaxed mb-16 font-light">
                    Sua configuração foi salva com sucesso. <br/>
                    Para confirmar a reserva da data, envie o resumo gerado para nossa equipe.
                </p>

                {/* Botão WhatsApp (HERO) com Animação de Incentivo */}
                <div className="w-full relative group">
                    
                    {/* Tooltip Flutuante "Clique Aqui" */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute -top-10 left-0 right-0 flex justify-center pointer-events-none z-20"
                    >
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="bg-emerald-500/20 text-emerald-400 text-[9px] uppercase font-bold tracking-widest py-1.5 px-3 rounded-full border border-emerald-500/30 backdrop-blur-md shadow-lg flex items-center gap-2"
                        >
                            <span>Clique para Confirmar</span>
                            <Send size={10} className="fill-emerald-400" />
                        </motion.div>
                        {/* Triângulo do Tooltip */}
                        <motion.div 
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[-4px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-emerald-500/30"
                        />
                    </motion.div>

                    <motion.button 
                        onClick={(e) => handleActionClick('link', e)}
                        className="w-full block relative overflow-hidden rounded-xl group cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{ 
                            boxShadow: ["0 0 0 rgba(16, 185, 129, 0)", "0 0 25px rgba(16, 185, 129, 0.2)", "0 0 0 rgba(16, 185, 129, 0)"] 
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white p-4 flex items-center justify-center gap-3 shadow-lg border border-emerald-400/20 transition-all z-10">
                            <MessageCircle size={22} fill="currentColor" className="text-white/90" />
                            <span className="font-bold tracking-wide text-sm">ENVIAR E FINALIZAR</span>
                            <ArrowRight size={16} className="text-white/70 group-hover:translate-x-1 transition-transform" />
                        </div>

                        {/* Efeito Shimmer Sutil (Brilho Passando) */}
                        <motion.div
                            className="absolute inset-0 z-20 pointer-events-none"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 2.5, 
                                ease: "easeInOut",
                                repeatDelay: 2 // Pausa entre os brilhos para ficar mais elegante
                            }}
                        >
                            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                        </motion.div>
                    </motion.button>
                    
                    <button 
                        onClick={(e) => handleActionClick('qrcode', e)}
                        className="w-full mt-3 block relative overflow-hidden rounded-xl group cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 transition-colors p-3"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <QrCode size={18} className="text-neutral-400 group-hover:text-white transition-colors" />
                            <span className="text-neutral-300 group-hover:text-white text-sm font-medium transition-colors">Gerar QR Code para outro dispositivo</span>
                        </div>
                    </button>
                </div>

                {/* Botão Secundário (Novo Orçamento) */}
                <button 
                    onClick={onReset}
                    className="mt-6 text-neutral-500 hover:text-white transition-colors text-xs flex items-center gap-2 py-2 px-4 rounded-full hover:bg-white/5"
                >
                    <RefreshCcw size={12} />
                    <span>Configurar novo pedido</span>
                </button>

            </div>

            {/* Footer do Card - Status Centralizado */}
            <div className="bg-black/40 border-t border-white/5 p-4 flex flex-col items-center justify-center gap-2">
                 <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">Aguardando Envio</span>
                 </div>
                 <span className="text-[11px] text-neutral-400 font-mono font-medium tracking-wider">Pedido: #{finalOrderId}</span>
            </div>
        </motion.div>

        <p className="mt-8 text-center text-[10px] text-neutral-600 uppercase tracking-[0.2em]">
            EAREC Audiovisual
        </p>

        {/* MODAL QR CODE */}
        <AnimatePresence>
            {isQrModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
                        onClick={() => setIsQrModalOpen(false)}
                    />
                    <motion.div 
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm relative z-10 shadow-2xl flex flex-col items-center"
                    >
                        <button 
                            onClick={() => setIsQrModalOpen(false)}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-all"
                        >
                            <X size={16} />
                        </button>
                        
                        <div className="w-16 h-16 bg-brand-DEFAULT/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-brand-DEFAULT/20">
                             <QrCode size={32} className="text-brand-DEFAULT" />
                        </div>

                        <h3 className="text-2xl font-serif text-white mb-2 text-center">Escaneie para Enviar</h3>
                        <p className="text-neutral-400 text-sm mb-8 text-center leading-relaxed">
                            Abra a câmera do seu celular e aponte para o código abaixo para enviar a mensagem via WhatsApp.
                        </p>

                        <div className="bg-white p-4 rounded-2xl mb-2">
                            <QRCodeSVG 
                                value={generateWhatsappUrl(clientData.name || tempName)} 
                                size={200}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"H"}
                                includeMargin={false}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* MODAL DE CAPTURA DE NOME (FIM DO FLUXO) */}
        <AnimatePresence>
            {isNameModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md"
                        onClick={() => setIsNameModalOpen(false)}
                    />
                    
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative z-10 w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
                    >
                         <button 
                            onClick={() => setIsNameModalOpen(false)}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                         >
                            <X size={20} />
                         </button>

                         <div className="flex flex-col items-center text-center mb-6">
                             <div className="p-3 bg-brand-DEFAULT/10 rounded-full text-brand-DEFAULT mb-4">
                                 <User size={24} />
                             </div>
                             <h3 className="text-xl text-white font-serif mb-2">Identifique-se</h3>
                             <p className="text-neutral-400 text-xs leading-relaxed">
                                 Para finalizar e enviar a mensagem no WhatsApp, precisamos saber seu nome.
                             </p>
                         </div>

                         <div className="space-y-4">
                            <input 
                                type="text"
                                placeholder="Digite seu nome..."
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                autoFocus
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-DEFAULT outline-none transition-colors"
                                onKeyDown={(e) => e.key === 'Enter' && handleConfirmName()}
                            />
                            
                            <Button 
                                onClick={handleConfirmName} 
                                disabled={tempName.trim().length < 2}
                                className="w-full"
                            >
                                Continuar para WhatsApp
                            </Button>
                         </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default SuccessView;