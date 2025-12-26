
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
      video_production: "Diárias para Freelancers: Equipe técnica, edição especializada e captação aérea.",
      custom: "Soluções audiovisuais sob medida para demandas específicas e projetos únicos."
    } as Record<ServiceCategory, string>,
    LABELS: {
      DURATION_MODE: "POR TEMPO (Fotos Ilimitadas)",
      QUANTITY_MODE: "POR ENTREGA (Pack de Fotos)",
      ADD_DRONE: "Imagens de Drone",
      ADD_REALTIME: "Fotos em Tempo Real",
    }
  };

  // === TABELA DE PREÇOS (BASE) ===
  // Estrutura migrada do antigo QuoteView para cá.
  // composition: O que aparece no card (Itens inclusos)
  // description: O que aparece no modal de info (Explicação detalhada/Venda)
  // CHAVES AGORA CORRESPONDEM AOS ServiceId PARA FACILITAR BUSCA
  static readonly PRICING_TABLE = {
    wedding: {
        wedding_base: { 
            base: 650, 
            label: "Casamento (Base)",
            composition: "Cerimônia + Decoração + Fotos c/ Convidados",
            description: "Cobertura focada exclusivamente na Cerimônia Religiosa ou Civil. Inclui registros detalhados da decoração e fotos protocolares com convidados."
        },
        wedding_classic: { 
            base: 900, 
            label: "Pacote Clássico",
            composition: "Pré Wedding + Casamento",
            description: "A união de dois momentos especiais. Inclui um ensaio Pré Wedding (para celebrar o noivado) e a cobertura completa do Casamento." 
        },
        wedding_romance: {
            base: 1150,
            label: "Pacote Romance",
            composition: "Pré Wedding + Making Of + Cerimônia",
            description: "Cobertura expandida para contar mais da sua história. Inclui o Ensaio Pré Wedding, o Making Of dos noivos (preparação) e a Cerimônia."
        },
        wedding_essence: { 
            base: 1750, 
            label: "Pacote Mais Essência",
            composition: "Pré + Making Of + Casamento + Vídeo",
            description: "A experiência completa. Pré Wedding, Making Of, Casamento e um Vídeo Highlight cinematográfico com os melhores momentos do grande dia." 
        },
        realtime: { fixed: 600, label: "Fotos em Tempo Real" }
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
        realtime: { fixed: 600, label: "Fotos em Tempo Real" }
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
            label: "Comércio (Foto + Vídeo)",
            composition: "10 Fotos + 1 Reel",
            description: "O pacote completo para posicionamento digital. Inclui 10 fotos tratadas e 1 Reel editado. (Adicionais: R$ 20/foto e R$ 350/vídeo)." 
        } 
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
        edit_only: { 
            unit: 250, 
            label: "Apenas Edição",
            composition: "Edição Profissional (até 1min)",
            description: "Você grava, nós editamos. Pós-produção avançada para vídeos de até 1 minuto. Inclui: Color grading, sound design e legendas." 
        },
        cam_cap: { 
            fixed: 350, 
            label: "Captação Câmera",
            composition: "Operador + Câmera Profissional",
            description: "Contrate apenas a mão de obra especializada. Operador de câmera experiente com equipamento 4K incluso (Linha Sony Alpha)." 
        },
        mobile_cap: { 
            fixed: 250, 
            label: "Captação Celular",
            composition: "Filmmaker Mobile + iPhone 13 Pro Max",
            description: "Captação ágil e discreta com iPhone 13 Pro Max. Perfeito para cobrir bastidores, eventos corporativos rápidos e conteúdo 'real-time' para stories." 
        },
        drone: { 
            fixed: 250, 
            label: "Drone (Imagens Aéreas)",
            composition: "Voo Técnico + Takes 4K",
            description: "Imagens aéreas que valorizam a locação e dão grandiosidade ao projeto. Inclui piloto certificado e drone DJI de última geração." 
        }
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
