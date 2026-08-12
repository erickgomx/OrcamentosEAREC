const fs = require('fs');
let code = fs.readFileSync('src/core/PricingEngine.ts', 'utf8');

code = code.replace(
`      if (videoQty > 0) {
        const videoPrice = 350; // Preço padrão de vídeo extra
        const val = videoQty * videoPrice;
        total += val;
        breakdown.push({ label: \`Vídeos (\${videoQty}x)\`, value: val, type: 'base' });
      }`,
`      if (videoQty > 0) {
        const videoPrice = 350; // Preço padrão de vídeo extra
        const val = videoQty * videoPrice;
        total += val;
        breakdown.push({ label: \`Vídeos (\${videoQty}x)\`, value: val, type: 'base' });
      }
      
      // droneQty em custom_bundle usa state.droneQty
      const { droneQty = 0 } = state;
      if (droneQty > 0) {
        const dronePrice = AppConfig.PRICING_TABLE.video_production.drone.fixed;
        const val = droneQty * dronePrice;
        total += val;
        breakdown.push({ label: \`Drone (\${droneQty}x Baterias)\`, value: val, type: 'base' });
      }`
);

fs.writeFileSync('src/core/PricingEngine.ts', code);
