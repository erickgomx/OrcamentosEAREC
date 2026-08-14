
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
    COLORS: {
      PRIMARY: "#DC2626",
      BACKGROUND: "#0a0a0a",
    }
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
            composition: "Cerimônia (Até 80 Fotos)",
            description: "Cobertura focada exclusivamente na Cerimônia Religiosa ou Civil. Inclui registros detalhados da decoração e entrega de até 80 fotos tratadas."
        },
        wedding_classic: { 
            base: 900, 
            label: "Pacote Clássico",
            composition: "Pré (10 Fotos) + Casamento (Até 80 Fotos)",
            description: "A união de dois momentos especiais. Inclui um ensaio Pré Wedding (entrega de 10 fotos tratadas) e a cobertura da Cerimônia com até 80 fotos." 
        },
        wedding_romance: {
            base: 1150,
            label: "Pacote Romance",
            composition: "Pré (10 Fotos) + Making Of + Cerimônia (Até 80 Fotos)",
            description: "Cobertura expandida. Inclui o Ensaio Pré Wedding (10 fotos tratadas), o Making Of dos noivos e a Cerimônia com entrega de até 80 fotos."
        },
        wedding_essence: { 
            base: 1750, 
            label: "Pacote Mais Essência",
            composition: "Pré (10 Fotos) + Casamento (Até 80 Fotos) + Vídeo",
            description: "A experiência completa. Pré Wedding (10 fotos tratadas), Making Of, Casamento (Até 80 Fotos) e um Vídeo Highlight cinematográfico dos melhores momentos." 
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
            description: "Cobertura dinâmica para registrar a alegria, a decoração e os momentos espontâneos da festa. Focamos em capturar sorrisos verdadeiros e a interação entre os convidados."
        },
        social_party: { 
            base: 400, 
            hoursIncluded: 2, 
            hourPrice: 250, 
            label: "Festas",
            composition: "2h de Evento + Galeria Digital",
            description: "Cobertura vibrante para festas e celebrações. Registramos a atmosfera, os convidados e a diversão com olhar atento e edição premium."
        },
        social_event: { 
            base: 400, 
            hoursIncluded: 2, 
            hourPrice: 250, 
            label: "Eventos",
            composition: "2h de Cobertura + Galeria Digital",
            description: "Cobertura profissional para eventos sociais diversos. Foco nos detalhes, na ambientação e nos momentos chave da ocasião."
        },
        baptism: { 
            base: 500, 
            hoursIncluded: 2, 
            hourPrice: 250, 
            label: "Religioso",
            composition: "Fotos + Vídeo (Melhores Momentos)",
            description: "Cobertura completa para Cultos, Batizados e celebrações religiosas. Inclui fotos de todo o rito e um vídeo highlight emocionante com os melhores momentos."
        },
        fifteen: { 
            base: 450, 
            hoursIncluded: 2, 
            hourPrice: 250, 
            label: "15 Anos",
            composition: "Making-of + Recepção + Valsa",
            description: "Tratamento de imagem estilo editorial para debutantes. Cobrimos os detalhes do vestido, a maquiagem, a valsa e a balada com uma estética jovem e moderna." 
        }, 
        graduation: { 
            base: 800, 
            label: "Formatura",
            composition: "Colação de Grau + Baile",
            description: "Cobertura exclusiva com foco total no formando. Diferente da cobertura da turma, nós somos sua sombra, garantindo fotos com a família, amigos e todos os momentos da sua conquista." 
        },
        realtime: { fixed: 600, label: "Receber material na hora" }
    },
    commercial: {
        comm_photo: { 
            unit: 20, 
            label: "Comércio (Fotos)",
            composition: "Pack de Fotos em Alta Resolução",
            description: "Fotografia publicitária pensada para cardápios, catálogos e e-commerce. Iluminação que valoriza a textura e as cores do seu produto para aumentar vendas." 
        },
        comm_video: { 
            unit: 500, 
            label: "Comércio (Vídeo)",
            composition: "Vídeos Verticais (Reels/TikTok)",
            description: "Produção de vídeos curtos com edição ágil, transições modernas e trilha sonora em alta. Foco total em retenção de audiência e engajamento nas redes sociais." 
        },
        comm_combo: { 
            videoBase: 700, 
            label: "Combo (Foto + Vídeo)",
            composition: "10 Fotos + 1 Reel",
            // CORREÇÃO: Valor do vídeo adicional atualizado de R$ 350 para R$ 500
            description: "O pacote completo para posicionamento digital. Inclui 10 fotos tratadas e 1 Reel editado. (Adicionais: R$ 20/foto e R$ 500/vídeo)." 
        },
        realtime: { fixed: 300, label: "Receber material na hora" }
    },
    studio: {
        studio_photo: { 
            unit: 25, 
            label: "Estúdio (Fotos)",
            composition: "Sessão em Fundo Infinito",
            description: "Sessão em estúdio profissional com fundo infinito e iluminação de cinema controlada. Perfeito para retratos corporativos, moda ou produtos que exigem perfeição técnica." 
        },
        studio_video: { 
            base: 350, 
            hoursIncluded: 2, 
            hourPrice: 250, 
            label: "Estúdio (Vídeo)",
            composition: "Gravação com Iluminação Profissional",
            description: "Ideal para Videocasts, Cursos Online ou Institucionais. Ambiente acústico tratado e setup pronto para gravar conteúdos densos com qualidade de TV." 
        },
    },
    video_production: {
        photo_cap: { unit: 25, label: "Fotos", composition: "Cobertura fotográfica", description: "Fotos em alta resolução." },
        cam_cap: { fixed: 350, label: "Gravação com câmera", composition: "Câmera Profissional", description: "Captação de vídeo de alta qualidade com equipamento profissional." },
        mobile_cap: { fixed: 200, label: "Gravação com celular", composition: "iPhone/Smartphone", description: "Captação dinâmica focada em redes sociais." },
        drone: { fixed: 250, label: "Drone (Aéreo)", composition: "1 Bateria (Aprox. 20min)", description: "Imagens aéreas." },
        edit_30s: { unit: 150, label: "Edição (30s)", composition: "Edição até 30s", description: "Edição de vídeo para redes sociais." },
        edit_1min: { unit: 250, label: "Edição (1 min)", composition: "Edição até 1min", description: "Edição de vídeo para redes sociais." },
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
