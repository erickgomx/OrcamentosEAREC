import {
  getHardwareModelUrl,
  getPortfolioPhotoUrl,
  getReelVideoUrl,
  getTeamPhotoUrl,
} from '../utils/assetPaths';

export interface HardwareItem {
  id: string;
  index: number;
  name: string;
  pillar: string;
  modelUrl: string | null;
  worldPosition: [number, number, number];
  baseRotationY?: number;
  specs: string[];
  description: string;
  sectionAnchorId: string;
}

export interface CaseItem {
  id: number;
  code: string;
  title: string;
  client: string;
  category: string;
  aspect: '16:9' | '9:16' | '3:4';
  videoUrl: string;
  duration: string;
  cameraUsed: string;
  colorProfile: string;
  deliverable: string;
  synopsis: string;
}

export type PhotoCategory =
  | 'Aniversário'
  | 'Barbearia'
  | 'Batizado'
  | 'Casamento'
  | 'Corporativo'
  | 'Esportiva'
  | 'Gastronomia'
  | 'Joias'
  | 'Turismo & Passeios';

export interface PhotoItem {
  id: string;
  filename: string;
  url: string;
  category: PhotoCategory;
  title: string;
  orientation: 'portrait' | 'landscape';
}

export interface ActDefinition {
  id: number;
  code: string;
  label: string;
  shortLabel: string;
  sectionId: string;
}

export const BRAND_CONTACT = {
  handle: '@earecmidia',
  instagramUrl: 'https://www.instagram.com/earecmidia/',
  websiteLabel: 'www.earec.com.br',
  websiteUrl: 'https://www.earec.com.br',
  whatsappBaseUrl: 'https://wa.me/5500000000000',
  email: 'contato@earec.com.br',
} as const;

export const ACTS: ActDefinition[] = [
  {
    id: 0,
    code: 'ATO 01',
    label: 'Portal REC',
    shortLabel: 'INÍCIO',
    sectionId: 'act-portal',
  },
  {
    id: 1,
    code: 'ATO 02',
    label: 'Estrutura & Tecnologia',
    shortLabel: 'ESTRUTURA',
    sectionId: 'act-hardware',
  },
  {
    id: 2,
    code: 'ATO 03',
    label: 'Pós-Produção & Scopes',
    shortLabel: 'ACABAMENTO',
    sectionId: 'act-post',
  },
  {
    id: 3,
    code: 'ATO 04',
    label: 'Filmes & Produções',
    shortLabel: 'FILMES',
    sectionId: 'act-gallery',
  },
  {
    id: 4,
    code: 'ATO 05',
    label: 'Fotografia Profissional',
    shortLabel: 'FOTOGRAFIA',
    sectionId: 'act-photos',
  },
  {
    id: 5,
    code: 'ATO 06',
    label: 'Fundadores & Empresa',
    shortLabel: 'QUEM SOMOS',
    sectionId: 'act-team',
  },
  {
    id: 6,
    code: 'ATO 07',
    label: 'Solicitar Orçamento',
    shortLabel: 'ORÇAMENTO',
    sectionId: 'act-cta',
  },
];

