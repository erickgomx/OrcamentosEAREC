
import { AppConfig } from "../config/AppConfig";
import { PricingContext, PricingResult, QuoteState, PriceBreakdownItem } from "../types";

/**
 * PricingEngine
 * -------------
 * Classe responsável puramente pela lógica matemática de precificação.
 * Recebe o Estado (O que o usuário escolheu) e o Contexto (Regras de preço atuais/Admin)
 * e retorna o Resultado calculado.
 * 
 * Princípio: SRP (Single Responsibility Principle) - Esta classe só muda se a matemática mudar.
 */
export class PricingEngine {

  /**
   * Método principal de cálculo.
   */
  static calculate(state: QuoteState, context: PricingContext): PricingResult {
    const { category } = state;
    
    let result: PricingResult = {
      totalPrice: 0,
      breakdown: [],
      currency: 'BRL'
    };

    // Roteamento de Estratégia
    switch (category) {
      case 'wedding':
        result = this.calculateWedding(state, context);
        break;
      case 'social':
        result = this.calculateSocial(state, context);
        break;
      case 'commercial':
        result = this.calculateCommercial(state, context);
        break;
      case 'studio':
        result = this.calculateStudio(state, context);
        break;
      case 'video_production':
        result = this.calculateProduction(state, context);
        break;
      case 'custom':
        result = {
          totalPrice: AppConfig.PRICING_TABLE.custom.custom_project.base,
          breakdown: [{ label: AppConfig.PRICING_TABLE.custom.custom_project.label, value: 0, type: 'base' }],
          currency: 'BRL'
        };
        break;
    }

    // Cálculos Globais (Frete e Adicionais Transversais)
    result = this.applyAddonsAndFreight(state, context, result);

    return result;
  }

  // --- ESTRATÉGIAS ESPECÍFICAS POR CATEGORIA ---

