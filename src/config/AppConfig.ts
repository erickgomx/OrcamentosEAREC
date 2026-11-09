// ============================================================================
// EAREC AUDIOVISUAL - CONFIGURAÇÃO GERAL E TABELA DE PREÇOS (AppConfig.ts)
// ============================================================================
// Olá, equipe EAREC! 👋
// Este arquivo é o repositório central de parâmetros de negócio da aplicação.
// Aqui você pode:
// 1. Atualizar o número de WhatsApp comercial da empresa.
// 2. Modificar os preços de pacotes, horas adicionais e serviços extras.
// 3. Ajustar os textos (copywriting) apresentados aos clientes.
//
// ⚠️ DICA IMPORTANTE:
// Qualquer alteração de valores nesta tabela reflete IMEDIATAMENTE nos cálculos
// automáticos da PricingEngine e na mensagem enviada ao WhatsApp do cliente!
// ============================================================================

import { ServiceCategory, ServiceId } from "../types";

/**
 * AppConfig
 * ---------
 * Singleton responsável por centralizar todas as constantes de texto, 
 * configurações de marca e tabelas de preços estáticas.
 * 
 * Objetivo: Permitir alteração de Copywriting e Preços Base sem tocar na lógica dos componentes.
 */
export class AppConfig {
  
  // === IDENTIDADE VISUAL E CONTATO (BRANDING) ===
  // Centraliza o nome comercial, número oficial para fechamento e paleta base
  static readonly BRAND = {
    NAME: "EAREC",
    WHATSAPP: "5584981048857", // Telefone no formato DDI + DDD + Número (sem símbolos)
    COLORS: {
      PRIMARY: "#DC2626", // Vermelho característico da marca EAREC (REC button)
      BACKGROUND: "#0a0a0a", // Fundo preto cinematográfico profundo
    }
  };

  // === TEXTOS DE INTERFACE E COPYWRITING ===
  // Modifique aqui as frases de impacto e descrições exibidas aos clientes
  static readonly TEXTS = {
    HERO: {
      TITLE: (name: string) => `Olá, ${name}.`,
      SUBTITLE: "Configure seu orçamento gratuitamente!",
    },
    // Apresentação humanizada para cada modalidade audiovisual
    CATEGORY_DESCRIPTIONS: {
      wedding: "Cobertura cinematográfica para eternizar o dia mais importante da sua vida.",
      social: "Registros vibrantes e emocionantes para Cultos, Batizados, 15 anos e formaturas.",
      commercial: "Valorize sua marca com fotos e vídeos profissionais de alta conversão.",
      studio: "Ambiente controlado e iluminação perfeita para ensaios e produções de alto nível.",
      video_production: "Monte o pacote ideal com fotos, vídeos e adicionais conforme sua necessidade.",
      custom: "Soluções audiovisuais sob medida para demandas específicas e projetos únicos."
    } as Record<ServiceCategory, string>,
    // Rótulos explicativos para os modos de seleção e adicionais
    LABELS: {
      DURATION_MODE: "POR TEMPO (Fotos Ilimitadas)",
      QUANTITY_MODE: "POR ENTREGA (Pack de Fotos)",
      ADD_DRONE: "Drone (1 Bateria)",
      ADD_REALTIME: "Receber material na hora",
    }
  };