export const HARDWARE_RIGS: HardwareItem[] = [
  {
    id: 'sony-a6100',
    index: 0,
    name: 'Sony A6400',
    pillar: 'PILAR 01 // FILMES & REELS DE ALTA RETENÇÃO',
    modelUrl: getHardwareModelUrl('camera_sony_a6100.glb'),
    worldPosition: [-1.55, -7.0, 0],
    baseRotationY: -Math.PI / 2,
    specs: [
      '4K UHD Oversampled (6K)',
      'Fast Hybrid AF 425pts',
      'Sensor APS-C 24.2MP',
      'Perfis S-Log2 / S-Log3 & HLG',
    ],
    description:
      'Nitidez cirúrgica e movimento fluido para campanhas, anúncios e vídeos verticais que prendem a atenção nos primeiros segundos e posicionam sua marca acima da concorrência.',
    sectionAnchorId: 'rig-sony',
  },
  {
    id: 'canon-400d',
    index: 1,
    name: 'Canon SL2',
    pillar: 'PILAR 02 // FOTOGRAFIA EDITORIAL & RETRATOS',
    modelUrl: getHardwareModelUrl('camera_canon_eos_400d.glb'),
    worldPosition: [1.55, -13.5, 0],
    specs: [
      'Sensor APS-C 24.2MP',
      'RAW 14-bit Workflow',
      'Dual Pixel CMOS AF',
      'Ótica Canon EF / EF-S',
    ],
    description:
      'Cores fiéis, luz esculpida e riqueza de detalhes para retratos corporativos, produtos e eventos onde cada textura precisa transmitir valor imediato.',
    sectionAnchorId: 'rig-canon',
  },
  {
    id: 'dji-mini-3-pro',
    index: 2,
    name: 'DJI Mini 3',
    pillar: 'PILAR 03 // PERSPECTIVA AÉREA & DRONE',
    modelUrl: getHardwareModelUrl('dji_3_mini_pro.glb'),
    worldPosition: [-1.55, -20.0, 0],
    specs: [
      '4K/30fps HDR Nativo',
      'Sensor 1/1.3" f/1.7',
      'Vertical Real 9:16',
      'Gimbal Tri-Axial <249g',
    ],
    description:
      'Ângulos cinematográficos que revelam a grandiosidade de empreendimentos, paisagens e eventos — já captados nos formatos certos para telas grandes e redes sociais.',
    sectionAnchorId: 'rig-dji',
  },
];

/**
 * ============================================================================
 * COMO ADICIONAR NOVOS VÍDEOS / REELS NO FUTURO:
 * 1. Coloque o arquivo .mp4 em: public/REELS/ (ex.: "Reel (6).mp4").
 * 2. Adicione um novo objeto abaixo em PORTFOLIO_CASES com id sequencial (6, 7...),
 *    aspect: '16:9' (horizontal) ou '9:16' (vertical) e videoUrl: getReelVideoUrl(6).
 *    (A espiral 3D, a altura de rolagem e os botões do HUD se ajustam sozinhos!)
 * ============================================================================
 */