  private static calculateWedding(state: QuoteState, ctx: PricingContext): PricingResult {
    const { serviceId, hours } = state;
    const table = AppConfig.PRICING_TABLE.wedding;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    // Base Price Lookup
    let baseVal = 0;
    let baseLabel = "";

    // Mapeamento seguro (Type Guarded no runtime)
    const key = serviceId as keyof typeof table;
    if (table[key] && 'base' in table[key]) {
        // @ts-ignore
        baseVal = table[key].base;
        // @ts-ignore
        baseLabel = table[key].label;
    }

    total += baseVal;
    breakdown.push({ label: baseLabel, value: baseVal, type: 'base' });

    // Horas Extras (Regra: Acima de 2h, +250/h)
    // Nota: Em casamentos, normalmente pacotes são fechados, mas mantemos a lógica caso o user altere
    if (state.selectionMode === 'duration' && hours > 2) {
      const extraHoursVal = (hours - 2) * 250;
      total += extraHoursVal;
      breakdown.push({ label: `Horas Extras (+${hours - 2}h)`, value: extraHoursVal, type: 'addon' });
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }

  private static calculateSocial(state: QuoteState, ctx: PricingContext): PricingResult {
    const { serviceId, hours, qty, selectionMode } = state;
    const table = AppConfig.PRICING_TABLE.social;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    if (serviceId === 'graduation') {
      total += table.graduation.base;
      breakdown.push({ label: table.graduation.label, value: table.graduation.base, type: 'base' });
    } else {
      // Birthday / Fifteen / Baptism
      let ref;
      if (serviceId === 'baptism') ref = table.baptism;
      else if (serviceId === 'fifteen') ref = table.fifteen;
      else ref = table.birthday;
      
      if (selectionMode === 'duration') {
        total += ref.base;
        breakdown.push({ label: `${ref.label} (Base 2h)`, value: ref.base, type: 'base' });
        
        if (hours > ref.hoursIncluded) {
          const extraHoursVal = (hours - ref.hoursIncluded) * ref.hourPrice;
          total += extraHoursVal;
          breakdown.push({ label: `Horas Extras (+${hours - ref.hoursIncluded}h)`, value: extraHoursVal, type: 'addon' });
        }
      } else {
        // Cobrança por foto
        const val = qty * ctx.photoUnitPrice; // Usa o preço configurado no Admin Context
        total += val;
        breakdown.push({ label: `${ref.label} (${qty} Fotos)`, value: val, type: 'base' });
      }
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }

  private static calculateCommercial(state: QuoteState, ctx: PricingContext): PricingResult {
    const { serviceId, qty } = state;
    const table = AppConfig.PRICING_TABLE.commercial;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    if (serviceId === 'comm_photo') {
      // Usa o preço unitário dinâmico do contexto (configurado no Admin)
      const val = qty * ctx.photoUnitPrice;
      total += val;
      breakdown.push({ label: `${table.comm_photo.label} (${qty}x)`, value: val, type: 'base' });
    }
    else if (serviceId === 'comm_video') {
      // Usa o preço unitário dinâmico do contexto (configurado no Admin)
      const val = qty * ctx.videoUnitPrice;
      total += val;
      breakdown.push({ label: `${table.comm_video.label} (${qty}x)`, value: val, type: 'base' });
    }
    else if (serviceId === 'comm_combo') {
      const val = table.comm_combo.videoBase;
      total += val;
      breakdown.push({ label: table.comm_combo.label, value: val, type: 'base' });
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }

  private static calculateStudio(state: QuoteState, ctx: PricingContext): PricingResult {
    const { serviceId, qty, hours, selectionMode } = state;
    const table = AppConfig.PRICING_TABLE.studio;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    if (selectionMode === 'quantity') {
      if (serviceId === 'studio_photo') {
        // Usa o preço unitário do contexto para consistência com o admin
        const val = qty * ctx.photoUnitPrice;
        total += val;
        breakdown.push({ label: `${table.studio_photo.label} (${qty}x)`, value: val, type: 'base' });
      } else {
        total += table.studio_video.base;
        breakdown.push({ label: table.studio_video.label, value: table.studio_video.base, type: 'base' });
      }
    } else {
      const baseHour = 350; // Valor fixo para locação de estúdio
      total += baseHour;
      breakdown.push({ label: `Sessão Estúdio (2h)`, value: baseHour, type: 'base' });
      
      if (hours > 2) {
        const extraVal = (hours - 2) * 200;
        total += extraVal;
        breakdown.push({ label: `Horas Extras (+${hours - 2}h)`, value: extraVal, type: 'addon' });
      }
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }

  private static calculateProduction(state: QuoteState, ctx: PricingContext): PricingResult {
    const { serviceId, qty } = state;
    const table = AppConfig.PRICING_TABLE.video_production;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    if (serviceId === 'edit_only') {
      const val = qty * table.edit_only.unit;
      total += val;
      breakdown.push({ label: `${table.edit_only.label} (${qty}x)`, value: val, type: 'base' });
    }
    else if (serviceId === 'cam_cap') { 
      total += table.cam_cap.fixed; 
      breakdown.push({ label: table.cam_cap.label, value: table.cam_cap.fixed, type: 'base' }); 
    }
    else if (serviceId === 'mobile_cap') { 
      total += table.mobile_cap.fixed; 
      breakdown.push({ label: table.mobile_cap.label, value: table.mobile_cap.fixed, type: 'base' }); 
    }
    else if (serviceId === 'drone') { 
      total += table.drone.fixed; 
      breakdown.push({ label: table.drone.label, value: table.drone.fixed, type: 'base' }); 
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }

  // --- CÁLCULOS GLOBAIS ---

  private static applyAddonsAndFreight(state: QuoteState, ctx: PricingContext, currentResult: PricingResult): PricingResult {
    const { category, addDrone, addRealTime } = state;
    const { distance, pricePerKm, isQuickMode } = ctx;
    
    // 1. Drone (Se aplicável à categoria)
    if (addDrone && (category === 'wedding' || category === 'social' || category === 'commercial')) {
       const dronePrice = AppConfig.PRICING_TABLE.video_production.drone.fixed;
       currentResult.totalPrice += dronePrice;
       currentResult.breakdown.push({ label: AppConfig.TEXTS.LABELS.ADD_DRONE, value: dronePrice, type: 'addon' });
    }

    // 2. Fotos em Tempo Real (Aplicável a Wedding, Social e Commercial)
    if (addRealTime && (category === 'wedding' || category === 'social' || category === 'commercial')) {
       // Usamos o preço base configurado no objeto 'wedding' como referência global (R$ 600)
       const realtimePrice = AppConfig.PRICING_TABLE.wedding.realtime.fixed;
       const realtimeLabel = AppConfig.TEXTS.LABELS.ADD_REALTIME;
       
       currentResult.totalPrice += realtimePrice;
       currentResult.breakdown.push({ label: realtimeLabel, value: realtimePrice, type: 'addon' });
    }

    // 3. Frete / Deslocamento
    // Regra: Estúdio é SEMPRE isento, independente de distância ou modo. Edição também.
    const isExemptFromTravel = category === 'studio' || state.serviceId === 'edit_only';
    
    if (!isExemptFromTravel) {
      // CORREÇÃO: Prioridade para distância real > 0.
      if (distance > 0) {
        // Cálculo Normal: Ida e Volta
        const freight = (distance * 2 * pricePerKm);
        currentResult.totalPrice += freight;
        currentResult.breakdown.push({ label: `Deslocamento (${distance}km)`, value: freight, type: 'freight' });
      } else if (isQuickMode) {
        // Modo Rápido sem local definido: "A consultar" (Valor 0, mas com label específico)
        currentResult.breakdown.push({ label: "Deslocamento (A consultar)", value: 0, type: 'freight' });
      } else {
        // Modo normal sem distância (ainda não calculou ou é perto da base)
        currentResult.breakdown.push({ label: "Deslocamento", value: 0, type: 'freight' });
      }
    } 
    // Se for Estúdio, explicitamente não adiciona nada ao breakdown, resultando em custo 0.

    return currentResult;
  }
}
