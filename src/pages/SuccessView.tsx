
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MessageCircle, ArrowRight, RefreshCcw, Sparkles, Send, User, X } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button'; // Importando Button
import { fadeInUp, staggerContainer, modalVariants } from '../lib/animations';
import { ClientData, OccasionType, LocationType } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { AppConfig } from '../config/AppConfig';

interface SuccessViewProps {
  onReset: () => void;
  clientData: ClientData;
  totalPrice: number;
  quoteDetails?: {
      occasion: OccasionType;
      customOccasionText?: string;
      location: LocationType;
      photoQty: number;
      videoQty: number;
      distance: number;
      paymentMethod?: string;
      addons?: string[];
  };
}

const SuccessView: React.FC<SuccessViewProps> = ({ onReset, clientData, totalPrice, quoteDetails }) => {
  const whatsappNumber = AppConfig.BRAND.WHATSAPP;
  
  // Estado para capturar nome caso esteja faltando
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');

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
            // TEMPLATE: PROJETO PERSONALIZADO
            message = `🚀 *SOLICITAÇÃO DE PROJETO EXCLUSIVO*
Olá, equipe EAREC!

Gostaria de uma consultoria para um projeto personalizado. Seguem os detalhes iniciais:

👤 *MEUS DADOS*
*Cliente:* ${finalName}
*Local:* ${clientData.location}
*Data Prevista:* ${formatDate(clientData.date)}

💡 *MINHA DEMANDA*
Tenho um projeto específico (Briefing a discutir com a equipe criativa).

📍 *LOGÍSTICA PRELIMINAR*
*Distância:* ${quoteDetails.distance}km (Ref. Goianinha)

*Aguardo o retorno para alinharmos os detalhes!*`;

        } else {
            // TEMPLATE: ORÇAMENTO PADRÃO (PREMIUM)
            let escopo = "";
            const ambiente = quoteDetails.location === 'studio' ? "Estúdio Controlado" : "Externo / In Loco";
            
            if (quoteDetails.photoQty > 0 && quoteDetails.videoQty > 0) {
                escopo = `${quoteDetails.photoQty} Fotos + ${quoteDetails.videoQty} Vídeo(s)`;
            } else if (quoteDetails.photoQty > 0) {
                escopo = `${quoteDetails.photoQty} Fotos`;
            } else if (quoteDetails.videoQty > 0) {
                escopo = `${quoteDetails.videoQty} Vídeo(s)`;
            } else {
                escopo = "Cobertura por Hora/Diária";
            }

            message = `✨ *OLÁ! NOVA PROPOSTA GERADA*
Acabei de configurar meu pacote no site da EAREC. Gostaria de verificar a disponibilidade.

🗓️ *AGENDA*
*Data:* ${formatDate(clientData.date)}
*Local:* ${clientData.location}

👤 *CLIENTE*
*Nome:* ${finalName}

🎬 *O QUE ESCOLHI*
• *Pacote:* ${quoteDetails.customOccasionText}
• *Tipo:* ${ambiente}
• *Escopo:* ${escopo}
• *Adicionais:* ${addonsText}

📍 *LOGÍSTICA & VALORES*
• *Distância:* ${quoteDetails.distance}km
• *Frete:* ${quoteDetails.location === 'studio' ? "Isento (Estúdio)" : "Calculado no total"}
• *Pagamento:* ${quoteDetails.paymentMethod || "A combinar"}

💎 *INVESTIMENTO ESTIMADO*
*Total: ${formattedPrice}*

--------------------------------
*Poderiam confirmar a reserva desta data?*`;
        }
    }
    
    return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
  };

  // Handler de Clique no Botão
  const handleSendClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede o link padrão
    
    // Se não tiver nome, abre modal
    if (!clientData.name || clientData.name.trim() === '') {
        setIsNameModalOpen(true);
    } else {
        // Se tiver nome, abre direto
        window.open(generateWhatsappUrl(), '_blank');
    }
  };

  // Handler de Confirmação do Modal
  const handleConfirmName = () => {
      if (tempName.trim().length < 2) return;
      
      setIsNameModalOpen(false);
      // Abre o WhatsApp com o nome recém digitado
      window.open(generateWhatsappUrl(tempName), '_blank');
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-6">
      
      {/* Background Cinematico */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-80" />
        {/* Luz de fundo sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-DEFAULT/5 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <motion.div 
        variants={staggerContainer} 
        initial="hidden" 
        animate="visible" 
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo Header - AUMENTADA */}
        <motion.div variants={fadeInUp} className="flex justify-center mb-12 opacity-90">
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
                        onClick={handleSendClick}
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
                 <span className="text-[9px] text-neutral-700 font-mono">ID: {new Date().getTime().toString().slice(-4)}</span>
            </div>
        </motion.div>

        <p className="mt-8 text-center text-[10px] text-neutral-600 uppercase tracking-[0.2em]">
            EAREC Audiovisual
        </p>

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