export const PORTFOLIO_CASES: CaseItem[] = [
  {
    id: 1,
    code: 'CASE // 01 • WIDESCREEN',
    title: 'Filme Institucional & Comercial',
    client: 'Campanha Performance',
    category: 'Audiovisual 16:9',
    aspect: '16:9',
    videoUrl: getReelVideoUrl(1),
    duration: '00:48',
    cameraUsed: 'Sony A6400 + Prime 35mm',
    colorProfile: 'EA REC LUT // Rec.709 Contrast',
    deliverable: 'Master Widescreen 16:9 • 60fps',
    synopsis:
      'Produção horizontal pensada para apresentar empresas, lançamentos e campanhas com autoridade. Cortes dinâmicos, áudio imersivo e visual de cinema que geram confiança instantânea no seu cliente.',
  },
  {
    id: 2,
    code: 'REEL // 02',
    title: 'Perspectiva Aérea & Arquitetura',
    client: 'Arquitetura & Mobilidade',
    category: 'Captação Aérea Drone',
    aspect: '9:16',
    videoUrl: getReelVideoUrl(2),
    duration: '00:34',
    cameraUsed: 'DJI Mini 3 • Vertical Nativo',
    colorProfile: 'True Color HDR Graded',
    deliverable: 'Reel Vertical 9:16 • 4K HDR',
    synopsis:
      'Voos fluidos e transições precisas que valorizam imóveis, destinos turísticos e grandes estruturas, criando desejo imediato em quem assiste pelo celular.',
  },
  {
    id: 3,
    code: 'REEL // 03',
    title: 'Estética de Produto & Posicionamento',
    client: 'Posicionamento de Marca',
    category: 'Brand Film',
    aspect: '9:16',
    videoUrl: getReelVideoUrl(3),
    duration: '00:42',
    cameraUsed: 'Sony A6400 + Luz Contínua',
    colorProfile: 'Film Halation & Grain',
    deliverable: 'Hero Vertical + Stills RAW',
    synopsis:
      'Direção de luz pensada para destacar cada detalhe, brilho e textura do seu produto — transformando vitrines digitais em desejo de compra.',
  },
  {
    id: 4,
    code: 'REEL // 04',
    title: 'Cobertura de Eventos & Bastidores',
    client: 'Cobertura Live Action',
    category: 'Aftermovie & Social',
    aspect: '9:16',
    videoUrl: getReelVideoUrl(4),
    duration: '00:29',
    cameraUsed: 'Dual Cam + Gimbal',
    colorProfile: 'Lumetri Scopes Balanced',
    deliverable: 'Entrega Express 24h • 9:16',
    synopsis:
      'A energia real do seu evento capturada com agilidade e entregue em tempo recorde, pronta para gerar engajamento enquanto o assunto ainda está em alta.',
  },
  {
    id: 5,
    code: 'REEL // 05',
    title: 'Conteúdo Vertical de Alta Performance',
    client: 'Série High-Retention',
    category: 'Pós-Produção Avançada',
    aspect: '9:16',
    videoUrl: getReelVideoUrl(5),
    duration: '00:36',
    cameraUsed: 'Hybrid Cinema + Drone',
    colorProfile: 'ACES / Rec.709 Master',
    deliverable: 'Pacote Multi-Formato',
    synopsis:
      'Vídeos curtos com ritmo acelerado, design sonoro e acabamento visual desenhados para parar o dedo no feed e multiplicar o alcance orgânico da sua marca.',
  },
  {
    id: 6,
    code: 'REEL // 06',
    title: 'Narrativa Dinâmica & Engajamento',
    client: 'Produção Social First',
    category: 'Reels & Performance',
    aspect: '9:16',
    videoUrl: getReelVideoUrl(6),
    duration: '00:35',
    cameraUsed: 'Sony A6400 + Gimbal',
    colorProfile: 'EA REC Cinema Grade',
    deliverable: 'Reel Vertical 9:16 • 60fps',
    synopsis:
      'Captação ágil com movimentos precisos, cortes no compasso da trilha e tratamento de cor cinematográfico para destacar marcas, negócios e experiências reais.',
  },
  {
    id: 7,
    code: 'REEL // 07',
    title: 'Formato Editorial & Presença no Feed',
    client: 'Campanha Criativa 3:4',
    category: 'Editorial & Feed',
    aspect: '3:4',
    videoUrl: getReelVideoUrl(7),
    duration: '00:10',
    cameraUsed: 'Sony A6400 • Enquadramento 3:4',
    colorProfile: 'EA REC Film Tone',
    deliverable: 'Master Editorial 3:4 • 30fps',
    synopsis:
      'Proporção 3:4 pensada para ocupar o máximo de área nobre no feed e em anúncios patrocinados, unindo impacto visual imediato e enquadramento de revista.',
  },
];

/**
 * ============================================================================
 * COMO ADICIONAR NOVAS FOTOS NO FUTURO:
 * 1. Coloque a imagem .webp otimizada (recomendado até 1600px no lado maior)
 *    em: public/fotos portifolio/
 * 2. Adicione 1 linha abaixo em RAW_PHOTOS no formato:
 *    ['NomeDoArquivo (1).webp', 'Categoria', 'landscape' | 'portrait'],
 *    Os 3 trilhos parallax, filtros e o Lightbox atualizam automaticamente.
 *    Se criar uma categoria nova, adicione-a também em PhotoCategory e PHOTO_CATEGORIES.
 * ============================================================================
 */
