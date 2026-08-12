const fs = require('fs');
let code = fs.readFileSync('src/core/PricingEngine.ts', 'utf8');

code = code.replace(
  `if (addDrone && !isCommercialStudio && (category === 'wedding' || category === 'social' || category === 'commercial' || (category === 'video_production' && state.serviceId !== 'custom_bundle'))) {`,
  `if (addDrone && !isCommercialStudio && (category === 'wedding' || category === 'social' || category === 'commercial')) {`
);

fs.writeFileSync('src/core/PricingEngine.ts', code);
