// ============================================================================
// EAREC AUDIOVISUAL - DADOS MOCK INICIAIS E ESTRUTURA PADRÃO (mock.ts)
// ============================================================================
// Olá, dev! 👋
// Este arquivo fornece o template inicial de orçamento antes de o usuário
// começar a interagir ou caso ele entre direto em uma rota sem parâmetros.
// 
// Aqui você encontra:
// 1. Geração de código de proposta legível (ex: EA-4921)
// 2. Valores de contingência de preço base e por km
// 3. Diferenciais de produção inclusos em qualquer pacote
// 4. Imagens oficiais do portfólio para a galeria / moodboard
// ============================================================================

import { QuoteData } from '../types';
import { generateOrderCode } from '../lib/utils';

/**
 * ARQUIVO DE DADOS (MOCK)
 * -----------------------
 * Este arquivo funciona como um "Banco de Dados Local".
 * É aqui que definimos os valores padrão, preços unitários e itens inclusos.
 * 
 * DICA: Altere os valores abaixo para ajustar a precificação do negócio sem mexer na lógica.
 */

export const mockQuote: QuoteData = {
  // ID exclusivo do orçamento (gerado aleatoriamente e amigável para leitura, ex: EA-7842)
  id: generateOrderCode(),
  
  // Dados padrão do cliente (estes dados são apenas placeholders, 
  // pois serão substituídos pelo que o usuário digitar na WelcomeView)
  client: {
    name: "Cliente VIP",
    company: "Empresa Parceira",
    projectTitle: "Projeto Audiovisual",
    location: "São Paulo, SP",
    date: new Date().toISOString(),
    contact: "(11) 99999-9999"
  },
  
  // Definição de datas de validade da proposta (Ex: válida por 7 dias a partir da criação)
  date: new Date().toISOString(),
  validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  
  // ========================================================================
  // 💰 PRECIFICAÇÃO (REGRA DE NEGÓCIO)
  // ========================================================================
  
  basePrice: 200,        // Preço Mínimo
  studioFee: 250,        // Taxa de Estúdio
  photoUnitPrice: 25,    // Valor Unitário: Preço por cada foto
  videoUnitPrice: 600,   // Valor Unitário: Preço por cada vídeo (1 min)
  pricePerKm: 3,      // Logística: Valor alterado para R$ 3/km (ida e volta)
  
  // ========================================================================

  // Lista de itens descritivos que compõem o serviço.
  // Usamos isso para mostrar valor agregado ao cliente ("O que está incluso?").
  items: [
    {
      id: "1",
      title: "Direção Criativa & Roteiro",
      description: "Desenvolvimento completo do conceito, storyboard e narrativa visual.",
      price: 0,
      isIncluded: true, // Item cortesia/incluso
      type: 'fixed'
    },
    {
      id: "2",
      title: "Equipe de Cinema",
      description: "Diretor, DoP e Assistentes dedicados durante a diária.",
      price: 0,
      isIncluded: true,
      type: 'fixed'
    },
    {
      id: "3",
      title: "Color Grading (DaVinci)",
      description: "Tratamento de cor cinematográfico incluso em todos os entregáveis.",
      price: 0,
      isIncluded: true,
      type: 'fixed'
    }
  ],

  // URLs das imagens que aparecem no Moodboard (Galeria)
  // Substitua essas URLs por imagens do portfólio real da EAREC.
  moodboardImages: [
    "https://i.ibb.co/7dDRV17v/img1.jpg",
    "https://i.ibb.co/Y7J8K2fn/img2.jpg",
    "https://i.ibb.co/23WfxFKV/img3.jpg",
    "https://i.ibb.co/CKXCryZP/img4.jpg",
    "https://i.ibb.co/39yvQZQJ/img5.jpg",
    "https://i.ibb.co/Q7HvYT46/img6.jpg",
  ]
};
