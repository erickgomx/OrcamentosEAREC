
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
  
  // === BRANDING ===
  static readonly BRAND = {
    NAME: "EAREC",
    WHATSAPP: "5584981048857",
    INSTAGRAM_URL: "https://www.instagram.com/earecmidia/",
    COLORS: {
      PRIMARY: "#DC2626",
      BACKGROUND: "#0a0a0a",
    }
  };

  // === SHOWREEL & VÍDEO DE APRESENTAÇÃO ===
  static readonly SHOWREEL = {
    // 💡 DICA: Para usar um arquivo local, salve seu vídeo na pasta 'public/showreel.mp4'
    // e defina VIDEO_URL: '/showreel.mp4'. Ou informe a URL direta de um MP4 hospedado (Vercel Blob, CDN, etc).
    VIDEO_URL: "/showreel.mp4",
    FALLBACK_URL: "/showreel.mp4",
    POSTER_URL: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80",
    TITLE: "EAREC Showreel",
    TAGLINE: "Histórias que emocionam. Imagens que marcam.",
    SUBTITLE: "Produção de filmes comerciais, casamentos memoráveis e coberturas audiovisuais de alto padrão."
  };

  // === TEXTOS DE UI (COPYWRITING) ===
  static readonly TEXTS = {
    HERO: {
      TITLE: (name: string) => `Olá, ${name}.`,
      SUBTITLE: "Configure seu orçamento gratuitamente!",
    },
    CATEGORY_DESCRIPTIONS: {
      wedding: "Cobertura cinematográfica para eternizar o dia mais importante da sua vida.",
      social: "Registros vibrantes e emocionantes para Cultos, Batizados, 15 anos e formaturas.",
      commercial: "Valorize sua marca com fotos e vídeos profissionais de alta conversão.",
      studio: "Ambiente controlado e iluminação perfeita para ensaios e produções de alto nível.",
      video_production: "Monte o pacote ideal com fotos, vídeos e adicionais conforme sua necessidade.",
      custom: "Soluções audiovisuais sob medida para demandas específicas e projetos únicos."
    } as Record<ServiceCategory, string>,
    LABELS: {
      DURATION_MODE: "POR TEMPO (Fotos Ilimitadas)",
      QUANTITY_MODE: "POR ENTREGA (Pack de Fotos)",
      ADD_DRONE: "Drone (1 Bateria)",
      ADD_REALTIME: "Receber material na hora",
    }
  };

  // === TABELA DE PREÇOS (BASE) ===
  static readonly PRICING_TABLE = {
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
            composition: "Pré (10 Fotos) + Making Of + Casamento (Até 80 Fotos) + Vídeo",
            description: "Pré-Wedding (10 fotos) + Making Of (10 fotos)+ Casamento (Até 80 fotos) + Vídeo Highlight (Melhores Momentos)" 
        },
        realtime: { fixed: 600, label: "Receber material na hora" }
    },
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
        video_highlight: { fixed: 350, label: "Vídeo Highlight (30s a 1min)" },
        realtime: { fixed: 600, label: "Receber material na hora" }
    },
    commercial: {
        comm_photo: { 
            unit: 20, 
            label: "Comércio (Apenas Fotos)",
            composition: "Fotos em Alta Resolução",
            description: "Catálogos; e-commerce; pratos e produtos em alta resolução" 
        },
        comm_video: { 
            unit: 500, 
            label: "Comércio (Apenas Vídeo)",
            composition: "Vídeos Verticais (Reels/TikTok)",
            description: "Vídeos verticais de impacto para Reels/TikTok (edição ágil; transições e música)" 
        },
        comm_combo: { 
            videoBase: 600, 
            label: "Combo (Foto + Vídeo)",
            composition: "10 Fotos tratadas + 1 Vídeo Reel",
            description: "10 Fotos tratadas + 1 Vídeo Reel editado" 
        },
        realtime: { fixed: 600, label: "Receber material na hora" }
    },
    studio: {
        studio_photo: { 
            unit: 25, 
            label: "Estúdio (Fotos)",
            composition: "Retratos e produtos",
            description: "Retratos corporativos; ensaios de moda ou fotografia de produtos" 
        },
        studio_video: { 
            base: 350, 
            hoursIncluded: 2, 
            hourPrice: 175, 
            label: "Estúdio (Vídeo)",
            composition: "2 horas de gravação",
            description: "2 horas de gravação (Ideal para videocasts; cursos online ou institucionais)" 
        },
    },
    video_production: {
        photo_cap: { unit: 25, label: "Fotos", composition: "Alta resolução", description: "Alta resolução" },
        cam_cap: { base: 350, hoursIncluded: 2, hourPrice: 175, label: "Gravação com câmera", composition: "Valor por 2 horas", description: "Valor por 2 horas (Adicional R$175/h | R$300 p/ PJ)" },
        mobile_cap: { base: 200, hoursIncluded: 2, hourPrice: 100, label: "Gravação com celular", composition: "Valor por 2 horas", description: "Valor por 2 horas (Adicional R$100/h | R$150 p/ PJ)" },
        drone: { unit: 250, label: "Drone (Aéreo)", composition: "Por bateria (aprox. 20 min)", description: "Por bateria (aprox. 20 min de voo)" },
        edit_30s: { unit: 150, label: "Edição de Vídeo (Até 30s)", composition: "Por vídeo entregue", description: "Por vídeo entregue" },
        edit_1min: { unit: 250, label: "Edição de Vídeo (Até 1 min)", composition: "Por vídeo entregue", description: "Por vídeo entregue" },
        realtime: { fixed: 600, label: "Receber material na hora" }
    },
    custom: {
        custom_project: { base: 0, label: "Projeto Personalizado", composition: "Sob Consulta", description: "Orçamento aberto." } 
    }
  };

  /**
   * Retorna o label amigável de um serviço baseado no ID.
   */
  static getServiceLabel(category: ServiceCategory, serviceId: ServiceId): string {
    const table: any = this.PRICING_TABLE;
    if (table[category] && table[category][serviceId]) {
      return table[category][serviceId].label;
    }
    return "Serviço Selecionado";
  }
}
