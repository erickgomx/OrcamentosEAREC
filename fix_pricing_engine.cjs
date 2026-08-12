const fs = require('fs');
let code = fs.readFileSync('src/core/PricingEngine.ts', 'utf8');

const regex = /private static calculateProduction[\s\S]*?return \{ totalPrice: total, breakdown, currency: 'BRL' \};\n  \}/;

const newCode = `private static calculateProduction(state: QuoteState, ctx: PricingContext): PricingResult {
    const { serviceId, qty, videoQty, droneQty } = state;
    const table = AppConfig.PRICING_TABLE.video_production;
    const breakdown: PriceBreakdownItem[] = [];
    let total = 0;

    if (serviceId === 'custom_bundle') {
      if (qty > 0) {
        const val = qty * 25;
        total += val;
        breakdown.push({ label: \`Fotos (\${qty}x)\`, value: val, type: 'base' });
      }
      if (videoQty > 0) {
        const val = videoQty * 350;
        total += val;
        breakdown.push({ label: \`Vídeos (\${videoQty}x)\`, value: val, type: 'base' });
      }
      if (droneQty > 0) {
        const val = droneQty * table.drone.fixed;
        total += val;
        breakdown.push({ label: \`Drone (\${droneQty} baterias)\`, value: val, type: 'base' });
      }
    } else {
        // Fallback for old states if any
        total += 0;
    }

    return { totalPrice: total, breakdown, currency: 'BRL' };
  }`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/core/PricingEngine.ts', code);