  // === TABELA DE PREÇOS OFICIAL (BASE E REGRAS DE NEGÓCIO) ===
  // Todos os valores em Reais (BRL). Alterações aqui recalculam o orçamento em tempo real.
  static readonly PRICING_TABLE = {
    // --- 1. CASAMENTOS & MATRIMÔNIOS ---
    wedding: {
        wedding_base: { 
            base: 650, 
            label: "Casamento (Base)",
            composition: "Entrega de até 80 fotos",
            description: "Cobertura apenas da Cerimônia Religiosa ou Civil (Entrega de até 80 fotos)"
        },
        wedding_classic: { 
            base: 900, 
            label: "Pacote Clássico",
            composition: "Pré (10 Fotos) + Casamento (Até 80 Fotos)",
            description: "Ensaio Pré-Wedding (10 fotos) + Cobertura da Cerimônia (Até 80 fotos)" 
        },
        wedding_romance: {
            base: 1150,
            label: "Pacote Romance",
            composition: "Pré (10 Fotos) + Making Of (10 Fotos) + Cerimônia (Até 80 Fotos)",
            description: "Ensaio Pré-Wedding (10 fotos) + Making Of (10 fotos) + Cerimônia (Até 80 fotos)"
        },
        wedding_essence: { 
            base: 1750, 
            label: "Pacote Mais Essência",
            composition: "Pré (10 Fotos) + Making Of + Casamento + 1 Vídeo Incluso",
            description: "Ensaio Pré-Wedding (10 fotos) + Making Of (10 fotos) + Cobertura da Cerimônia (Até 80 fotos) + 1 Vídeo da Cerimônia Incluso (Mobile ou Câmera)." 
        },
        realtime: { fixed: 600, label: "Receber material na hora" }
    },
    // --- 2. EVENTOS SOCIAIS & CELEBRAÇÕES ---
    social: {
        birthday: { 
            base: 400, 
            hoursIncluded: 2, 
            hourPrice: 250, 
            label: "Aniversários",
            composition: "2h de Evento + Galeria Digital",
            description: "2h de cobertura no evento com foco em sorrisos e momentos espontâneos + Galeria Digital de Fotos"
        },
        social_party: { 
            base: 400, 
            hoursIncluded: 2, 
            hourPrice: 250, 
            label: "Festas",
            composition: "2h de Evento + Galeria Digital",
            description: "2h de cobertura no evento com foco em sorrisos e momentos espontâneos + Galeria Digital de Fotos"
        },
        social_event: { 
            base: 400, 
            hoursIncluded: 2, 
            hourPrice: 250, 
            label: "Eventos",
            composition: "2h de Cobertura + Galeria Digital",
            description: "2h de cobertura no evento com foco em sorrisos e momentos espontâneos + Galeria Digital de Fotos"
        },
        baptism: { 
            base: 350, 
            hoursIncluded: 2, 
            hourPrice: 250, 
            label: "Religioso",
            composition: "2h de evento (até 15 fotos)",
            description: "2h de evento (até 15 fotos cobre Fotos de todo o rito/Culto)"
        },
        fifteen: { 
            base: 650, 
            hoursIncluded: 2, 
            hourPrice: 250, 
            label: "15 Anos",
            composition: "2h de evento (até 80 fotos)",
            description: "2h de evento (até 80 fotos cobre Making-of; Recepção; Valsa e Balada com estética editorial/jovem)" 
        }, 
        graduation: { 
            base: 800, 
            hoursIncluded: 4,
            hourPrice: 250,
            label: "Formatura",
            composition: "Colação de Grau + Baile",
            description: "Colação de Grau + Baile (Cobertura exclusiva tipo sombra acompanhando o formando)" 
        },
        social_video: { 
            unitMobile: 350, 
            unitCamera: 600, 
            label: "Vídeo Social (Mobile ou Câmera)",
            composition: "Mobile (R$ 350) ou Câmera (R$ 600)",
            description: "Cobertura em vídeo para aniversários e eventos sociais. Escolha entre gravação Mobile (R$ 350) ou Câmera (R$ 600)."
        },
        video_highlight: { fixed: 350, label: "Vídeo Highlight (30s a 1min)" },
        realtime: { fixed: 600, label: "Receber material na hora" }
    },
    // --- 3. PRODUÇÃO COMERCIAL / EMPRESAS ---
    commercial: {
        comm_photo: { 
            unit: 20, 
            label: "Comércio (Apenas Fotos)",
            composition: "Fotos em Alta Resolução",
            description: "Catálogos; e-commerce; pratos e produtos em alta resolução" 
        },
        comm_video: { 
            unit: 350, 
            unitMobile: 350,
            unitCamera: 600,
            label: "Comércio (Apenas Vídeo)",
            composition: "Vídeo Mobile ou Câmera Entregue",
            description: "Vídeos verticais de impacto para Reels/TikTok. Escolha entre gravação Mobile (R$ 350) ou Câmera (R$ 600)." 
        },
        comm_combo: { 
            videoBase: 600, 
            videoBaseMobile: 600,
            videoBaseCamera: 850,
            label: "Comércio (Pacote Foto + Vídeo)",
            composition: "10 Fotos tratadas + 1 Vídeo Reel (Mobile ou Câmera)",
            description: "10 Fotos tratadas em alta resolução + 1 Vídeo Reel. Escolha entre gravação Mobile ou Câmera." 
        },
        realtime: { fixed: 600, label: "Receber material na hora" }
    },
    // --- 4. SESSÕES EM ESTÚDIO ---
    studio: {
        studio_photo: { 
            unit: 25, 
            label: "Estúdio (Fotos)",
            composition: "7 fotos: R$ 150 ou 13 fotos: R$ 250",
            description: "Fotografia profissional de estúdio (R$ 25/foto). Desconto especial: 7 fotos por R$ 150 ou 13 fotos por R$ 250." 
        },
        studio_video: { 
            base: 350, 
            hoursIncluded: 2, 
            hourPrice: 175, 
            label: "Estúdio (Vídeo com Câmera)",
            composition: "2h de gravação com câmera",
            description: "2 horas de gravação profissional com câmera no estúdio (Ideal para videocasts, cursos online ou institucionais)" 
        },
    },
    // --- 5. PRODUÇÃO AUDIOVISUAL SOB DEMANDA ---
    video_production: {
        photo_cap: { unit: 25, label: "Fotos", composition: "Alta resolução", description: "Alta resolução" },
        cam_cap: { base: 350, hoursIncluded: 2, hourPrice: 175, label: "Gravação com câmera", composition: "Valor por 2 horas", description: "Valor por 2 horas (Adicional R$175/h | R$300 p/ PJ)" },
        mobile_cap: { base: 200, hoursIncluded: 2, hourPrice: 100, label: "Gravação com celular", composition: "Valor por 2 horas", description: "Valor por 2 horas (Adicional R$100/h | R$150 p/ PJ)" },
        drone: { unit: 250, label: "Drone (Aéreo)", composition: "Por bateria (aprox. 20 min)", description: "Por bateria (aprox. 20 min de voo)" },
        edit_30s: { unit: 150, label: "Edição de Vídeo (Até 30s)", composition: "Por vídeo entregue", description: "Por vídeo entregue" },
        edit_1min: { unit: 250, label: "Edição de Vídeo (Até 1 min)", composition: "Por vídeo entregue", description: "Por vídeo entregue" },
        realtime: { fixed: 600, label: "Receber material na hora" }
    },
    // --- 6. PROJETO PERSONALIZADO SOB CONSULTA ---
    custom: {
        custom_project: { base: 0, label: "Projeto Personalizado", composition: "Sob Consulta", description: "Orçamento aberto." } 
    }
  };

  /**
   * Retorna o label amigável de um serviço baseado no ID.
   * Utilizado nos cabeçalhos de resumo e mensagens do WhatsApp.
   */
  static getServiceLabel(category: ServiceCategory, serviceId: ServiceId): string {
    const table: any = this.PRICING_TABLE;
    if (table[category] && table[category][serviceId]) {
      return table[category][serviceId].label;
    }
    return "Serviço Selecionado";
  }
}
