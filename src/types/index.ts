// ============================================================================
// EAREC AUDIOVISUAL - DEFINIÇÕES DE TIPO DE DOMÍNIO (DDD / TypeScript Types)
// ============================================================================
// Olá, dev do futuro! 👋 
// Este arquivo é o "coração da verdade" de tipagem da aplicação EAREC.
// Aqui estão todas as interfaces, uniões e modelos de dados que transitam
// desde a primeira tela até a geração do orçamento em PDF/WhatsApp.
//
// DICA DE MANUTENÇÃO:
// Ao adicionar um novo serviço ou categoria, lembre-se de atualizar:
// 1. `ServiceCategory` e `ServiceId` aqui
// 2. A tabela de preços em `AppConfig.ts`
// 3. A lógica de cálculo em `PricingEngine.ts`
// 4. As opções visuais em `useQuoteLogic.ts` e `QuoteView.tsx`
// ============================================================================

// === DEFINIÇÕES DE TIPO DE DOMÍNIO (DDD) ===
// Este arquivo centraliza todas as interfaces que modelam o negócio.

/**
 * Controla as telas de navegação globais do aplicativo:
 * - 'intro': Tela inicial/boas-vindas onde o cliente escolhe a categoria inicial.
 * - 'quote': Wizard principal de orçamento (cálculo interativo e tempo real).
 * - 'confirmation': Tela de dados do cliente (nome, WhatsApp, data do evento).
 * - 'welcome': Tela de apresentação/boas-vindas legada mantida por compatibilidade.
 */
// Controle de Navegação Global
export type ViewState = 'confirmation' | 'intro' | 'welcome' | 'quote' | 'portfolio' | 'produtora';

/**
 * Define a natureza do local onde as fotos/vídeos serão captados.
 * - 'studio': Em estúdio próprio (isenta frete/deslocamento).
 * - 'external': Locação externa do cliente (calcula km de ida e volta).
 */
// Tipos de Locação (Afetam o cálculo de frete)
export type LocationType = 'studio' | 'external';

/**
 * Identifica a ocasião do evento para customizar o texto de proposta final.
 */
// Tipos de Ocasião (Usados para categorização na mensagem final)
export type OccasionType = 'institutional' | 'advertising' | 'social' | 'wedding' | 'custom';

/**
 * Categorias principais de Serviço da EAREC:
 * - 'wedding': Casamentos completos, cerimônias e ensaios pré-wedding.
 * - 'social': Aniversários, 15 anos, batizados, formaturas e festas.
 * - 'commercial': Empresas, produtos gastronômicos, moda e institucional.
 * - 'studio': Ensaios fotográficos e gravações em estúdio climatizado e equipado.
 * - 'video_production': Produção sob demanda (horas de câmera, mobile, edição, drone).
 * - 'custom': Projetos sob medida negociados diretamente via WhatsApp.
 */
// Categorias principais de Serviço (Abas do Configurador)
export type ServiceCategory = 'wedding' | 'social' | 'commercial' | 'studio' | 'video_production' | 'custom';

/**
 * Identificadores únicos de cada pacote comercial oferecido.
 * Mapeiam diretamente para as chaves da tabela AppConfig.PRICING_TABLE.
 */
// IDs únicos para cada "Produto" vendável no sistema
export type ServiceId = 
  | 'birthday' | 'fifteen' | 'graduation' | 'baptism' | 'social_party' | 'social_event' | 'social_video'
  | 'wedding_base' | 'wedding_classic' | 'wedding_romance' | 'wedding_essence'
  | 'comm_photo' | 'comm_video' | 'comm_combo'
  | 'studio_photo' | 'studio_video'
  | 'edit_only' | 'cam_cap' | 'mobile_cap' | 'drone' | 'custom_bundle'
  | 'custom_project';

/**
 * Estado dinâmico do orçamento em construção pelo usuário.
 * Este objeto guarda todas as escolhas feitas no formulário e é repassado
 * ao PricingEngine para calcular o total em tempo real.
 */
// Estado persistente da tela de Orçamento
export interface QuoteState {
  category: ServiceCategory | null; // Alterado para permitir nulo (sem seleção)
  serviceId: ServiceId;
  hours: number;
  qty: number;      // Usado para fotos ou quantidade genérica
  videoQty: number; // NOVO: Usado especificamente para vídeos em pacotes híbridos
  addDrone: boolean;
  droneQty?: number;
  addRealTime: boolean;
  selectionMode: 'duration' | 'quantity'; // Define se cobra por tempo ou por entrega
  commercialMode?: 'on_location' | 'studio';
  projectType?: 'commercial' | 'personal'; // Novo: Define local para categoria Comercial
  videoDevice?: 'mobile' | 'camera'; // Comércio apenas vídeo: 'mobile' (350) ou 'camera' (600)
  camCapHours?: number;
  mobileCapHours?: number;
  edit30sQty?: number;
  edit1minQty?: number;
}

/**
 * Representa um item ou sub-serviço avulso com título, valor e regra de cobrança.
 */
// Estrutura de um item individual dentro de um orçamento
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  isIncluded?: boolean;
  type: 'fixed' | 'variable_photo' | 'variable_video';
}

/**
 * Dados de contato e identificação do cliente coletados para envio do orçamento.
 */
// Dados do Cliente (Input do Formulário Inicial)
export interface ClientData {
  name: string;
  location: string;
  date: string;     // Formato ISO string (YYYY-MM-DD)
  contact: string;  // Telefone ou Email
  company?: string;
  projectTitle?: string;
}

/**
 * Objeto completo contendo todas as regras base e metadados de um orçamento.
 */
// Objeto Mestre de Configuração do Orçamento
export interface QuoteData {
  id: string;
  client: ClientData;
  date: string;
  validUntil: string;
  
  // Regras de Preço (Editáveis via Admin)
  basePrice: number;       
  studioFee: number;       
  photoUnitPrice: number;  
  videoUnitPrice: number;  
  pricePerKm: number;      
  
  items: ServiceItem[];
  moodboardImages: string[];
}

/**
 * Propriedades compartilhadas para o componente estilizado de Checkbox.
 */
// Props para componentes de UI
export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  price?: number;
}

// --- NOVOS TIPOS PARA A FASE 2 (POO) ---

/**
 * Linha discriminada no extrato do orçamento (Breakdown).
 * Permite ao cliente ver exatamente quanto custou a base, quanto foram os adicionais e o frete.
 */
export interface PriceBreakdownItem {
  label: string;
  value: number;
  type: 'base' | 'addon' | 'freight';
}

/**
 * Retorno estruturado do PricingEngine.
 * Contém o valor total final, a lista detalhada de itens que compõem o valor e a moeda.
 */
export interface PricingResult {
  totalPrice: number;
  breakdown: PriceBreakdownItem[];
  currency: string;
}

/**
 * Contexto externo alimentado ao PricingEngine para regras variáveis
 * (ex: distância em km, preço da foto avulsa, modo rápido sem endereço fixo).
 */
export interface PricingContext {
  pricePerKm: number;
  photoUnitPrice: number;
  videoUnitPrice: number;
  distance: number;
  isQuickMode?: boolean; // Nova flag para controlar lógica de frete "A consultar"
  includeFreight?: boolean; // Nova flag para somar o frete apenas no resumo
}