const RAW_PHOTOS: Array<[string, PhotoCategory, 'portrait' | 'landscape']> = [
  ['15 Anos (1).webp', 'Aniversário', 'portrait'],
  ['15 Anos (2).webp', 'Aniversário', 'landscape'],
  ['15 Anos (3).webp', 'Aniversário', 'landscape'],
  ['15 Anos (4).webp', 'Aniversário', 'portrait'],
  ['Barbearia (1).webp', 'Barbearia', 'portrait'],
  ['Barbearia (2).webp', 'Barbearia', 'portrait'],
  ['Barbearia (3).webp', 'Barbearia', 'portrait'],
  ['Barbearia (4).webp', 'Barbearia', 'portrait'],
  ['Batizado (1).webp', 'Batizado', 'landscape'],
  ['Batizado (2).webp', 'Batizado', 'portrait'],
  ['Batizado (3).webp', 'Batizado', 'landscape'],
  ['Batizado (4).webp', 'Batizado', 'portrait'],
  ['Casamento (1).webp', 'Casamento', 'landscape'],
  ['Casamento (2).webp', 'Casamento', 'landscape'],
  ['Casamento (3).webp', 'Casamento', 'portrait'],
  ['Casamento (4).webp', 'Casamento', 'portrait'],
  ['Comida (1).webp', 'Gastronomia', 'landscape'],
  ['Comida (5).webp', 'Gastronomia', 'landscape'],
  ['Comida (6).webp', 'Gastronomia', 'landscape'],
  ['Comida (7).webp', 'Gastronomia', 'landscape'],
  ['Corporativo (1).webp', 'Corporativo', 'landscape'],
  ['Corporativo (2).webp', 'Corporativo', 'landscape'],
  ['Corporativo (3).webp', 'Corporativo', 'portrait'],
  ['Corporativo (4).webp', 'Corporativo', 'portrait'],
  ['Esportiva (1).webp', 'Esportiva', 'portrait'],
  ['Esportiva (2).webp', 'Esportiva', 'landscape'],
  ['Esportiva (3).webp', 'Esportiva', 'landscape'],
  ['Esportiva (4).webp', 'Esportiva', 'portrait'],
  ['Joias (1).webp', 'Joias', 'portrait'],
  ['Joias (2).webp', 'Joias', 'portrait'],
  ['Joias (3).webp', 'Joias', 'portrait'],
  ['Joias (4).webp', 'Joias', 'portrait'],
  ['Passeios (1).webp', 'Turismo & Passeios', 'landscape'],
  ['Passeios (2).webp', 'Turismo & Passeios', 'landscape'],
  ['Passeios (3).webp', 'Turismo & Passeios', 'landscape'],
  ['Passeios (4).webp', 'Turismo & Passeios', 'portrait'],
];

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  'Corporativo',
  'Casamento',
  'Aniversário',
  'Joias',
  'Gastronomia',
  'Turismo & Passeios',
  'Esportiva',
  'Barbearia',
  'Batizado',
];

export const PORTFOLIO_PHOTOS: PhotoItem[] = RAW_PHOTOS.map(
  ([filename, category, orientation]) => ({
    id: filename.replace(/\.webp$/i, ''),
    filename,
    url: getPortfolioPhotoUrl(filename),
    category,
    title: filename
      .replace(/\.webp$/i, '')
      .replace(/^15 Anos/, category)
      .replace(/^Comida/, category),
    orientation,
  })
);

export interface TeamChapter {
  id: 'ary' | 'erick' | 'ericles' | 'laiz' | 'company';
  indexLabel: string;
  eyebrow: string;
  name: string;
  role: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  imageAlt: string;
  /** 'left' = foto à esquerda e texto à direita; 'right' = foto à direita e texto à esquerda */
  imageSide: 'left' | 'right';
}

