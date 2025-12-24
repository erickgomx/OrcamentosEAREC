
// === DEFINIÇÕES DE TIPO DE DOMÍNIO (DDD) ===
// Este arquivo centraliza todas as interfaces que modelam o negócio.

// Tipos de Locação (Afetam o cálculo de frete)
export type LocationType = 'studio' | 'external';

// Tipos de Ocasião (Usados para categorização na mensagem final)
export type OccasionType = 'institutional' | 'advertising' | 'social' | 'wedding' | 'custom';

// Categorias principais de Serviço (Abas do Configurador)
export type ServiceCategory = 'wedding' | 'social' | 'commercial' | 'studio' | 'video_production' | 'custom';

// IDs únicos para cada "Produto" vendável no sistema
export type ServiceId = 
  | 'birthday' | 'fifteen' | 'graduation' | 'baptism'
  | 'wedding_base' | 'wedding_classic' | 'wedding_romance' | 'wedding_essence'
  | 'comm_photo' | 'comm_video' | 'comm_combo'
  | 'studio_photo' | 'studio_video'
  | 'edit_only' | 'cam_cap' | 'mobile_cap' | 'drone'
  | 'custom_project';

// Estado persistente da tela de Orçamento
export interface QuoteState {
  category: ServiceCategory | null; // Alterado para permitir nulo (sem seleção)
  serviceId: ServiceId;
  hours: number;
  qty: number;
  addDrone: boolean;
  addRealTime: boolean;
  selectionMode: 'duration' | 'quantity'; // Novo: Define se cobra por tempo ou por entrega
}

// Estrutura de um item individual dentro de um orçamento
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  isIncluded?: boolean;
  type: 'fixed' | 'variable_photo' | 'variable_video';
}

// Dados do Cliente (Input do Formulário Inicial)
export interface ClientData {
  name: string;
  location: string;
  date: string;     // Formato ISO string (YYYY-MM-DD)
  contact: string;  // Telefone ou Email
  company?: string;
  projectTitle?: string;
}

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

// Props para componentes de UI
export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  price?: number;
}

// --- NOVOS TIPOS PARA A FASE 2 (POO) ---

export interface PriceBreakdownItem {
  label: string;
  value: number;
  type: 'base' | 'addon' | 'freight';
}

export interface PricingResult {
  totalPrice: number;
  breakdown: PriceBreakdownItem[];
  currency: string;
}

export interface PricingContext {
  pricePerKm: number;
  photoUnitPrice: number;
  videoUnitPrice: number;
  distance: number;
  isQuickMode?: boolean; // Nova flag para controlar lógica de frete "A consultar"
}