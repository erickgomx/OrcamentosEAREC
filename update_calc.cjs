const fs = require('fs');
let code = fs.readFileSync('src/core/PricingEngine.ts', 'utf8');
code = code.replace(
`  private static calculateProduction(state: QuoteState, ctx: PricingContext): PricingResult {
    const { serviceId, qty, hours } = state;
    const table = AppConfig.PRICING_TABLE.video_production;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    if (serviceId === 'edit_only') {
      const val = qty * table.edit_only.unit;
      total += val;
      breakdown.push({ label: \`\${table.edit_only.label} (\${qty}x)\`, value: val, type: 'base' });
    }
    else if (serviceId === 'cam_cap') { 
       // IMPLEMENTAÇÃO DE HORAS EXTRAS PARA FREELANCERS
      total += table.cam_cap.fixed; 
      breakdown.push({ label: \`\${table.cam_cap.label} (Base 2h)\`, value: table.cam_cap.fixed, type: 'base' }); 
      
      if (hours > 2) {
          const extraVal = (hours - 2) * 200; // Hora extra Captação Pro
          total += extraVal;
          breakdown.push({ label: \`Horas Extras (+\${hours - 2}h)\`, value: extraVal, type: 'addon' });
      }
    }
    else if (serviceId === 'mobile_cap') { 
       total += table.mobile_cap.fixed; 
       breakdown.push({ label: \`\${table.mobile_cap.label} (Base 2h)\`, value: table.mobile_cap.fixed, type: 'base' }); 
      
       if (hours > 2) {
          const extraVal = (hours - 2) * 150; // Hora extra Mobile (Mais barato)
          total += extraVal;
          breakdown.push({ label: \`Horas Extras (+\${hours - 2}h)\`, value: extraVal, type: 'addon' });
      }
    }
    else if (serviceId === 'drone') { 
       // Alterado para multiplicar por QTY (Baterias)
      const val = qty * table.drone.fixed; 
      total += val; 
      breakdown.push({ label: \`\${table.drone.label} (\${qty}x)\`, value: val, type: 'base' }); 
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }`,
`  private static calculateProduction(state: QuoteState, ctx: PricingContext): PricingResult {
    const { serviceId, qty, videoQty } = state;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    if (serviceId === 'custom_bundle') {
      if (qty > 0) {
        const photoPrice = 25; // Preço padrão da foto
        const val = qty * photoPrice;
        total += val;
        breakdown.push({ label: \`Fotos (\${qty}x)\`, value: val, type: 'base' });
      }
      if (videoQty > 0) {
        const videoPrice = 350; // Preço padrão de vídeo extra
        const val = videoQty * videoPrice;
        total += val;
        breakdown.push({ label: \`Vídeos (\${videoQty}x)\`, value: val, type: 'base' });
      }
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }`
);

code = code.replace(
`    if (addDrone && !isCommercialStudio && (category === 'wedding' || category === 'social' || category === 'commercial')) {`,
`    if (addDrone && !isCommercialStudio && (category === 'wedding' || category === 'social' || category === 'commercial' || category === 'video_production')) {`
);

code = code.replace(
`    if (addRealTime && (category === 'wedding' || category === 'social' || category === 'commercial')) {`,
`    if (addRealTime && (category === 'wedding' || category === 'social' || category === 'commercial' || category === 'video_production')) {`
);

fs.writeFileSync('src/core/PricingEngine.ts', code);
