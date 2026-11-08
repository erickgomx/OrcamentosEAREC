// ============================================================================
// EAREC AUDIOVISUAL - TELA DE CONCLUSÃO E DISPARO WHATSAPP (SuccessView.tsx)
// ============================================================================
// Olá, dev! 👋
// Esta tela representa o ápice do funil de conversão da EAREC.
//
// RECURSOS PRINCIPAIS:
// 1. Mensagem Dinâmica do WhatsApp:
//    - Monta o template completo e legível com emojis, quebras de linha e seções:
//      [AGENDA], [DADOS DO CLIENTE], [PACOTE ESCOLHIDO], [INVESTIMENTO], [FORMAS DE PAGAMENTO].
//    - Realiza escape seguro de caracteres para envio via https://api.whatsapp.com/send.
// 2. Ações Duplas de Envio:
//    - Botão direto: abre o WhatsApp com a mensagem pronta no aplicativo/web.
//    - Modal de QR Code: renderiza um QRCodeSVG com o link para o cliente escanear
//      com o celular caso esteja acessando pelo computador desktop.
// 3. Captura tardia de Nome: se o usuário navegou em modo rápido sem informar o nome,
//    um modal amigável surge antes do disparo solicitando seu nome.
// ============================================================================
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
      droneQty?: number;
      camCapHours?: number;
      mobileCapHours?: number;
      projectType?: 'personal' | 'commercial';
      priceBreakdown?: { label: string; value: number; type: string }[];
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
            const { serviceId, selectionMode, hours, photoQty, videoQty, commercialMode } = quoteDetails;
            const deviceLabel = quoteDetails.videoDevice === 'camera' ? 'Câmera' : 'Mobile';

            // 1. NOME DO PACOTE
            let pacoteLabel = quoteDetails.customOccasionText || "Serviço Selecionado";
            if (quoteDetails.occasion === 'video_production') {
                const typeLabel = quoteDetails.projectType === 'commercial' ? 'Comercial' : 'Pessoa Física';
                pacoteLabel = `Monte seu Pacote (${typeLabel})`;
            }

            // 2. ESCOPO BASE (Apenas entregáveis inclusos no pacote base)
            let escopo = "";
            if (quoteDetails.occasion === 'video_production') {
                const prodItems: string[] = [];
                if (photoQty > 0) prodItems.push(`${photoQty} Fotos Tratadas`);
                if (quoteDetails.camCapHours && quoteDetails.camCapHours > 0) prodItems.push(`${quoteDetails.camCapHours}h Gravação (Câmera)`);
                if (quoteDetails.mobileCapHours && quoteDetails.mobileCapHours > 0) prodItems.push(`${quoteDetails.mobileCapHours}h Gravação (Celular)`);
                if (quoteDetails.edit30sQty && quoteDetails.edit30sQty > 0) prodItems.push(`${quoteDetails.edit30sQty}x Edição (30s)`);
                if (quoteDetails.edit1minQty && quoteDetails.edit1minQty > 0) prodItems.push(`${quoteDetails.edit1minQty}x Edição (1 min)`);
                if (quoteDetails.droneQty && quoteDetails.droneQty > 0) prodItems.push(`${quoteDetails.droneQty} Bateria(s) de Drone`);
                
                escopo = prodItems.length > 0 ? prodItems.join(' + ') : 'Personalizado';

            } else if (serviceId === 'comm_combo') {
                escopo = `10 Fotos Tratadas + 1 Vídeo (${deviceLabel}) Incluso`;

            } else if (serviceId === 'comm_video') {
                escopo = `${photoQty} Vídeo(s) Comercial (${deviceLabel})`;

            } else if (serviceId === 'comm_photo') {
                escopo = `${photoQty} Fotos Comerciais Tratadas`;

            } else if (serviceId === 'social_video') {
                escopo = `${photoQty || 1} Vídeo(s) Social (${deviceLabel})`;

            } else if (quoteDetails.occasion === 'wedding') {
                if (serviceId === 'wedding_essence') {
                    escopo = `2h de Cobertura + 1 Vídeo ${deviceLabel} Incluso`;
                } else if (serviceId === 'wedding_base') {
                    escopo = `2h de Cobertura (Até 80 Fotos Tratadas)`;
                } else if (serviceId === 'wedding_classic') {
                    escopo = `Pré-Wedding (10 Fotos) + Cobertura (Até 80 Fotos)`;
                } else if (serviceId === 'wedding_romance') {
                    escopo = `Pré-Wedding (10 Fotos) + Making Of (10 Fotos) + Cobertura (Até 80 Fotos)`;
                } else {
                    escopo = `2h de Cobertura Base`;
                }

            } else if (quoteDetails.occasion === 'social') {
                const baseHours = serviceId === 'graduation' ? 4 : 2;
                if (selectionMode === 'duration') {
                    escopo = `${baseHours}h de Cobertura Base`;
                } else {
                    escopo = `${photoQty} Fotos Sociais Tratadas`;
                }

            } else if (serviceId === 'studio_photo') {
                if (photoQty === 7) escopo = `7 Fotos no Estúdio (Desconto R$ 150)`;
                else if (photoQty === 13) escopo = `13 Fotos no Estúdio (Promoção R$ 250)`;
                else escopo = `${photoQty} Fotos Tratadas no Estúdio`;

            } else if (serviceId === 'studio_video') {
                escopo = `2h de Gravação com Câmera no Estúdio`;

            } else if (serviceId === 'edit_only') {
                escopo = `${photoQty} Minuto(s) de Edição`;

            } else if (serviceId === 'drone') {
                escopo = `${photoQty} Bateria(s) de Voo`;

            } else if (selectionMode === 'duration') {
                escopo = `${hours}h de Cobertura Base`;

            } else {
                if (serviceId.includes('video')) {
                    escopo = `${photoQty} Vídeos Produzidos`;
                } else {
                    escopo = `${photoQty} Fotos Tratadas`;
                }
            }

            // 3. ADICIONAIS CONTRATADOS (Apenas extras reais, sem duplicar com o escopo base)
            const addonsList: string[] = [];
            if (quoteDetails.addons && quoteDetails.addons.length > 0) {
                quoteDetails.addons.forEach(addon => {
                    if (!addon) return;
                    // Para video_production, os itens de produção já compõem o escopo principal
                    if (quoteDetails.occasion === 'video_production') {
                        const isProductionItem = addon.includes('Fotos Tratadas') ||
                            addon.includes('Gravação') ||
                            addon.includes('Edição') ||
                            addon.includes('Drone') ||
                            addon.includes('Bateria');
                        if (isProductionItem) return;
                    }
                    if (!addonsList.includes(addon)) {
                        addonsList.push(addon);
                    }
                });
            }
            const addonsText = addonsList.length > 0 
                ? addonsList.join(", ") 
                : "Nenhum";

            // 4. DEFINIÇÃO DE TIPO / AMBIENTE
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

            // 5. MENSAGEM FINAL FORMATADA
            message = `✨ OLÁ! NOVA PROPOSTA GERADA (Pedido: #${finalOrderId})
Acabei de configurar meu pacote no site da EAREC. Gostaria de verificar a disponibilidade.

🗓️ AGENDA
Data: ${formatDate(clientData.date)}
Local: ${clientData.location}

👤 CLIENTE
Nome: ${finalName}

🎬 SERVIÇOS SELECIONADOS
* Pacote: ${pacoteLabel}
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
            className="bg-white/95 dark:bg-[#121212]/85 backdrop-blur-2xl border border-stone-200/90 dark:border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:shadow-2xl relative transition-colors duration-300"
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
                <h1 className="text-2xl font-serif text-stone-900 dark:text-neutral-100 mb-2">Proposta Pronta</h1>
                <p className="text-stone-600 dark:text-neutral-400 text-sm leading-relaxed mb-16 font-light">
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
                        className="w-full mt-3 block relative overflow-hidden rounded-xl group cursor-pointer bg-stone-100/80 hover:bg-stone-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-stone-200/80 dark:border-white/[0.08] transition-colors p-3"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <QrCode size={18} className="text-neutral-400 group-hover:text-white transition-colors" />
                            <span className="text-stone-700 group-hover:text-stone-950 dark:text-neutral-300 dark:group-hover:text-white text-sm font-medium transition-colors">Gerar QR Code para outro dispositivo</span>
                        </div>
                    </button>
                </div>

                {/* Botão Secundário (Novo Orçamento) */}
                <button 
                    onClick={onReset}
                    className="mt-6 text-stone-500 hover:text-stone-900 dark:text-neutral-500 dark:hover:text-white transition-colors text-xs flex items-center gap-2 py-2 px-4 rounded-full hover:bg-stone-100 dark:hover:bg-white/[0.05]"
                >
                    <RefreshCcw size={12} />
                    <span>Configurar novo pedido</span>
                </button>

            </div>

            {/* Footer do Card - Status Centralizado */}
            <div className="bg-stone-50/80 dark:bg-black/40 border-t border-stone-200/80 dark:border-white/[0.06] p-4 flex flex-col items-center justify-center gap-2 transition-colors duration-300">
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