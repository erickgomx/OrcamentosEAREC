
// Definições de Entidades do Sistema

export type LocationType = 'studio' | 'external';
export type OccasionType = 'institutional' | 'social' | 'advertising' | 'custom';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  isIncluded?: boolean; // Novo campo para itens "Inclusos" (R$ 0)
  type: 'fixed' | 'variable_photo' | 'variable_video'; // Tipo de item
}

export interface ClientData {
  name: string;
  location: string;
  date: string;
  contact: string;
  company?: string; // Opcional agora, foco na pessoa/projeto
  projectTitle?: string;
}

export interface QuoteData {
  id: string;
  client: ClientData;
  date: string;
  validUntil: string;
  basePrice: number; // Preço de saída da equipe
  studioFee: number; // Taxa extra se for estúdio
  photoUnitPrice: number;
  videoUnitPrice: number;
  pricePerKm: number; // Preço por Km rodado (Logística)
  items: ServiceItem[]; // Itens fixos descritivos (ex: Roteiro)
  moodboardImages: string[];
}

// Props Types
export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  price?: number;
}
