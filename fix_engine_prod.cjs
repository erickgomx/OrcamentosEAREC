const fs = require('fs');
let code = fs.readFileSync('src/core/PricingEngine.ts', 'utf8');

const oldEngine = `  private static calculateProduction(state: QuoteState, ctx: PricingContext): PricingResult {
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
      total += table.cam_cap.fixed; 
      breakdown.push({ label: \`\${table.cam_cap.label} (Base 2h)\`, value: table.cam_cap.fixed, type: 'base' }); 
      
      if (hours > 2) {
          const extraVal = (hours - 2) * 200;
          total += extraVal;
          breakdown.push({ label: \`Horas Extras (+\${hours - 2}h)\`, value: extraVal, type: 'addon' });
      }
    }
    else if (serviceId === 'mobile_cap') { 
      total += table.mobile_cap.fixed; 
      breakdown.push({ label: \`\${table.mobile_cap.label} (Base 2h)\`, value: table.mobile_cap.fixed, type: 'base' }); 
      
      if (hours > 2) {
          const extraVal = (hours - 2) * 150;
          total += extraVal;
          breakdown.push({ label: \`Horas Extras (+\${hours - 2}h)\`, value: extraVal, type: 'addon' });
      }
    }
    else if (serviceId === 'drone') { 
      const val = qty * table.drone.fixed; 
      total += val; 
      breakdown.push({ label: \`\${table.drone.label} (\${qty} baterias)\`, value: val, type: 'base' }); 
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }`;

const newEngine = `  private static calculateProduction(state: QuoteState, ctx: PricingContext): PricingResult {
    const { camCapHours = 0, mobileCapHours = 0, editQty = 0, droneQty = 0 } = state;
    const table = AppConfig.PRICING_TABLE.video_production;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    if (camCapHours > 0) { 
      total += table.cam_cap.fixed; 
      breakdown.push({ label: \`\${table.cam_cap.label} (Base 2h)\`, value: table.cam_cap.fixed, type: 'base' }); 
      if (camCapHours > 2) {
          const extraVal = (camCapHours - 2) * 200;
          total += extraVal;
          breakdown.push({ label: \`\${table.cam_cap.label} Extras (+\${camCapHours - 2}h)\`, value: extraVal, type: 'addon' });
      }
    }

    if (mobileCapHours > 0) { 
      total += table.mobile_cap.fixed; 
      breakdown.push({ label: \`\${table.mobile_cap.label} (Base 2h)\`, value: table.mobile_cap.fixed, type: 'base' }); 
      if (mobileCapHours > 2) {
          const extraVal = (mobileCapHours - 2) * 150;
          total += extraVal;
          breakdown.push({ label: \`\${table.mobile_cap.label} Extras (+\${mobileCapHours - 2}h)\`, value: extraVal, type: 'addon' });
      }
    }
    
    if (editQty > 0) {
      const val = editQty * table.edit_only.unit;
      total += val;
      breakdown.push({ label: \`\${table.edit_only.label} (\${editQty}x)\`, value: val, type: 'base' });
    }

    // Drone can also be added here directly
    if (droneQty > 0) { 
      const val = droneQty * table.drone.fixed; 
      total += val; 
      breakdown.push({ label: \`\${table.drone.label} (\${droneQty} baterias)\`, value: val, type: 'base' }); 
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }`;

code = code.replace(oldEngine, newEngine);

fs.writeFileSync('src/core/PricingEngine.ts', code);
