
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MessageCircle } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { fadeInUp, staggerContainer } from '../lib/animations';
import { ClientData, OccasionType, LocationType } from '../types';
import { formatCurrency } from '../lib/utils';

// Interface atualizada para receber os detalhes do orçamento
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
  };
}

/**
 * SuccessView
 * -----------
 * Tela final exibida após a assinatura do contrato.
 * Confirma o envio e fornece um call-to-action para contato via WhatsApp.
 */
const SuccessView: React.FC<SuccessViewProps> = ({ onReset, clientData, totalPrice, quoteDetails }) => {

  // Mapas para tradução
  const occasionMap: Record<string, string> = {
      'institutional': 'Institucional (Corporativo)',
      'advertising': 'Publicidade (Comercial)',
      'social': 'Social (Eventos)',
      'custom': 'Outro'
  };

  const locationMap: Record<string, string> = {
      'external': 'Locação Externa',
      'studio': 'Estúdio Controlado'
  };

  // Criação da mensagem detalhada do WhatsApp
  const whatsappNumber = "5584981048857";
  
  let detailsText = "";
  if (quoteDetails) {
      const occasionText = quoteDetails.occasion === 'custom' && quoteDetails.customOccasionText 
          ? `Personalizado (${quoteDetails.customOccasionText})` 
          : occasionMap[quoteDetails.occasion];
      
      detailsText = `
*RESUMO DO PEDIDO:*
🎬 *Ocasião:* ${occasionText}
📍 *Ambiente:* ${locationMap[quoteDetails.location]}
📸 *Fotos:* ${quoteDetails.photoQty} unidades
🎥 *Vídeos:* ${quoteDetails.videoQty} vídeos
🚗 *Distância Estimada:* ${quoteDetails.distance}km (Ida)
`;
  }

  const message = `
Olá time EAREC! 👋
Sou *${clientData.name}* de *${clientData.location}*.
Acabei de aprovar uma proposta no sistema.

${detailsText}
💰 *VALOR TOTAL APROVADO:* ${formatCurrency(totalPrice)}

Aguardo os próximos passos para o contrato!
`.trim();

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-neutral-950 relative overflow-hidden px-6">
      
      {/* Background Decorativo e Gradientes */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black z-0" />
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-brand-DEFAULT/10 to-transparent pointer-events-none" />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Logo EAREC - Reduzida */}
        <motion.div variants={fadeInUp} className="flex justify-center mb-8">
          <Logo className="w-40" />
        </motion.div>

        {/* Ícone de Sucesso Animado - Reduzido */}
        <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                <CheckCircle className="text-green-500 relative z-10" size={50} />
            </div>
        </motion.div>

        {/* Texto Compactado */}
        <motion.h1 variants={fadeInUp} className="text-2xl md:text-3xl font-serif text-white mb-4">
            Proposta Recebida
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-neutral-400 text-sm md:text-base mb-8 leading-relaxed px-4">
            Obrigado, <span className="text-white font-medium">{clientData.name}</span>. Nosso time comercial foi notificado e entrará em contato.
        </motion.p>

        {/* Card de Status do Pedido - Compacto */}
        <motion.div 
            variants={fadeInUp}
            className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8 flex items-center justify-between mx-4"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500">
                    <Clock size={18} />
                </div>
                <div className="text-left">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Status</p>
                    <p className="text-white text-sm font-medium">Processando Pedido</p>
                </div>
            </div>
            {/* Bolinha pulsante */}
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
        </motion.div>

        {/* Botões de Ação */}
        <motion.div variants={fadeInUp} className="space-y-3 px-4">
            {/* Botão Principal: WhatsApp */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button variant="primary" size="md" className="w-full flex items-center gap-2 justify-center bg-green-600 border-green-600 hover:bg-green-700 shadow-green-900/20 py-3 text-sm">
                    <MessageCircle size={18} />
                    Falar agora com o Time
                </Button>
            </a>

            {/* Botão Secundário: Reiniciar */}
            <Button onClick={onReset} size="md" variant="secondary" className="w-full py-3 text-sm">
                Voltar ao Início
            </Button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default SuccessView;