export const TEAM_CHAPTERS: TeamChapter[] = [
  {
    id: 'ary',
    indexLabel: '01',
    eyebrow: '01 // DIREÇÃO DE FOTOGRAFIA',
    name: 'Ary',
    role: 'Sócia-Fundadora • Fotógrafa',
    description:
      'À frente de toda a fotografia da EA REC, Ary une olhar editorial, domínio de luz e sensibilidade para dirigir pessoas com naturalidade. De retratos corporativos e campanhas de joias a casamentos e celebrações, seu foco é criar imagens atemporais que transmitam verdade e sofisticação.',
    highlights: ['Direção de Arte', 'Retratos & Marcas', 'Eventos & Ensaios'],
    imageUrl: getTeamPhotoUrl('ary.png'),
    imageAlt: 'Ary — Sócia-fundadora e fotógrafa da EA REC',
    imageSide: 'left',
  },
  {
    id: 'erick',
    indexLabel: '02',
    eyebrow: '02 // DIREÇÃO AUDIOVISUAL & PÓS-PRODUÇÃO',
    name: 'Erick',
    role: 'Sócio-Fundador • Filmmaker & Editor',
    description:
      'Responsável pela direção de vídeo, operação de câmeras, voos de drone e finalização de cor. Erick conduz cada projeto desde o roteiro visual até o corte final, combinando ritmo, áudio e estética cinematográfica para transformar vídeos em ferramentas reais de posicionamento e venda.',
    highlights: ['Filmes & Reels', 'Captação Aérea', 'Edição & Cor'],
    imageUrl: getTeamPhotoUrl('erick.webp'),
    imageAlt: 'Erick — Sócio-fundador, filmmaker e editor da EA REC',
    imageSide: 'right',
  },
  {
    id: 'ericles',
    indexLabel: '03',
    eyebrow: '03 // OPERAÇÃO AÉREA & PERFORMANCE DIGITAL',
    name: 'Éricles',
    role: 'Piloto de Drone • Gestor de Tráfego Pago',
    description:
      'Une precisão nos céus e estratégia nos bastidores digitais. Na captação aérea, conduz voos cinematográficos que revelam ângulos imponentes de eventos, imóveis e empresas; no tráfego pago, faz com que os criativos produzidos pela EA REC alcancem o público certo e gerem resultado real em vendas e posicionamento.',
    highlights: ['Voos Cinematográficos', 'Tráfego Pago & Ads', 'Performance & Escala'],
    imageUrl: getTeamPhotoUrl('éricles.webp'),
    imageAlt: 'Éricles — Piloto de drone e estrategista de tráfego pago da EA REC',
    imageSide: 'left',
  },
  {
    id: 'laiz',
    indexLabel: '04',
    eyebrow: '04 // PRESENÇA DE CÂMERA & CAMPANHAS',
    name: 'Laiz',
    role: 'Modelo Oficial • Casting & Lifestyle',
    description:
      'O rosto e a expressividade que dão vida às produções comerciais e editoriais da EA REC. Com presença natural diante das lentes e versatilidade para diferentes estilos de marca, Laiz humaniza campanhas de moda, joias, gastronomia e experiências — conectando o produto ao desejo do público.',
    highlights: ['Editorial & Moda', 'Campanhas de Marca', 'Expressão & Lifestyle'],
    imageUrl: getTeamPhotoUrl('Laiz.webp'),
    imageAlt: 'Laiz — Modelo oficial de campanhas e editoriais da EA REC',
    imageSide: 'right',
  },
  {
    id: 'company',
    indexLabel: '05',
    eyebrow: '05 // A PRODUTORA',
    name: 'EA REC Mídia',
    role: 'Equipe Integrada • Da captação à performance',
    description:
      'A EA REC nasceu para resolver um problema comum do mercado: contratar profissionais separados e receber materiais que não conversam entre si. Trabalhando em sintonia — direção de fotografia, cinema, drone, casting e tráfego — entregamos identidade visual unificada e padrão de cinema do planejamento à conversão.',
    highlights: ['Foto e Vídeo Integrados', 'Padrão Cinema', 'Criativo + Performance'],
    imageUrl: getTeamPhotoUrl('erick-e-ary.jpeg'),
    imageAlt: 'Erick e Ary juntos — Sócios-fundadores da produtora EA REC Mídia',
    imageSide: 'left',
  },
];

let budgetNavigationHandler: (() => void) | null = null;

export function setBudgetNavigationHandler(handler: (() => void) | null): void {
  budgetNavigationHandler = handler;
}

export function navigateToBudgetCategories(onNavigateQuote?: () => void): void {
  if (onNavigateQuote) {
    onNavigateQuote();
    return;
  }
  if (budgetNavigationHandler) {
    budgetNavigationHandler();
    return;
  }
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', '/orcamento');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

export function buildWhatsAppBudgetUrl(_caseTitle?: string): string {
  return '/orcamento';
}
