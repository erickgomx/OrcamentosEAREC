
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
    const { serviceId, hours, qty, selectionMode, videoQty, videoDevice } = state;
    const table = AppConfig.PRICING_TABLE.social;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    if (serviceId === 'graduation') {
      total += table.graduation.base;
      breakdown.push({ label: table.graduation.label, value: table.graduation.base, type: 'base' });
      
      if (state.selectionMode === 'duration' && hours > table.graduation.hoursIncluded) {
         const extraVal = (hours - table.graduation.hoursIncluded) * table.graduation.hourPrice;
         if (extraVal > 0) {
             total += extraVal;
             breakdown.push({ label: `Horas Extras (+${hours}h)`, value: extraVal, type: 'addon' });
         }
      }
    } else if (serviceId === 'social_video') {
      const isCam = videoDevice === 'camera';
      const unitVal = isCam ? table.social_video.unitCamera : table.social_video.unitMobile;
      const count = Math.max(1, videoQty || qty || 1);
      const val = count * unitVal;
      total += val;
      breakdown.push({
        label: `Vídeo Social (${isCam ? 'Câmera' : 'Mobile'}) x${count}`,
        value: val,
        type: 'base'
      });
    } else {
      // Birthday / Fifteen / Baptism / Party / Event
      let ref;
      if (serviceId === 'baptism') ref = table.baptism;
      else if (serviceId === 'fifteen') ref = table.fifteen;
      else if (serviceId === 'social_party') ref = table.social_party;
      else if (serviceId === 'social_event') ref = table.social_event;
      else ref = table.birthday; // Default
      
      if (selectionMode === 'duration') {
        total += ref.base;
        breakdown.push({ label: `${ref.label} (Base 2h)`, value: ref.base, type: 'base' });
        
        if (hours > ref.hoursIncluded) {
          const extraHoursVal = (hours - ref.hoursIncluded) * ref.hourPrice;
          total += extraHoursVal;
          breakdown.push({ label: `Horas Extras (+${hours - ref.hoursIncluded}h)`, value: extraHoursVal, type: 'addon' });
        }
      } else {
        // Cobrança por foto: Base de 10 fotos por R$ 250 ("A partir de R$ 250")
        const photoQty = Math.max(10, qty || 10);
        const val = 250 + ((photoQty - 10) * ctx.photoUnitPrice);
        total += val;
        breakdown.push({ label: `${ref.label} (${photoQty} Fotos - Base 10)`, value: val, type: 'base' });
      }
    }

    // Adicional opcional de vídeo no Social (seja mobile ou câmera)
    if (serviceId !== 'social_video' && videoQty && videoQty > 0) {
      const isCam = videoDevice === 'camera';
      const videoUnitPrice = isCam ? 600 : 350;
      const videoTotal = videoQty * videoUnitPrice;
      total += videoTotal;
      breakdown.push({
        label: `Vídeo Social (${isCam ? 'Câmera' : 'Mobile'}) x${videoQty}`,
        value: videoTotal,
        type: 'addon'
      });
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }

  private static calculateCommercial(state: QuoteState, ctx: PricingContext): PricingResult {
    const { serviceId, qty, videoQty } = state; // videoQty usado apenas no combo
    const table = AppConfig.PRICING_TABLE.commercial;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    if (serviceId === 'comm_photo') {
      // FIX: Usa o preço unitário específico de comercial (20) em vez do global (25)
      const val = qty * table.comm_photo.unit;
      total += val;
      breakdown.push({ label: `${table.comm_photo.label} (${qty}x)`, value: val, type: 'base' });
    }
    else if (serviceId === 'comm_video') {
      const isCamera = state.videoDevice === 'camera';
      const unitPrice = isCamera ? (table.comm_video.unitCamera || 600) : (table.comm_video.unitMobile || 350);
      const val = qty * unitPrice;
      total += val;
      const deviceName = isCamera ? 'Câmera' : 'Mobile';
      breakdown.push({ label: `Vídeo Comercial ${deviceName} (${qty}x)`, value: val, type: 'base' });
    }
    else if (serviceId === 'comm_combo') {
      const isCamera = state.videoDevice === 'camera';
      const baseVal = isCamera ? (table.comm_combo.videoBaseCamera || 850) : (table.comm_combo.videoBaseMobile || 600);
      const deviceName = isCamera ? 'Câmera' : 'Mobile';
      total += baseVal;
      breakdown.push({ label: `Pacote Comercial ${deviceName} (10F + 1V)`, value: baseVal, type: 'base' });

      // 2. Fotos Extras (Acima de 10)
      if (qty > 10) {
          const extraPhotos = qty - 10;
          const photoPrice = table.comm_photo.unit; // 20
          const val = extraPhotos * photoPrice;
          total += val;
          breakdown.push({ label: `Fotos Extras (+${extraPhotos})`, value: val, type: 'addon' });
      }

      // 3. Vídeos Extras (Acima de 1)
      if (videoQty > 1) {
          const extraVideos = videoQty - 1;
          const extraVideoPrice = isCamera ? (table.comm_video.unitCamera || 600) : (table.comm_video.unitMobile || 350);
          const val = extraVideos * extraVideoPrice;
          total += val;
          breakdown.push({ label: `Vídeos Extras ${deviceName} (+${extraVideos})`, value: val, type: 'addon' });
      }
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
        let val = 0;
        let labelDesc = "";
        if (qty <= 7) {
          val = 150;
          labelDesc = `${table.studio_photo.label} (7 fotos - Desconto R$ 150)`;
        } else if (qty >= 13) {
          val = 250 + ((qty - 13) * 25);
          labelDesc = qty === 13 
            ? `${table.studio_photo.label} (13 fotos - Promoção R$ 250)`
            : `${table.studio_photo.label} (${qty} fotos - Pacote 13F + ${qty - 13} adicionais)`;
        } else {
          // Progressão consistente entre 7 (150) e 13 (250)
          const stepPrices: Record<number, number> = {
            8: 170,
            9: 190,
            10: 210,
            11: 230,
            12: 240
          };
          val = stepPrices[qty] || (150 + (qty - 7) * 20);
          labelDesc = `${table.studio_photo.label} (${qty} fotos)`;
        }
        total += val;
        breakdown.push({ label: labelDesc, value: val, type: 'base' });
      } else {
        total += table.studio_video.base;
        breakdown.push({ label: `${table.studio_video.label} (2h com Câmera)`, value: table.studio_video.base, type: 'base' });
      }
    } else {
      const baseHour = table.studio_video.base; // Valor fixo para locação de estúdio com câmera (350)
      total += baseHour;
      breakdown.push({ label: `Gravação de Vídeo com Câmera no Estúdio (2h)`, value: baseHour, type: 'base' });
      
      if (hours > 2) {
        const extraVal = (hours - 2) * table.studio_video.hourPrice; // 175
        total += extraVal;
        breakdown.push({ label: `Horas Extras (+${hours - 2}h)`, value: extraVal, type: 'addon' });
      }
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }

  private static calculateProduction(state: QuoteState, ctx: PricingContext): PricingResult {
    const { camCapHours = 0, mobileCapHours = 0, edit30sQty = 0, edit1minQty = 0, droneQty = 0, qty = 0 } = state;
    const table = AppConfig.PRICING_TABLE.video_production;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;
    
    const isPJ = state.projectType === 'commercial';

    if (qty > 0) {
      const unitPrice = isPJ ? 30 : table.photo_cap.unit;
      const val = qty * unitPrice;
      total += val;
      breakdown.push({ label: `${table.photo_cap.label} (${qty}x)`, value: val, type: 'base' });
    }

    if (camCapHours > 0) { 
      const basePrice = isPJ ? 600 : table.cam_cap.base;
      const hourPrice = isPJ ? 300 : table.cam_cap.hourPrice;
      total += basePrice; 
      breakdown.push({ label: `${table.cam_cap.label} (Base 2h)`, value: basePrice, type: 'base' }); 
      if (camCapHours > 2) {
          const extraVal = (camCapHours - 2) * hourPrice;
          total += extraVal;
          breakdown.push({ label: `${table.cam_cap.label} Extras (+${camCapHours - 2}h)`, value: extraVal, type: 'addon' });
      }
    }

    if (mobileCapHours > 0) { 
      const basePrice = isPJ ? 300 : table.mobile_cap.base;
      const hourPrice = isPJ ? 150 : table.mobile_cap.hourPrice;
      total += basePrice; 
      breakdown.push({ label: `${table.mobile_cap.label} (Base 2h)`, value: basePrice, type: 'base' }); 
      if (mobileCapHours > 2) {
          const extraVal = (mobileCapHours - 2) * hourPrice;
          total += extraVal;
          breakdown.push({ label: `${table.mobile_cap.label} Extras (+${mobileCapHours - 2}h)`, value: extraVal, type: 'addon' });
      }
    }
    
    if (edit30sQty > 0) {
      const unitPrice = isPJ ? 180 : table.edit_30s.unit;
      const val = edit30sQty * unitPrice;
      total += val;
      breakdown.push({ label: `${table.edit_30s.label} (${edit30sQty}x)`, value: val, type: 'base' });
    }

    if (edit1minQty > 0) {
      const unitPrice = isPJ ? 300 : table.edit_1min.unit;
      const val = edit1minQty * unitPrice;
      total += val;
      breakdown.push({ label: `${table.edit_1min.label} (${edit1minQty}x)`, value: val, type: 'base' });
    }

    // Drone can also be added here directly
    if (droneQty > 0) {
      const unitPrice = isPJ ? 300 : table.drone.unit;
      const val = droneQty * unitPrice;
      total += val;
      breakdown.push({ label: `${table.drone.label} (${droneQty} baterias)`, value: val, type: 'base' });
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }

  // --- CÁLCULOS GLOBAIS ---

  private static applyAddonsAndFreight(state: QuoteState, ctx: PricingContext, currentResult: PricingResult): PricingResult {
    const { category, addDrone, addRealTime, commercialMode } = state;
    const { distance, pricePerKm, isQuickMode, includeFreight } = ctx;
    
    // 1. Drone (Se aplicável à categoria)
    // Regra: Drone disponível para Wedding e Social. 
    // Para Comercial, disponível APENAS se NÃO for Estúdio.
    const isCommercialStudio = category === 'commercial' && commercialMode === 'studio';
    
    if (addDrone && !isCommercialStudio && (category === 'wedding' || category === 'social' || category === 'commercial')) {
       const dronePrice = AppConfig.PRICING_TABLE.video_production.drone.unit;
       currentResult.totalPrice += dronePrice;
       currentResult.breakdown.push({ label: AppConfig.TEXTS.LABELS.ADD_DRONE, value: dronePrice, type: 'addon' });
    }

    // 2. Fotos em Tempo Real (Aplicável a Wedding, Social e Commercial)
    if (addRealTime && (category === 'wedding' || category === 'social' || category === 'commercial' || (category === 'video_production'))) {
       let realtimePrice;
       
       if (category === 'commercial') {
           realtimePrice = AppConfig.PRICING_TABLE.commercial.realtime.fixed; // 300
       } else {
           // Usamos o preço base configurado no objeto 'wedding' como referência padrão (R$ 600)
           realtimePrice = AppConfig.PRICING_TABLE.wedding.realtime.fixed;
       }
       
       const realtimeLabel = AppConfig.TEXTS.LABELS.ADD_REALTIME;
       
       currentResult.totalPrice += realtimePrice;
       currentResult.breakdown.push({ label: realtimeLabel, value: realtimePrice, type: 'addon' });
    }

    // 3. Frete / Deslocamento
    // Regra: Estúdio é SEMPRE isento, independente de distância ou modo. Edição também.
    // Se for comercial em modo ESTÚDIO, também é isento.
    const isExemptFromTravel = category === 'studio' || state.serviceId === 'edit_only' || isCommercialStudio;
    
    // SÓ ADICIONA FRETE SE O CONTEXTO PERMITIR (includeFreight)
    // Isso garante que no modo de configuração o valor exibido seja apenas dos serviços
    if (includeFreight && !isExemptFromTravel) {
      // CORREÇÃO: Prioridade para distância real > 0.
      if (distance > 0) {
        // Cálculo Normal: Ida e Volta (2x a distância)
        const freight = (distance * 2 * pricePerKm);
        currentResult.totalPrice += freight;
        currentResult.breakdown.push({ label: `Deslocamento (${distance}km x2)`, value: freight, type: 'freight' });
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
